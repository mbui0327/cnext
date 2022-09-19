
import traceback
import os
from project_manager.interfaces import WorkspaceMetadata
from libs.message_handler import BaseMessageHandler
from libs.message import ContentType
import git
from libs import logs
from libs.config import read_config
from libs.message import GitCommand, Message, WebappEndpoint

log = logs.get_logger(__name__)


class MessageHandler(BaseMessageHandler):
    def __init__(self, p2n_queue, user_space):
        super(MessageHandler, self).__init__(p2n_queue)
        self.repo = git.repo.Repo('D:\CNext\cnext_sample_projects')

    def handle_message(self, message):
        try:
            output = None
            type = None
            if message.command_name == GitCommand.connect_repo:
                o = self.repo.remotes.origin
                changedFiles = [
                    os.path.normpath(item.a_path) for item in self.repo.index.diff(None)]
                output = changedFiles

            # create reply message
            if message.command_name == GitCommand.check_diff:
                # print(self.repo.index.diff(
                #     "HEAD", create_patch=True))
                diff = self.repo.git.diff([message.content], R=True)
             # print(self.repo.git.apply(['-3', 'Skywalker/model_training/pytorch.py']))
                output = diff

            message.content = output
            # message.abc = [
            #         item for item in self.repo.index.diff("Skywalker/model_training/pytorch.py")]
            message.error = False
            self._send_to_node(message)
        except:
            trace = traceback.format_exc()
            log.info("Exceptiono=> %s" % (trace))
