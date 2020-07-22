from pages.base_windows_desktop_page import BaseWindowsDesktopPage
from pages.excel.excel_main.excel_main_windows_desktop_page import ExcelMainWindowsDesktopPage
from pages.page_util.image_element import ImageElement
from pages.page_util.windows_desktop_workaround import WindowsDesktopWorkaround


class StartExcelWindowsDesktopPage(BaseWindowsDesktopPage):
    EXCEL_RESTORE_DOWN_ELEM = 'Restore Down'
    EXCEL_MAXIMIZE_ELEM = 'Maximize'
    EXCEL_MAXIMIZE_OFFSET_X = -17
    EXCEL_MAXIMIZE_OFFSET_Y = 17

    CHECK_IF_MAXIMIZED_TIMEOUT = 4

    NEW_ELEM = 'New'
    FILE_TAB_ELEM = 'File Tab'

    def __init__(self):
        super().__init__()

        self.excel_main_windows_desktop_page = ExcelMainWindowsDesktopPage()

        self.windows_desktop_workaround = WindowsDesktopWorkaround()

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

    def maximize_excel_window(self):
        # Excel usually is maximized, in this case 'Restore Down' is present and it's faster to look for existing
        # element instead of missing one ('Maximize')
        if not self.check_if_element_exists_by_name(StartExcelWindowsDesktopPage.EXCEL_RESTORE_DOWN_ELEM,
                                                    timeout=StartExcelWindowsDesktopPage.CHECK_IF_MAXIMIZED_TIMEOUT):
            maximize = self.get_element_by_name(StartExcelWindowsDesktopPage.EXCEL_MAXIMIZE_ELEM)

            maximize.click(
                offset_x=StartExcelWindowsDesktopPage.EXCEL_MAXIMIZE_OFFSET_X,
                offset_y=StartExcelWindowsDesktopPage.EXCEL_MAXIMIZE_OFFSET_Y
            )
