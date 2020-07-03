from pages.base_browser_page import BaseBrowserPage
from pages.right_panel.right_panel_browser_page import RightPanelBrowserPage
from util.exception.MstrException import MstrException


class ImportDossierTableOfContentsBrowserPage(BaseBrowserPage):
    TABLE_OF_CONTENT_BUTTON = '.icon-toc'
    TABLE_OF_CONTENT_ITEMS = '.mstrd-ToCDropdownMenuContainer-menuText'

    def __init__(self):
        super().__init__()

        self.right_panel_browser_page = RightPanelBrowserPage()

    def select_table_of_content_option(self, option_number):
        self.focus_on_import_dossier_frame()

        self.get_element_by_css(ImportDossierTableOfContentsBrowserPage.TABLE_OF_CONTENT_BUTTON).click()

        menu_items = self.get_elements_by_css(ImportDossierTableOfContentsBrowserPage.TABLE_OF_CONTENT_ITEMS)

        option_index = int(option_number) - 1

        if option_index > len(menu_items):
            raise MstrException(
                ('Not possible to click menu option, given object index is too big', option_index, menu_items)
            )

        menu_items[option_index].click()
