from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


class ImportDossierFilterWindowsDesktopPage(BaseWindowsDesktopPage):
    FILTERS_BUTTON = 'Filter'
    FILTER_APPLY_BUTTON = 'Apply'
    FILTER_CHANGE_INCREASE = 'increased'
    FILTER_CHANGE_DECREASE = 'decreased'
    FILTER_SIDE_LEFT = 'left'
    FILTER_SIDE_RIGHT = 'right'
    FILTER_SLIDER = '//Pane[@Name=\"Filter Data\"]//Slider[@Name=\"slider handle\"]'

    SLIDER_POINT_MAPPING = {
        FILTER_SIDE_LEFT: 0,
        FILTER_SIDE_RIGHT: 1
    }

    DOSSIER_FILTER_VALUE = '//Pane[@Name=\"Filter Data\"]//CheckBox[@Name=\"%s\"]'
    DOSSIER_FILTER_YEAR = '//Pane[@Name=\"Filter Data\"]//MenuItem[@Name=\"Year\"]'

    def increase_year_filter_value(self, filter_change, filter_side):
        if filter_change not in (
                ImportDossierFilterWindowsDesktopPage.FILTER_CHANGE_INCREASE,
                ImportDossierFilterWindowsDesktopPage.FILTER_CHANGE_DECREASE):
            raise MstrException('Invalid filter change requested: %s' % filter_change)

        if filter_side not in ImportDossierFilterWindowsDesktopPage.SLIDER_POINT_MAPPING.keys():
            raise MstrException('Invalid filter side selected: %s' % filter_side)

        self._open_filter_menu()

        slider_point = ImportDossierFilterWindowsDesktopPage.SLIDER_POINT_MAPPING[filter_side]

        self.get_elements_by_xpath(ImportDossierFilterWindowsDesktopPage.FILTER_SLIDER)[slider_point].click()

        if filter_change == ImportDossierFilterWindowsDesktopPage.FILTER_CHANGE_INCREASE:
            self.press_right_arrow()
        elif filter_change == ImportDossierFilterWindowsDesktopPage.FILTER_CHANGE_DECREASE:
            self.press_backspace()

        self._apply_filter()

    def select_year_in_year_filter(self, year):
        self._open_year_filter()

        self._select_filter_checkbox(year)

        self._apply_filter()

    def _apply_filter(self):
        self.get_element_by_name(
            ImportDossierFilterWindowsDesktopPage.FILTER_APPLY_BUTTON,
            image_name=self.prepare_image_name(ImportDossierFilterWindowsDesktopPage.FILTER_APPLY_BUTTON)
        ).click()

    def _open_year_filter(self):
        self._open_filter_menu()

        self.get_element_by_xpath(ImportDossierFilterWindowsDesktopPage.DOSSIER_FILTER_YEAR).click()

    def _open_filter_menu(self):
        self.get_element_by_name(ImportDossierFilterWindowsDesktopPage.FILTERS_BUTTON).click()

    def _select_filter_checkbox(self, filter_name):
        self.get_element_by_xpath(ImportDossierFilterWindowsDesktopPage.DOSSIER_FILTER_VALUE % filter_name).click()
