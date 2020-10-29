from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException
from pages.import_dossier.import_dossier_main.import_dossier_main_windows_desktop_page import \
    ImportDossierMainWindowsDesktopPage


class ImportDossierContextMenuWindowsDesktopPage(BaseWindowsDesktopPage):
    TABLE_CELL = '//Table/DataItem/DataGrid/DataItem[@Name="%s"]'

    CONTEXT_MENU_ITEM_REPLACE_WITH = 'Replace With'
    CONTEXT_MENU_ITEM_SHOW_TOTALS = 'Show Totals'

    CONTEXT_MENU_ITEM_EXCLUDE = 'Exclude'
    CONTEXT_MENU_ITEM_OK = 'OK'

    CONTEXT_SUB_MENU_ITEM = '//Group/Pane/Pane/Text[@Name="%s"]'

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

    def select_replace_with_for_attribute(self, replace_with, attribute_name, visualization_name):
        visualization = self.import_dossier_main_windows_desktop_page.find_tile_by_name(visualization_name)

        visualization.get_element_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % attribute_name
        ).right_click()

        self._click_context_menu_item(ImportDossierContextMenuWindowsDesktopPage.CONTEXT_MENU_ITEM_REPLACE_WITH)

        self._click_context_sub_menu_item(replace_with)

    def select_exclude_for_attribute_element(self, exclude, attribute_name, visualization_name):
        tile = self.import_dossier_main_windows_desktop_page.find_tile_by_name(visualization_name)

        item = self._get_first_item_in_attribute_column(tile, attribute_name, exclude)
        item.right_click()

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
        attribute_header = tile.get_element_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % attribute_name
        )

        attribute_header_x = attribute_header.x

        data_items = tile.get_elements_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.TABLE_CELL % item_name
        )

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

        popup_main_element.get_element_by_xpath(
            ImportDossierContextMenuWindowsDesktopPage.CONTEXT_SUB_MENU_ITEM % sub_menu_item_name,
        ).click()