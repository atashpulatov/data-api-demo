from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.exception.MstrException import MstrException


class ImportDossierFilterBrowserPage(BaseBrowserPage):
    FILTERS_BUTTON = '.icon-filter'
    FILTER_CHANGE_INCREASE = 'increased'
    FILTER_CHANGE_DECREASE = 'decreased'
    FILTER_SIDE_LEFT = 'left'
    FILTER_SIDE_RIGHT = 'right'
    FILTER_SLIDER_MIN_POINT = 'div.rc-slider-handle.rc-slider-handle-1'
    FILTER_SLIDER_MAX_POINT = 'div.rc-slider-handle.rc-slider-handle-2'
    FILTER_APPLY_BUTTON = 'div.mstrd-FilterPanelFooterContainer-apply > div > span'
    SLIDER_POINT_MAPPING = {
        FILTER_SIDE_LEFT: FILTER_SLIDER_MIN_POINT,
        FILTER_SIDE_RIGHT: FILTER_SLIDER_MAX_POINT
    }

    DOSSIER_FILTER_NAME = '.mstrd-FilterItemTitle-filterTitle'
    DOSSIER_FILTER_VALUE = '.mstrd-Checkbox-body[aria-label="%s"]'
    APPLY_FILTER_BUTTON = '.mstr-apply-button'

    def increase_year_filter_value(self, filter_change, filter_side):
        if filter_change not in (
                ImportDossierFilterBrowserPage.FILTER_CHANGE_INCREASE,
                ImportDossierFilterBrowserPage.FILTER_CHANGE_DECREASE):
            raise MstrException('Invalid filter change requested: %s' % filter_change)

        if filter_side not in ImportDossierFilterBrowserPage.SLIDER_POINT_MAPPING.keys():
            raise MstrException('Invalid filter side selected: %s' % filter_side)

        self.focus_on_dossier_frame()

        self._open_filter_menu()

        slider_point = ImportDossierFilterBrowserPage.SLIDER_POINT_MAPPING[filter_side]

        self.get_element_by_css(slider_point).click()

        if filter_change == ImportDossierFilterBrowserPage.FILTER_CHANGE_INCREASE:
            self.press_right_arrow()
        elif filter_change == ImportDossierFilterBrowserPage.FILTER_CHANGE_DECREASE:
            self.press_backspace()

        self.get_element_by_css(ImportDossierFilterBrowserPage.FILTER_APPLY_BUTTON).click()

    def _open_filter_menu(self):
        self.get_element_by_css(ImportDossierFilterBrowserPage.FILTERS_BUTTON).click()

    def open_year_filter(self):
        self._open_filter_menu()
        self.find_element_by_text_in_elements_list_by_css(ImportDossierFilterBrowserPage.DOSSIER_FILTER_NAME, 'Year').click()


    def select_year_filter_checkbox(self, year_value):
        year_check_box =  self.get_element_by_css(ImportDossierFilterBrowserPage.DOSSIER_FILTER_VALUE % year_value)
        year_check_box.click()

    def select_year_in_year_filter(self, year): 
        self.open_year_filter()
        self.select_year_filter_checkbox(year)
        self.get_element_by_css(ImportDossierFilterBrowserPage.APPLY_FILTER_BUTTON).click()
