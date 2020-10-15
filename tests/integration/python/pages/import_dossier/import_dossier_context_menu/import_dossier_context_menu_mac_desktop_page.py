from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.exception.MstrException import MstrException
from framework.util.message_const import MessageConst


class ImportDossierContextMenuMacDesktopPage(BaseMacDesktopPage):
    MENU_ITEM = "/AXGroup[%%s]/AXStaticText[@AXValue='%s']"

    TOTALS_BUTTON = "/AXGroup[%%s]/AXGroup[0]/AXStaticText[@AXValue='%s']"
    TOTALS_BUTTON_OK = TOTALS_BUTTON % 'OK'
    TOTALS_BUTTON_CANCEL = TOTALS_BUTTON % 'Cancel'

    ALL_GROUPS = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[%s]"

    ALL_TABLES_GROUP = ALL_GROUPS + "/AXGroup[1]/AXGroup[0]/AXGroup[0]/AXTable[0]"
    ALL_TABLES_GROUP_MAX_GROUPS_TO_CHECK = 50

    TABLE_GROUP = ALL_GROUPS + "/AXGroup[1]/AXGroup[0]/AXGroup[%%s]/AXTable[@AXDescription='%s']"
    TABLE_GROUP_MAX_GROUPS_TO_CHECK = 100

    HEADER_ROW_NO = 0

    TABLE_CELL = "/AXRow[%s]/AXCell[0]/AXStaticText[@AXValue='%s']"

    ATTRIBUTE_HEADER_CELL = "/AXRow[0]/AXCell[%%s]/AXStaticText[@AXValue='%s']"
    ATTRIBUTE_ROWS = "/AXRow[%%s]/AXCell[%s]/AXStaticText[@AXValue='%s']"

    ATTRIBUTE_VALUE_CELLS_EXPECTED_LIST_LEN = 2
    ATTRIBUTE_VALUE_CELLS_MAX_SOURCE_LIST_NO = 50

    def select_show_totals_for_attribute(self, totals_to_select, attribute_name, visualization_name):
        self._right_click_attribute_column_header(visualization_name, attribute_name)
        self._click_menu_item(MessageConst.CONTEXT_MENU_SHOW_TOTALS)

        submenu_group_selector = self._get_last_group_selector()

        self._select_totals_item(totals_to_select, submenu_group_selector)
        self._press_ok_in_totals_submenu(submenu_group_selector)

    def _select_totals_item(self, totals_to_select, submenu_group_selector):
        totals_selector_suffix = ImportDossierContextMenuMacDesktopPage.MENU_ITEM % totals_to_select
        totals_selector = submenu_group_selector + totals_selector_suffix

        self.get_element_by_xpath_workaround(totals_selector).click()

    def _press_ok_in_totals_submenu(self, submenu_group_selector):
        ok_selector = submenu_group_selector + ImportDossierContextMenuMacDesktopPage.TOTALS_BUTTON_OK

        self.get_element_by_xpath_workaround(ok_selector).click()

    def select_replace_with_for_attribute(self, replace_with, attribute_name, visualization_name):
        self._right_click_attribute_column_header(visualization_name, attribute_name)

        self._click_menu_item(MessageConst.CONTEXT_MENU_REPLACE_WITH)

        self._click_menu_item(replace_with)

    def _click_menu_item(self, menu_item_name):
        menu_group = self._get_last_group_selector()

        item_group = menu_group + (ImportDossierContextMenuMacDesktopPage.MENU_ITEM % menu_item_name)

        self.get_element_by_xpath_workaround(item_group).click()

    def _right_click_attribute_column_header(self, visualization_name, attribute_name):
        table_selector = self._get_table_selector(visualization_name)

        self._get_first_cell_from_row_no_by_cell_value(
            table_selector,
            ImportDossierContextMenuMacDesktopPage.HEADER_ROW_NO,
            attribute_name
        ).right_click()

    def _get_first_cell_from_row_no_by_cell_value(self, table_selector, row_no, cell_value):
        cell_selector_suffix = ImportDossierContextMenuMacDesktopPage.TABLE_CELL % (row_no, cell_value)

        cell_selector = table_selector + cell_selector_suffix

        return self.get_element_by_xpath(cell_selector)

    def select_exclude_for_attribute_element(self, attribute_value_to_exclude, attribute_name, visualization_name):
        attribute_cell = self._get_attribute_value_cell(visualization_name, attribute_name, attribute_value_to_exclude)
        attribute_cell.right_click()

        self._click_menu_item(MessageConst.CONTEXT_MENU_EXCLUDE)

    def _get_attribute_value_cell(self, visualization_name, attribute_name, attribute_value):
        """
        Gets a cell in an Attribute column in a given Visualization.

        1. Finds Attribute column header cell by attribute_name.
        2. From all possible cells containing attribute_value in a table, selects first element that has
        the same x coordinate as Attribute header cell.

        Search is limited by expected_list_len and max_source_list_no param values.

        :param visualization_name: Visualization name to select Attribute from.
        :param attribute_name: Attribute name specifying column to select cell from.
        :param attribute_value: Attribute value to be selected from Attribute column.
        :return: Cell containing given value.
        """

        table_selector = self._get_table_selector(visualization_name)

        attribute_header_cell_selector = (
                table_selector +
                ImportDossierContextMenuMacDesktopPage.ATTRIBUTE_HEADER_CELL % attribute_name
        )
        attribute_header_cell = self.get_element_by_xpath_workaround_with_index(attribute_header_cell_selector)
        attribute_header_cell_x = attribute_header_cell.element.x

        attribute_value_cells_selector = (
                table_selector +
                ImportDossierContextMenuMacDesktopPage.ATTRIBUTE_ROWS % (attribute_header_cell.index, attribute_value)
        )

        attribute_value_cells = self.get_elements_by_xpath(
            attribute_value_cells_selector,
            expected_list_len=ImportDossierContextMenuMacDesktopPage.ATTRIBUTE_VALUE_CELLS_EXPECTED_LIST_LEN,
            max_source_list_no=ImportDossierContextMenuMacDesktopPage.ATTRIBUTE_VALUE_CELLS_MAX_SOURCE_LIST_NO
        )

        for attribute_value_cell in attribute_value_cells:
            if attribute_header_cell_x == attribute_value_cell.x:
                return attribute_value_cell

        raise MstrException(f'Attribute cell with a given value not found, visualization_name: [{visualization_name}], '
                            f'attribute_name: [{attribute_name}], attribute_value: [{attribute_value_cell}].')

    def _get_table_selector(self, visualization_name):
        tables_group_index = self.get_element_by_xpath_workaround_with_index(
            ImportDossierContextMenuMacDesktopPage.ALL_TABLES_GROUP,
            max_source_list_no=ImportDossierContextMenuMacDesktopPage.ALL_TABLES_GROUP_MAX_GROUPS_TO_CHECK
        ).index

        table_group_selector = ImportDossierContextMenuMacDesktopPage.TABLE_GROUP % (
            tables_group_index,
            visualization_name
        )

        table_group_index = self.get_element_by_xpath_workaround_with_index(
            table_group_selector,
            max_source_list_no=ImportDossierContextMenuMacDesktopPage.TABLE_GROUP_MAX_GROUPS_TO_CHECK
        ).index

        table_selector = table_group_selector % table_group_index

        return table_selector

    def _get_last_group_selector(self):
        all_groups_elements = self.get_elements_by_xpath(ImportDossierContextMenuMacDesktopPage.ALL_GROUPS)

        index = len(all_groups_elements) - 1

        return str(ImportDossierContextMenuMacDesktopPage.ALL_GROUPS % index)
