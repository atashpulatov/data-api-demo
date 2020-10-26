from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.config_util import ConfigUtil


class ExcelMenuWindowsDesktopPage(BaseWindowsDesktopPage):
    MENU_BUTTON = 'Task Pane Options'
    MENU_BUTTON_WIDTH = 40
    MENU_BUTTONS_MARGIN = 20

    def click_add_in_elem(self):
        import_data_name = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        self.get_element_by_name(
            import_data_name,
            image_name=self.prepare_image_name(import_data_name)
        ).click()

    def click_close_add_in_button(self):
        # Close add-in button ('X') is not present in page source. Workaround is to find button next to this element
        # and move to the right.
        self.get_element_by_name(
            ExcelMenuWindowsDesktopPage.MENU_BUTTON,
            image_name=self.prepare_image_name(ExcelMenuWindowsDesktopPage.MENU_BUTTON)
        ).move_to_and_click(
            offset_x=ExcelMenuWindowsDesktopPage.MENU_BUTTON_WIDTH + ExcelMenuWindowsDesktopPage.MENU_BUTTONS_MARGIN,
            offset_y=10
        )
