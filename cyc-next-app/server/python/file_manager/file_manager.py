import traceback

from libs.message_handler import BaseMessageHandler
from libs.message import ContentType

from libs import logs
from libs.config import read_config
from libs.message import ProjectCommand
from project_manager import files, projects

log = logs.get_logger(__name__)

class MessageHandler(BaseMessageHandler):
    def __init__(self, p2n_queue, user_space, config):
        super(MessageHandler, self).__init__(p2n_queue, user_space)
        open_projects = []
        active_project: projects.ProjectMetadata = None
        if hasattr(config, 'projects'):
            if 'open_projects' in config.projects:
                if isinstance(config.projects['open_projects'], list):
                    open_projects = config.projects['open_projects']
            if 'active_project' in config.projects:
                for project_config in open_projects:
                    if config.projects['active_project'] == project_config['id']:
                        active_project = projects.ProjectMetadata(**project_config)
        if active_project:
            projects.set_active_project(active_project)

    def handle_message(self, message):
        log.info('FileManager handle message: %s %s %s' %
                 (message.command_name, message.type, message.sub_type))
        try:
            metadata = message.metadata
            result = None
            if message.command_name == ProjectCommand.list_dir:
                result = []
                if 'path' in metadata.keys():
                    result = files.list_dir(metadata['path'])
                    type = ContentType.DIR_LIST
            elif message.command_name == ProjectCommand.get_open_files:
                result = projects.get_open_files()
                type = ContentType.FILE_METADATA
            elif message.command_name == ProjectCommand.set_working_dir:
                if 'path' in metadata.keys():
                    result = projects.set_working_dir(metadata['path'])
                type = ContentType.NONE
            elif message.command_name == ProjectCommand.set_project_dir:
                if 'path' in metadata.keys():
                    result = projects.set_project_dir(metadata['path'])
                type = ContentType.NONE
            elif message.command_name == ProjectCommand.read_file:
                if 'path' in metadata.keys():
                    timestamp = metadata['timestamp'] if 'timestamp' in metadata else None
                    result = files.read_file(metadata['path'], timestamp)
                    if result == None:
                        type = ContentType.NONE
                    else:
                        type = ContentType.FILE_CONTENT
            elif message.command_name == ProjectCommand.save_file:
                if 'path' in metadata.keys():
                    result = files.save_file(metadata['path'], message.content)
                type = ContentType.FILE_METADATA
            elif message.command_name == ProjectCommand.save_state:
                if 'path' in metadata.keys():
                    result = files.save_state(
                        metadata['path'], message.content)
                type = ContentType.FILE_METADATA
            elif message.command_name == ProjectCommand.close_file:
                result = projects.close_file(metadata['path'])
                type = ContentType.FILE_METADATA
            elif message.command_name == ProjectCommand.open_file:
                result = projects.open_file(metadata['path'])
                type = ContentType.FILE_METADATA
            elif message.command_name == ProjectCommand.get_active_project:
                result = projects.get_active_project()
                type = ContentType.PROJECT_METADATA

            # create reply message
            message.type = type
            message.content = result
            message.error = False
            self._send_to_node(message)

        except:
            trace = traceback.format_exc()
            log.error("%s" % (trace))
            error_message = MessageHandler._create_error_message(message.webapp_endpoint, trace)
            self._send_to_node(error_message)
