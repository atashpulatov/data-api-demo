from pages.base_windows_desktop_page import BaseWindowsDesktopPage
from pages.excel.excel_main.excel_main_windows_desktop_page import ExcelMainWindowsDesktopPage
from pages.page_util.image_element import ImageElement


class StartExcelWindowsDesktopPage(BaseWindowsDesktopPage):
    NEW_ELEM = 'New'
    FILE_TAB_ELEM = 'File Tab'
    EXCEL_MAXIMIZE_CONTROL = 'Maximize'
    EXCEL_RESTORE_DOWN_CONTROL = 'Restore Down'

    def __init__(self):
        super().__init__()

        self.excel_main_windows_desktop_page = ExcelMainWindowsDesktopPage()

    def go_to_excel(self):
        ImageElement.reset_excel_root_element(self.driver)

        self.get_element_by_name(
            StartExcelWindowsDesktopPage.FILE_TAB_ELEM,
            image_name=self.prepare_image_name(StartExcelWindowsDesktopPage.FILE_TAB_ELEM)
        ).click()

        self.get_element_by_name(
            StartExcelWindowsDesktopPage.NEW_ELEM,
            image_name=self.prepare_image_name(StartExcelWindowsDesktopPage.NEW_ELEM)
        ).click()

        self.excel_main_windows_desktop_page.click_new_blank_workbook_elem()
