from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


class ImportDossierTableOfContentsWindowsDesktopPage(BaseWindowsDesktopPage):
    TABLE_OF_CONTENT_BUTTON = 'Table of Contents'
    # TODO please add parent if possible
    TABLE_OF_CONTENT_ITEMS = '//Button[@Name="Table of Contents"]/following-sibling::List[1]//ListItem'

    def select_table_of_content_option(self, option_number):
        self.get_element_by_name(
            ImportDossierTableOfContentsWindowsDesktopPage.TABLE_OF_CONTENT_BUTTON,
            image_name=self.prepare_image_name(ImportDossierTableOfContentsWindowsDesktopPage.TABLE_OF_CONTENT_BUTTON)
        ).click()

        menu_items = self.get_elements_by_xpath(ImportDossierTableOfContentsWindowsDesktopPage.TABLE_OF_CONTENT_ITEMS)

        option_index = int(option_number) - 1

        if option_index > len(menu_items):
            raise MstrException(
                ('Not possible to click menu option, given object index is too big', option_index, menu_items)
            )

        menu_items[option_index].click()
