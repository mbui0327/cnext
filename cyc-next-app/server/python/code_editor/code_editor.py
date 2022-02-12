import io
import base64
import traceback
from xmlrpc.client import boolean

import pandas
import plotly
import matplotlib.pyplot as plt
from libs.message_handler import BaseMessageHandler
from libs.message import ContentType, Message

from libs import logs
from user_space.user_space import ExecutionMode
from user_space.user_space import BaseKernel, UserSpace
log = logs.get_logger(__name__)


class MessageHandler(BaseMessageHandler):
    def __init__(self, p2n_queue, user_space=None):
        super(MessageHandler, self).__init__(p2n_queue, user_space)

    @staticmethod
    def _create_plot_data(result):
        return {'plot': result.to_json()}

    @staticmethod
    def _create_matplotlib_data(result):
        figfile = io.BytesIO()
        plt.savefig(figfile, format='svg')
        figfile.seek(0)  # rewind to beginning of file
        return base64.b64encode(figfile.getvalue())

    @staticmethod
    def _result_is_dataframe(result) -> bool:
        return type(result) == pandas.core.frame.DataFrame

    @staticmethod
    def _result_is_plotly_fig(result) -> bool:
        return hasattr(plotly.graph_objs, '_figure') and (type(result) == plotly.graph_objs._figure.Figure)

    @staticmethod
    def _assign_exec_mode(message: Message):
        message.execution_mode = 'eval'
        if message.metadata and ('line_range' in message.metadata):
            line_range = message.metadata['line_range']
            # always 'exec' if there are more than 1 line in the code
            if line_range['fromLine'] < line_range['toLine']-1:
                message.execution_mode = 'exec'

        try:
            compile(message.content, '<stdin>', 'eval')
        except SyntaxError as error:
            log.error(error)
            message.execution_mode = 'exec'

        log.info("assigned command type: %s" % message.execution_mode)

    @staticmethod
    def _result_is_matplotlib_fig(result) -> bool:
        # because matplotlib return array of objects
        if isinstance(result, list) and len(result) > 0:
            matplotlib_object = result[0]
            result_str_type = str(type(matplotlib_object))
            if 'matplotlib' in result_str_type and hasattr(matplotlib_object, 'figure') and matplotlib_object.figure.number > 0:
                return True
        return False

    # @staticmethod
    # def _create_matplotlib_data(result):
    def handle_message(self, message, client_globals):
        # message execution_mode will always be `eval` for this sender
        log.info('eval... %s' % message)
        # log.info('Globals: %s' % client_globals)
        try:
            self._assign_exec_mode(message)
            type = ContentType.NONE
            output = ''
            if message.execution_mode == 'exec':
                log.info('exec mode...')
                # exec(message.content, client_globals)
                self.user_space.execute(message.content, ExecutionMode.EXEC)
                type = ContentType.STRING
                # output = sys.stdout.getvalue()
            elif message.execution_mode == 'eval':
                log.info('eval mode...')
                # result = eval(message.content, client_globals)
                result = self.user_space.execute(
                    message.content, ExecutionMode.EVAL)
                if result is not None:
                    # log.info("eval result: \n%s" % (result))
                    log.info("got eval results")
                    if self._result_is_dataframe(result):
                        df_id = self._get_dataframe_id(message.content)
                        output = self._create_table_data(df_id, result)
                        type = ContentType.PANDAS_DATAFRAME
                    elif self._result_is_plotly_fig(result):
                        output = self._create_plot_data(result)
                        type = ContentType.PLOTLY_FIG
                    elif self._result_is_matplotlib_fig(result):
                        output = self._create_matplotlib_data(result)
                        type = ContentType.MATPLOTLIB_FIG
                    else:
                        type = ContentType.STRING
                        output = str(result)
            # log.info('Globals: %s' % globals())

            message.type = type
            message.content = output
            message.error = False
            self._send_to_node(message)

        except:
            trace = traceback.format_exc()
            log.error("Exception %s" % (trace))
            error_message = self._create_error_message(
                message.webapp_endpoint, trace, message.metadata)
            self._send_to_node(error_message)
