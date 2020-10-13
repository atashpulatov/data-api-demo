from abc import ABC


class AbstractDriver(ABC):
    def get_driver(self):
        pass

    @staticmethod
    def driver_cleanup(driver):
        pass
