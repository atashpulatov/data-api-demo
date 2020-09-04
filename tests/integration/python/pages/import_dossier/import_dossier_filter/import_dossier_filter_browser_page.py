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

  