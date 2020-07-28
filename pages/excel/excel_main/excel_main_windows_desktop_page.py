from pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ExcelMainWindowsDesktopPage(BaseWindowsDesktopPage):
    EXCEL_START_ELEM = 'Excel'

    NEW_BLANK_WORKBOOK_ELEM = '//ListItem[@Name="Blank workbook"]'

    ADD_IN_IN_HOME_TAB_TEXT_ELEM = '//Button[@Name="Import Data"]'

    def click_excel_start_elem(self):
        self.get_element_by_name(
            ExcelMainWindowsDesktopPage.EXCEL_START_ELEM,
            image_name=self.prepare_image_name('excel_start_element')
        ).click()

    def click_new_blank_workbook_elem(self):
        self.get_element_by_xpath(
            ExcelMainWindowsDesktopPage.NEW_BLANK_WORKBOOK_ELEM,
            image_name=self.prepare_image_name('blank_workbook')
        ).click()

        self.pause(3)

    def click_add_in_in_home_tab_elem(self):
        self.get_element_by_xpath(
            ExcelMainWindowsDesktopPage.ADD_IN_IN_HOME_TAB_TEXT_ELEM,
            image_name=self.prepare_image_name('import_data')
        ).click()
