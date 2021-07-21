from abc import ABC


class AbstractDriver(ABC):
    def get_driver(self, driver_restarted_during_run):
        pass

    @staticmethod
    def driver_cleanup(driver):
        pass
