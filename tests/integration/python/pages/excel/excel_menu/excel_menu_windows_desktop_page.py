from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.config_util import ConfigUtil


class ExcelMenuWindowsDesktopPage(BaseWindowsDesktopPage):
    NAME_BOX_ELEM = 'Name Box'

    def click_add_in_elem(self):
        import_data_name = ConfigUtil.get_excel_desktop_add_in_import_data_name()

        self.get_element_by_name(
            import_data_name,
            image_name=self.prepare_image_name(import_data_name)
        ).click()

    def select_object_from_name_box(self, object_number):
        self.get_element_by_name(
            ExcelMenuWindowsDesktopPage.NAME_BOX_ELEM,
            image_name=self.prepare_image_name(ExcelMenuWindowsDesktopPage.NAME_BOX_ELEM)
        ).click()

        for i in range(int(object_number)):
            self.press_down_arrow()

        self.press_enter()
