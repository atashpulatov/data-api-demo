from util.util import Util


class AssertUtil:
    @staticmethod
    def assert_simple(value1, value2):
        """
        Wraps assertion of value1 equals value2, with logging values on ERROR level.

        Used instead of fail() not to stop test execution.
        """
        if value1 != value2:
            Util.log_error("Assertion error, values: [%s], [%s]" % (value1, value2))
            Util.pause(120)  # wait for debug purposes

        assert value1 == value2
