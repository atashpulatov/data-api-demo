from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class ImportDossierFilterWindowsDesktopPage(BaseWindowsDesktopPage):
    FILTERS_BUTTON = 'Filter'
    APPLY_FILTER_BUTTON = 'Apply'

    DOSSIER_FILTER_VALUE = '//Pane[@Name=\"Filter Data\"]//CheckBox[@Name=\"%s\"]'
    DOSSIER_FILTER_YEAR = '//Pane[@Name=\"Filter Data\"]//MenuItem[@Name=\"Year\"]'

    def select_year_in_year_filter(self, year):
        self._open_year_filter()

        self._select_filter_checkbox(year)

        self._apply_filter()

    def _apply_filter(self):
        self.get_element_by_name(
            ImportDossierFilterWindowsDesktopPage.APPLY_FILTER_BUTTON,
            image_name=self.prepare_image_name(ImportDossierFilterWindowsDesktopPage.APPLY_FILTER_BUTTON)
        ).click()

    def _open_year_filter(self):
        self._open_filter_menu()

        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(ImportDossierFilterWindowsDesktopPage.DOSSIER_FILTER_YEAR).click()

    def _open_filter_menu(self):
        self.get_element_by_name(ImportDossierFilterWindowsDesktopPage.FILTERS_BUTTON).click()

    def _select_filter_checkbox(self, filter_name):
        popup_main_element = self.get_add_in_main_element()

        popup_main_element.get_element_by_xpath(
            ImportDossierFilterWindowsDesktopPage.DOSSIER_FILTER_VALUE % filter_name
        ).click()
