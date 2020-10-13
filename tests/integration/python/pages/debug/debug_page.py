from framework.pages_base.base_page import BasePage


class DebugPage(BasePage):
    def log_page_source(self):
        super().log_page_source()

    def execute_tmp_code(self):
        """
        Use this to execute code used for debugging, researching, etc.
        """
        pass
