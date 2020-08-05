import re


class ExcelUtil:
    NUMBER_WITH_COMMA_RE = re.compile('^\d*,*\d*$')
    NUMBER_DELIMITER_COMMA = ','
    NUMBER_DELIMITER_DOT = '.'

    @staticmethod
    def format_cell_value(value):
        """
        Formats value.

        For number with comma as decimal delimiter replaces comma with dot: 42,42 -> 42.42.

        For other values no changes.

        :param value: value to format
        :return: formatted value.
        """

        if value and ExcelUtil.NUMBER_WITH_COMMA_RE.search(value):
            return value.replace(ExcelUtil.NUMBER_DELIMITER_COMMA, ExcelUtil.NUMBER_DELIMITER_DOT)

        return value
