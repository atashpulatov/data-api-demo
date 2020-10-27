from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ImportDossierShowDataWindowsDesktopPage(BaseWindowsDesktopPage):
    CLOSE_SHOW_DATA_SELECTOR = '//Group[starts-with(@Name,\"Show Data\")]//Text[@Name=\"Close\"]'

    def close_show_data(self):
        self.get_element_by_xpath(
            ImportDossierShowDataWindowsDesktopPage.CLOSE_SHOW_DATA_SELECTOR,
            image_name=self.prepare_image_name(ImportDossierShowDataWindowsDesktopPage.CLOSE_SHOW_DATA_SELECTOR)
        ).click()
