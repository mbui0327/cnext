import threading
import traceback
import simplejson as json

import plotly
from libs.message_handler import BaseMessageHandler
from libs.message import ContentType, SubContentType, Message

from libs import logs
from libs.message import DFManagerCommand, WebappEndpoint, CodeEditorCommand, ModelManagerCommand
from user_space.ipython.constants import IPythonConstants, IpythonResultMessage
log = logs.get_logger(__name__)


class MessageHandler(BaseMessageHandler):
    def __init__(self, p2n_queue, user_space=None):
        super(MessageHandler, self).__init__(p2n_queue, user_space)

    @staticmethod
    def _result_is_plotly_fig(content) -> bool:
        try:
            # Because IPython return plotly as json format, have to convert it to figure instance
            # Use plotly_io (low-level interface for displaying, reading and writing figures)
            plotly_figure = plotly.io.from_json(json.dumps(content))
            return hasattr(plotly.graph_objs, '_figure') and (type(plotly_figure) == plotly.graph_objs._figure.Figure)
        except Exception:
            return False

    def _process_rich_ouput(self, message, msg_ipython):
        message.error = False
        if type(msg_ipython.content['data']) is dict:
            message.type = ContentType.RICH_OUTPUT
        else:
            message.type = ContentType.STRING
        message.content = msg_ipython.content['data']

        # remove 'text/html' key if the output is plotly to improve the efficiency.
        # TODO: revisit this later #
        if type(message.content) is dict and SubContentType.APPLICATION_PLOTLY in message.content:
            message.content.pop('text/html', None)
        return message

    def _process_error_message(self, message, ipython_msg):
        # log.error("Error %s" % (msg_ipython.content['traceback']))
        if isinstance(ipython_msg.content['traceback'], list):
            content = '\n'.join(ipython_msg.content['traceback'])
        else:
            content = ipython_msg.content['traceback']
        return self._create_error_message(
            WebappEndpoint.CodeEditor, content, message.command_name, message.metadata)

    def _process_stream_message(self, message, ipython_msg):
        message.error = False
        message.type = ContentType.STRING
        if 'text' in ipython_msg.content:
            message.content = ipython_msg.content['text']
        elif 'data' in ipython_msg.content:
            message.content = ipython_msg.content['data']
        return message

    def _process_other_message(self, message, ipython_msg):
        message.error = False
        message.type = ContentType.IPYTHON_MSG
        message.sub_type = SubContentType.NONE
        message.content = ipython_msg.content
        return message

    def _create_return_message(self, ipython_message, stream_type, client_message):
        """
            Get single message from IPython,
            classify it according to the message type then return it to the client
        """
        ipython_message = IpythonResultMessage(**ipython_message)
        message = Message(**{'webapp_endpoint': WebappEndpoint.CodeEditor, 'command_name': client_message.command_name})

        log.info('Got message from ipython: %s %s',
                 ipython_message.header['msg_type'], ipython_message.content['status'] if 'status' in ipython_message.content else None)

        # Add header message from ipython to message metadata
        if message.metadata == None:
            message.metadata = {}

        if client_message.metadata != None:
            message.metadata.update(client_message.metadata)
        message.metadata.update(dict((k, ipython_message.header[k])
                                     for k in ('msg_id', 'msg_type', 'session')))
        message.metadata.update({'stream_type': stream_type})

        if self._is_error_message(ipython_message.header):
            message = self._process_error_message(message, ipython_message)
        elif self._is_stream_result(ipython_message.header):
            message = self._process_stream_message(message, ipython_message)
        elif self._is_execute_result(ipython_message.header) or self._is_display_data_result(ipython_message.header):
            message = self._process_rich_ouput(message, ipython_message)
        else:
            message = self._process_other_message(message, ipython_message)

        return message

    def message_handler_callback(self, ipython_message, stream_type, client_message):
        try:
            # if self.request_metadata is not None:
            message = self._create_return_message(
                ipython_message=ipython_message, stream_type=stream_type, client_message=client_message)            
            # log.info('Reply message: %s' % message)
            if message != None:
                self._send_to_node(message)
        except:
            trace = traceback.format_exc()
            log.info("Exception %s" % (trace))
            error_message = BaseMessageHandler._create_error_message(
                client_message.webapp_endpoint, trace, client_message.command_name, {})
            self._send_to_node(error_message)

    def handle_message(self, message):
        try:
            self.user_space.execute(
                message.content, None, self.message_handler_callback, client_message=message)
            self._get_active_dfs_status()
            # self._get_active_model()
        except:
            trace = traceback.format_exc()
            log.info("Exception %s" % (trace))            
            error_message = BaseMessageHandler._create_error_message(message.webapp_endpoint, trace, message.command_name, {})
            self._send_to_node(error_message)

    def _get_active_dfs_status(self):
        active_df_status = self.user_space.get_active_dfs_status()
        active_df_status_message = Message(**{"webapp_endpoint": WebappEndpoint.DFManager, "command_name": DFManagerCommand.update_df_status,
                                              "seq_number": 1, "type": "dict", "content": active_df_status, "error": False})
        self._send_to_node(active_df_status_message)

    def _get_active_models_info(self):
        active_models = self.user_space.get_active_models_info()
        active_models_message = Message(**{"webapp_endpoint": WebappEndpoint.ModelManager, "command_name": ModelManagerCommand.get_active_models_info,
                                              "seq_number": 1, "type": "dict", "content": active_models, "error": False})
        self._send_to_node(active_models_message)
