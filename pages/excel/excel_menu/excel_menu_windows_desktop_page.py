from pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from util.config_util import ConfigUtil


class ExcelMenuWindowsDesktopPage(BaseWindowsDesktopPage):
    def click_add_in_elem(self):
        import_data_name = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        self.get_element_by_name(
            import_data_name,
            image_name=self.prepare_image_name(import_data_name)
        ).click()
