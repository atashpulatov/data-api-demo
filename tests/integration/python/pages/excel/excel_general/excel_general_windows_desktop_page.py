from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.pages_base.image_element import ImageElement
from framework.pages_base.windows_desktop_workaround import WindowsDesktopWorkaround
from framework.util.const import DEFAULT_LOCALE_NAME
from pages.excel.excel_main.excel_main_windows_desktop_page import ExcelMainWindowsDesktopPage


class ExcelGeneralWindowsDesktopPage(BaseWindowsDesktopPage):
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

    def go_to_excel(self, locale_name=DEFAULT_LOCALE_NAME):
        ImageElement.reset_excel_root_element(self.driver)

        self.log_error(('1 go_to_excel',))

        file_tab_element = self.get_element_by_name(
            ExcelGeneralWindowsDesktopPage.FILE_TAB_ELEM,
            image_name=self.prepare_image_name(ExcelGeneralWindowsDesktopPage.FILE_TAB_ELEM)
        )
        self.log_error(('2 go_to_excel', file_tab_element))
        self.log_error(('2 go_to_excel', file_tab_element.size))
        self.log_error(('2 go_to_excel', file_tab_element.location))

        file_tab_element.click()

        self.log_error(('3 go_to_excel',))

        self.get_element_by_name(
            ExcelGeneralWindowsDesktopPage.NEW_ELEM,
            image_name=self.prepare_image_name(ExcelGeneralWindowsDesktopPage.NEW_ELEM)
        ).click()

        self.excel_main_windows_desktop_page.click_new_blank_workbook_elem()

    def maximize_excel_window(self):
        # Excel usually is maximized, in this case 'Restore Down' is present and it's faster to look for existing
        # element instead of missing one ('Maximize')
        if not self.check_if_element_exists_by_name(ExcelGeneralWindowsDesktopPage.EXCEL_RESTORE_DOWN_ELEM,
                                                    timeout=ExcelGeneralWindowsDesktopPage.CHECK_IF_MAXIMIZED_TIMEOUT):
            maximize = self.get_element_by_name(ExcelGeneralWindowsDesktopPage.EXCEL_MAXIMIZE_ELEM)

            maximize.click(
                offset_x=ExcelGeneralWindowsDesktopPage.EXCEL_MAXIMIZE_OFFSET_X,
                offset_y=ExcelGeneralWindowsDesktopPage.EXCEL_MAXIMIZE_OFFSET_Y
            )
