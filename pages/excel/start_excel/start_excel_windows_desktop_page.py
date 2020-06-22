from pages.base_page import BasePage
from pages.excel.excel_main.excel_main_windows_desktop_page import ExcelMainWindowsDesktopPage
from pages.page_util.element_operation import ElementOperation


class StartExcelWindowsDesktopPage(BasePage):
    NEW_ELEM = 'New'
    FILE_TAB_ELEM = 'File Tab'
    EXCEL_MAXIMIZE_CONTROL = 'Maximize'
    EXCEL_RESTORE_DOWN_CONTROL = 'Restore Down'

    def __init__(self):
        super().__init__()

        self.excel_main_windows_desktop_page = ExcelMainWindowsDesktopPage()

    def go_to_excel(self):
        ElementOperation.reset_excel_root_element(self.driver)

        self.click_element_by_name(StartExcelWindowsDesktopPage.FILE_TAB_ELEM,
                                   image_name=self.prepare_image_name('excel_file_tab'))

        self.click_element_by_name(StartExcelWindowsDesktopPage.NEW_ELEM,
                                   image_name=self.prepare_image_name('excel_new'))

        self.excel_main_windows_desktop_page.click_new_blank_workbook_elem()
