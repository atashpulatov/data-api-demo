from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.mstr_exception import MstrException


class ImportDossierFilterWindowsDesktopPage(BaseWindowsDesktopPage):
    FILTERS_BUTTON = 'Filter'
    APPLY_FILTER_BUTTON = 'Apply'

    DOSSIER_FILTER_VALUE = '//Pane[@Name=\"Filter Data\"]//CheckBox[@Name=\"%s\"]'
    DOSSIER_FILTER_YEAR = '//Pane[@Name=\"Filter Data\"]//MenuItem[starts-with(@Name, \"Year\")]'

    DOSSIER_FILTER_VALUE_TEXT = '//ListItem[@Name="%s"]/../ListItem[2]'

    FILTER_CHANGE_INCREASE = 'increased'
    FILTER_CHANGE_DECREASE = 'decreased'
    FILTER_SIDE_LEFT = 'left'
    FILTER_SIDE_RIGHT = 'right'
    SLIDER = '//Pane[@Name=\"Filter Data\"]//Slider[%s]'

    SLIDER_POINT_MAPPING = {
        FILTER_SIDE_LEFT: 1,
        FILTER_SIDE_RIGHT: 2
    }

    def increase_year_filter_value(self, filter_change, filter_side):
        if filter_change not in (
                ImportDossierFilterWindowsDesktopPage.FILTER_CHANGE_INCREASE,
                ImportDossierFilterWindowsDesktopPage.FILTER_CHANGE_DECREASE):
            raise MstrException('Invalid filter change requested: %s' % filter_change)

        if filter_side not in ImportDossierFilterWindowsDesktopPage.SLIDER_POINT_MAPPING.keys():
            raise MstrException('Invalid filter side selected: %s' % filter_side)

        self._open_year_filter()

        slider_point = ImportDossierFilterWindowsDesktopPage.SLIDER_POINT_MAPPING[filter_side]

        add_in_main_element = self.get_add_in_main_element()
        filter_button = add_in_main_element.get_element_by_xpath(
            ImportDossierFilterWindowsDesktopPage.SLIDER % slider_point)
        filter_button.click()

        if filter_change == ImportDossierFilterWindowsDesktopPage.FILTER_CHANGE_INCREASE:
            filter_button.send_keys(Keys.ARROW_RIGHT)

        elif filter_change == ImportDossierFilterWindowsDesktopPage.FILTER_CHANGE_DECREASE:
            filter_button.press_left_arrow()

        self._apply_filter()

    def select_year_in_year_filter(self, year):
        self._open_year_filter()

        self._select_filter_checkbox(year)

        self._apply_filter()

    def _open_year_filter(self):
        self._open_filter_menu()

        add_in_main_element = self.get_add_in_main_element()
        add_in_main_element.get_element_by_xpath(ImportDossierFilterWindowsDesktopPage.DOSSIER_FILTER_YEAR).click()

    def _select_filter_checkbox(self, filter_name):
        add_in_main_element = self.get_add_in_main_element()

        add_in_main_element.get_element_by_xpath(
            ImportDossierFilterWindowsDesktopPage.DOSSIER_FILTER_VALUE % filter_name
        ).click()

    def _apply_filter(self):
        self.get_element_by_name(ImportDossierFilterWindowsDesktopPage.APPLY_FILTER_BUTTON).click()

    def _open_filter_menu(self):
        add_in_main_element = self.get_add_in_main_element()
        add_in_main_element.get_element_by_name(ImportDossierFilterWindowsDesktopPage.FILTERS_BUTTON).click()

    def get_filter_value(self, filter_name):
        add_in_main_element = self.get_add_in_main_element()

        filter_value = add_in_main_element.get_element_by_xpath(
            ImportDossierFilterWindowsDesktopPage.DOSSIER_FILTER_VALUE_TEXT % filter_name
        ).text

        return filter_value
