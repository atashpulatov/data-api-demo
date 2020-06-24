from pages.base_windows_desktop_page import BaseWindowsDesktopPage


class ExcelMenuWindowsDesktopPage(BaseWindowsDesktopPage):
    ADDIN_IN_HOME_TAB_TEXT_ELEM = 'Import Data'

    def click_add_in_elem(self):
        self.get_element_by_name(
            ExcelMenuWindowsDesktopPage.ADDIN_IN_HOME_TAB_TEXT_ELEM,
            image_name=self.prepare_image_name(ExcelMenuWindowsDesktopPage.ADDIN_IN_HOME_TAB_TEXT_ELEM)
        ).click()
