from driver.driver_factory import DriverFactory
from util.config_util import ConfigUtil


class TestUtil:
    @staticmethod
    def global_test_cleanup():
        driver_type = ConfigUtil.get_driver_type()
        driver = DriverFactory().get_driver(driver_type)
        driver_cleanup = DriverFactory().get_driver_cleanup(driver_type)

        driver_cleanup(driver)
