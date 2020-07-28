from pages_base.base_browser_page import BaseBrowserPage
from util.exception.MstrException import MstrException


class ImportDossierContextMenuBrowserPage(BaseBrowserPage):
    VISUALIZATION_TABLE_HEADER_ITEMS = '.mstrmojo-XtabZone > table > tbody > tr:nth-child(1) > td'
    VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS = '.mstrmojo-ui-Menu-item'

    CONTEXT_MENU_SHOW_TOTALS = 'Show Totals'
    CONTEXT_MENU_DRILL = 'Drill'
    CONTEXT_MENU_SORT_ASCENDING = 'Sort Ascending'
    CONTEXT_MENU_SORT_DESCENDING = 'Sort Descending'
    CONTEXT_MENU_TOTAL_ITEMS = '.mstrmojo-vi-subtotals > div > div > div > span'
    CONTEXT_MENU_BOX = '.mstrmojo-ui-Menu'
    CONTEXT_MENU_BUTTONS = '.mstrmojo-Button-text'
    CONTEXT_MENU_BUTTON_OK = 'OK'
    CONTEXT_MENU_TEXT_ELEMENTS = '.mtxt'

    SORT_ORDER_MAPPING = {
        'Ascending': CONTEXT_MENU_SORT_ASCENDING,
        'Descending': CONTEXT_MENU_SORT_DESCENDING
    }

    def select_show_totals_for_attribute(self, totals_to_select, attribute_name):
        self.focus_on_import_dossier_frame()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_HEADER_ITEMS,
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
        if sort_order not in ImportDossierContextMenuBrowserPage.SORT_ORDER_MAPPING.keys():
            raise MstrException('Wrong sort order specified: %s.' % sort_order)

        self.focus_on_import_dossier_frame()

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_HEADER_ITEMS,
            metric_name
        ).right_click()

        context_menu_option = ImportDossierContextMenuBrowserPage.SORT_ORDER_MAPPING[sort_order]

        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_CONTEXT_MENU_ITEMS,
            context_menu_option
        ).click()

    def select_drill_by_for_attribute(self, drill_by, attribute_name):
        self.find_element_in_list_by_text(
            ImportDossierContextMenuBrowserPage.VISUALIZATION_TABLE_HEADER_ITEMS,
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
