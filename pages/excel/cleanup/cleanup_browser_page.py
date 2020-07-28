from pages.right_panel.right_panel.right_panel_browser_page import RightPanelBrowserPage
from pages_base.base_browser_page import BaseBrowserPage


class CleanupBrowserPage(BaseBrowserPage):
    def __init__(self):
        super().__init__()

        self.right_panel_browser_page = RightPanelBrowserPage()

    def clean_up_after_each_test(self):
        self.right_panel_browser_page.logout()

        self.switch_to_excel_workbook_window()
        self.driver.close()
        self.switch_to_excel_initial_window()
