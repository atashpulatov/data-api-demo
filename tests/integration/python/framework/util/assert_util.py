from framework.util.util import Util
import string


class AssertUtil:
    @staticmethod
    def assert_simple(value1, value2):
        """
        Wraps assertion of value1 equals value2, with logging values on ERROR level.

        Used instead of fail() not to stop test execution.
        """
        if value1 != value2:
            Util.log_error("Assertion error, values: [%s], [%s]" % (value1, value2))
            # Util.pause(120)  # wait for debug purposes

        assert value1 == value2

    @staticmethod
    def assert_strings_only_printable_characters(value1, value2):
        """
        Asserts equality of strings while removing any non-printable characters
        Also logging values on ERROR level.

        Used instead of fail() not to stop test execution.
        """
        printable = set(string.printable)

        value1_only_printable_characters = ''.join(filter(lambda x: x in printable, value1))
        value2_only_printable_characters = ''.join(filter(lambda x: x in printable, value2))

        if value1_only_printable_characters != value2_only_printable_characters:
            Util.log_error("Assertion error, values: [%s], [%s]" % (value1, value2))
            # Util.pause(120)  # wait for debug purposes

        assert value1_only_printable_characters == value2_only_printable_characters
