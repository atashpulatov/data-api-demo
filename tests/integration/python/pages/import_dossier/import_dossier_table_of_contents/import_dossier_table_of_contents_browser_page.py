import time

from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.exception.mstr_exception import MstrException
from framework.util.const import Const


class ImportDossierTableOfContentsBrowserPage(BaseBrowserPage):
    TABLE_OF_CONTENT_BUTTON = '.icon-tb_toc_n'
    TABLE_OF_CONTENT_ITEMS = '.mstrd-ToCDropdownMenuContainer-menuText'
    TABLE_OF_CONTENT_CONTAINER_CSS = '.mstrd-ToCDropdownMenuContainer'

    def select_table_of_content_option(self, option_number):
        self.focus_on_dossier_frame()

        table_of_content_button = self.get_element_by_css(
            ImportDossierTableOfContentsBrowserPage.TABLE_OF_CONTENT_BUTTON
        )

        end_time = time.time() + Const.DEFAULT_TIMEOUT
        while end_time > time.time():
            table_of_content_button.click()
            if self.check_if_element_exists_by_css(
                    ImportDossierTableOfContentsBrowserPage.TABLE_OF_CONTENT_CONTAINER_CSS,
                    timeout=Const.SHORT_TIMEOUT
            ):
                menu_items = self.get_elements_by_css(ImportDossierTableOfContentsBrowserPage.TABLE_OF_CONTENT_ITEMS)

                option_index = int(option_number) - 1

                if option_index > len(menu_items):
                    raise MstrException(
                        ('Not possible to click menu option, given object index is too big', option_index, menu_items)
                    )

                menu_items[option_index].click()
                return

        raise MstrException('Could not open the Table of Content')
