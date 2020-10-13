from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.exception.MstrException import MstrException


class ImportDossierContextMenuBrowserPage(BaseBrowserPage):
    VISUALIZATION_TABLE = '.mstrmojo-XtabZone > table > tbody'
    VISUALIZATION_TABLE_ROW_X_ITEMS = VISUALIZATION_TABLE + ' > tr:nth-child(%s) > td'
    VISUALIZATION_TABLE_COLUMN_X_ITEMS = VISUALIZATION_TABLE + ' > tr > td:nth-child(%s)'
    VISUALIZATION_TABLE_HEADER_ROW_ITEMS = VISUALIZATION_TABLE_ROW_X_ITEMS % '1'

    VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS = '.mstrmojo-ui-Menu-item'
    VISUALIZATION_TABLE_CONTEXT_MENU_LIST_ITEMS = '.mstrmojo-ListBase > div > div > span'

    CONTEXT_MENU_SHOW_TOTALS = 'Show Totals'
    CONTEXT_MENU_DRILL = 'Drill'
    CONTEXT_MENU_ABSOLUTE_SORT = 'Absolute Sort'
    CONTEXT_MENU_TOTAL_ITEMS = '.mstrmojo-vi-subtotals > div > div > div > span'
    CONTEXT_MENU_BOX = '.mstrmojo-ui-Menu'
    CONTEXT_MENU_BUTTONS = '.mstrmojo-Button-text'
    CONTEXT_MENU_BUTTON_OK = 'OK'
    CONTEXT_MENU_TEXT_ELEMENTS = '.mtxt'
    CONTEXT_MENU_REPLACE_WITH = 'Replace With'
    CONTEXT_MENU_EXCLUDE = 'Exclude'

    ALLOWED_SORT_ORDER = ('Ascending', 'Descending')

    def select_show_totals_for_attribute(self, totals_to_select, attribute_name, visualization_name):
        self.focus_on_dossier_frame()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_HEADER_ROW_ITEMS,
            attribute_name
        ).right_click()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS,
            ImportDossierContextMenuBrowserPage.CONTEXT_MENU_SHOW_TOTALS
        ).click()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.CONTEXT_MENU_TOTAL_ITEMS,
            totals_to_select
        ).click()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.CONTEXT_MENU_BUTTONS,
            ImportDossierContextMenuBrowserPage.CONTEXT_MENU_BUTTON_OK
        ).click()

    def select_sort_order_for_metric(self, sort_order, metric_name):
        if sort_order not in ImportDossierContextMenuBrowserPage.ALLOWED_SORT_ORDER:
            raise MstrException('Wrong sort order specified: %s.' % sort_order)

        self.focus_on_dossier_frame()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_HEADER_ROW_ITEMS,
            metric_name
        ).right_click()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS,
            ImportDossierContextMenuBrowserPage.CONTEXT_MENU_ABSOLUTE_SORT
        ).click()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS,
            sort_order
        ).click()

    def select_drill_by_for_attribute(self, drill_by, attribute_name):
        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_HEADER_ROW_ITEMS,
            attribute_name
        ).right_click()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS,
            ImportDossierContextMenuBrowserPage.CONTEXT_MENU_DRILL
        ).click()

        menu_boxes = self.get_elements_by_css(ImportDossierContextMenuBrowserPage.CONTEXT_MENU_BOX)
        menu_items = menu_boxes[1].get_elements_by_css(ImportDossierContextMenuBrowserPage.CONTEXT_MENU_TEXT_ELEMENTS)

        for item in menu_items:
            if item.text == drill_by:
                item.click()
                return

        raise MstrException(
            'Item to drill by not present - attribute name: [%s], drill by: [%s].' % (attribute_name, drill_by))

    def select_replace_with_for_attribute(self, replace_with, attribute_name, visualization_name):
        """
        Replaces one attribute with new attribute from visualization context menu.

        :param replace_with(str): name of new attribute
        :param attribute_name(str): name of attribute which is going to be replaced
        :param visualization_name(str): visualization name, currently used only by Windows Desktop
        """
        self.focus_on_dossier_frame()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_HEADER_ROW_ITEMS,
            attribute_name
        ).right_click()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS,
            ImportDossierContextMenuBrowserPage.CONTEXT_MENU_REPLACE_WITH
        ).click()

        menu_items = self.get_elements_by_css(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_CONTEXT_MENU_LIST_ITEMS
        )

        for item in menu_items:
            if item.text == replace_with:
                item.click()
                return

        raise MstrException(
            'Item to replace_with not present - attribute name: [%s], replace with: [%s].' % (
                attribute_name, replace_with)
        )

    def select_exclude_for_attribute_element(self, exclude, attribute_name, visualization_name):
        """
        Excludes given attribute element from visualization context menu.

        :param exclude(str): name of element to exlude
        :param attribute_name(str): name of attribute which contains element to exclude
        :param visualization_name(str): visualization name, currently used only by Windows Desktop
        """
        self.focus_on_dossier_frame()

        index_of_column = self.find_index_of_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_HEADER_ROW_ITEMS,
            attribute_name
        )

        # index_of_column + 1 because indices of elements starts from 0 but css selector nth-child starts from 1
        column_selector = ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_COLUMN_X_ITEMS % (index_of_column + 1)

        self.find_element_in_list_by_text(
            column_selector,
            exclude
        ).right_click()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS,
            ImportDossierContextMenuBrowserPage.CONTEXT_MENU_EXCLUDE
        ).click()
