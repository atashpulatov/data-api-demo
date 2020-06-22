from selenium.webdriver.common.keys import Keys

from pages.base_browser_page import BaseBrowserPage


class DevelopmentPage(BaseBrowserPage):
    def log_page_source(self):
        self.log_error(self.driver.page_source)

    def execute_tmp_code(self):
        (
            self.get_actions()
                .send_keys(Keys.CONTROL)
                .send_keys(Keys.CONTROL)
        )
