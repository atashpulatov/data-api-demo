from selenium.common.exceptions import NoSuchElementException

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.mstr_exception import MstrException
from pages.import_dossier.import_dossier_main.import_dossier_main_windows_desktop_page import \
    ImportDossierMainWindowsDesktopPage


class ImportDossierContextMenuWindowsDesktopPage(BaseWindowsDesktopPage):
    TABLE_CELL = '//Table/DataItem/DataGrid/DataItem[@Name="%s"]'

    CONTEXT_MENU_ITEM_REPLACE_WITH = 'Replace With'
    CONTEXT_MENU_ITEM_SHOW_TOTALS = 'Show Totals'

    CONTEXT_MENU_ITEM_EXCLUDE = 'Exclude'
    CONTEXT_MENU_ITEM_OK = 'OK'
    CONTEXT_MENU_ITEM_DRILL = 'Drill'

    DRILL_SUB_MENU_ITEM = '//HyperLink[@Name = "%s"]'

    CONTEXT_SUB_MENU_ITEM = '//Group/Pane/Pane/Text[@Name="%s"]'

    ALLOWED_SORT_ORDER = ('Ascending', 'Descending')

    TABLE_CELL_FILE = 'Cell %s'

    SORTING_METRIC_ICONS = '//Group[starts-with(@Name, "%s")]/following-sibling::HyperLink[%s]'
    SORTING_ICON_PREFIX = 'sort_icon_'

    def __init__(self):
        super().__init__()

        self.import_dossier_main_windows_desktop_page = ImportDossierMainWindowsDesktopPage()

    def select_show_totals_for_attribute(self, totals_to_select, attribute_name, visualization_name):
        tile = self.import_dossier_main_windows_desktop_page.find_tile_by_name(visualization_name)

        tile.get_element_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % attribute_name
        ).right_click()

        self._click_context_menu_item(ImportDossierContextMenuWindowsDesktopPage.CONTEXT_MENU_ITEM_SHOW_TOTALS)

        self._click_context_sub_menu_item(totals_to_select)

        self._click_context_sub_menu_item(ImportDossierContextMenuWindowsDesktopPage.CONTEXT_MENU_ITEM_OK)

    def select_sort_order_for_metric(self, sort_order, metric_name, visualization_name):
        if sort_order not in ImportDossierContextMenuWindowsDesktopPage.ALLOWED_SORT_ORDER:
            raise MstrException(f'Wrong sort order specified: [{sort_order}].')

        self.get_element_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % metric_name,
            image_name=self.prepare_image_name(ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL_FILE % metric_name)
        ).right_click()

        icon_index = ImportDossierContextMenuWindowsDesktopPage.ALLOWED_SORT_ORDER.index(sort_order) + 1
        self.get_add_in_main_element().get_element_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.SORTING_METRIC_ICONS % (visualization_name, icon_index)
        ).click()

    def select_drill_by_for_attribute(self, drill_by, attribute_name, visualization_name):
        tile = self.import_dossier_main_windows_desktop_page.find_tile_by_name(visualization_name)

        tile.get_element_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % attribute_name
        ).right_click()

        self._click_context_menu_item(ImportDossierContextMenuWindowsDesktopPage.CONTEXT_MENU_ITEM_DRILL)

        try:
            self.get_add_in_main_element().get_element_by_xpath(
                ImportDossierContextMenuWindowsDesktopPage.DRILL_SUB_MENU_ITEM % drill_by
            ).click()

        except NoSuchElementException:
            raise MstrException(
                f'Item to drill by not present - attribute name: [{attribute_name}], drill by: [{drill_by}].'
            )

    def select_replace_with_for_attribute(self, replace_with, attribute_name, visualization_name):
        visualization = self.import_dossier_main_windows_desktop_page.find_tile_by_name(visualization_name)

        visualization.get_element_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % attribute_name
        ).right_click(5, 5)

        self._click_context_menu_item(ImportDossierContextMenuWindowsDesktopPage.CONTEXT_MENU_ITEM_REPLACE_WITH)

        self._click_context_sub_menu_item(replace_with)

    def select_exclude_for_attribute_element(self, exclude, attribute_name, visualization_name):
        tile = self.import_dossier_main_windows_desktop_page.find_tile_by_name(visualization_name)

        item = self._get_first_item_in_attribute_column(tile, attribute_name, exclude)
        item.right_click(10, 10)

        self._click_context_menu_item(ImportDossierContextMenuWindowsDesktopPage.CONTEXT_MENU_ITEM_EXCLUDE)

    def _get_first_item_in_attribute_column(self, tile, attribute_name, item_name):
        """
        Gets first item in a given attribute column for a given tile.

        Table data in an XML representation of a page is linear (not e.g. columns nested in rows). Items in one column
        can be distinguished by x coordinate, which is the same for all items in a given column.

        :param tile: visualization tile to search item in
        :param attribute_name: attribute name identifying a table column
        :param item_name: item name to search for
        :return: First item in a given attribute column for a given tile.
        """
        attribute_header = tile.get_element_by_name(attribute_name)
        #     .get_element_by_xpath(
        #     ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % attribute_name
        # )

        attribute_header_x = attribute_header.x

        data_items = tile.get_elements_by_name(item_name)
        #     .get_elements_by_xpath(
        #     ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % item_name
        # )

        for item in data_items:
            if attribute_header_x == item.x:
                return item

        raise MstrException(f'No item [{item_name}] found for attribute [{attribute_name}]')

    def _click_context_menu_item(self, menu_item_name):
        self.get_element_by_name(
            menu_item_name,
            image_name=self.prepare_image_name(menu_item_name)
        ).click()

    def _click_context_sub_menu_item(self, sub_menu_item_name):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_name(sub_menu_item_name).click()
