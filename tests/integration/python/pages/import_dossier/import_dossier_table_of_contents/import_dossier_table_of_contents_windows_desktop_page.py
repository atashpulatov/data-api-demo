from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ImportDossierTableOfContentsWindowsDesktopPage(BaseWindowsDesktopPage):
    TABLE_OF_CONTENT_BUTTON = 'Table of Contents'

    TABLE_OF_CONTENT_ITEMS = '//Button[@Name="Table of Contents"]/following-sibling::List[1]//ListItem[%s]'

    def select_table_of_content_option(self, option_number):
        self.get_element_by_name(
            ImportDossierTableOfContentsWindowsDesktopPage.TABLE_OF_CONTENT_BUTTON,
            image_name=self.prepare_image_name(ImportDossierTableOfContentsWindowsDesktopPage.TABLE_OF_CONTENT_BUTTON)
        ).click()

        add_in_main_element = self.get_add_in_main_element()

        add_in_main_element.get_element_by_xpath(
            ImportDossierTableOfContentsWindowsDesktopPage.TABLE_OF_CONTENT_ITEMS % option_number
        ).click()
