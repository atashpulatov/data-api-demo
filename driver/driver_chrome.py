from abc import ABC

from selenium import webdriver
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.remote.webdriver import WebDriver

from util.config_util import ConfigUtil
from util.util import Util


class DriverChrome(ABC):
    def get_driver(self):
        if ConfigUtil.is_attaching_to_existing_session_enabled():
            return self._prepare_driver_existing_session()
        else:
            return self._prepare_driver_new_session()

    def _prepare_driver_existing_session(self):
        session_id = ConfigUtil.get_browser_existing_session_id()
        executor_url = ConfigUtil.get_browser_existing_session_executor_url()

        webdriver_original_execute = WebDriver.execute

        def webdriver_execute_avoiding_opening_empty_browser(self, command, params=None):
            if command == 'newSession':
                return {'success': 0, 'value': None, 'sessionId': session_id}
            else:
                return webdriver_original_execute(self, command, params)

        WebDriver.execute = webdriver_execute_avoiding_opening_empty_browser

        driver = webdriver.Remote(command_executor=executor_url, desired_capabilities={})
        driver.session_id = session_id

        WebDriver.execute = webdriver_original_execute

        return driver

    def _prepare_driver_new_session(self):
        options = Options().add_argument('lang=en-US')

        capabilities = DesiredCapabilities().CHROME.copy()
        capabilities['pageLoadStrategy'] = 'none'

        driver = webdriver.Chrome(
            executable_path=ConfigUtil.get_driver_executable_path(),
            chrome_options=options,
            desired_capabilities=capabilities
        )

        Util.log_warning('Starting WebDriver, execution_url: [%s], session_id: [%s]' % (driver.command_executor._url,
                                                                                        driver.session_id))

        return driver

    @staticmethod
    def driver_cleanup(driver):
        try:
            driver.quit()
        except:
            pass
