from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.test_util import TestUtil
from pages.right_panel.right_panel_main.right_panel_main_browser_page import RightPanelMainBrowserPage


class CleanupBrowserPage(BaseBrowserPage):
    def __init__(self):
        super().__init__()

        self.right_panel_browser_page = RightPanelMainBrowserPage()

    def clean_up_after_each_test(self):
        TestUtil.global_test_cleanup()
