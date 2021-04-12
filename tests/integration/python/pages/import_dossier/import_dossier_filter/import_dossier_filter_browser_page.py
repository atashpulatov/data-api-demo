from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.exception.mstr_exception import MstrException


class ImportDossierFilterBrowserPage(BaseBrowserPage):
    FILTERS_BUTTON = '.mstrd-FilterNavItemContainer'
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

    FILTER_SUMMARY_ITEMS_CLASS = '.mstrd-FilterSummaryBarItem'
    FILTER_SUMMARY_BAR_ITEM_CLASS = '.mstrd-FilterSummaryBarItem-summaryText'
    FILTER_SUMMARY_ITEM_TITLE_CLASS = '.mstrd-FilterSummaryBarItem-titleText'

    DOSSIER_FILTER_NAME = '.mstrd-FilterItemTitle-filterTitle'
    DOSSIER_FILTER_VALUE = '.mstrd-Checkbox-body[aria-label="%s"]'

    DOSSIER_FILTER_YEAR = 'Year'

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

        self._apply_filter()

    def select_year_in_year_filter(self, year):
        self._open_year_filter()

        self._select_filter_checkbox(year)

        self._apply_filter()

    def get_filter_value(self, filter_name):

        filter_item = self._get_filter_summary_item_by_name(filter_name)

        filter_value = filter_item.get_element_by_css(ImportDossierFilterBrowserPage.FILTER_SUMMARY_BAR_ITEM_CLASS).text

        return f'({filter_value})'

    def _apply_filter(self):
        self.get_element_by_css(ImportDossierFilterBrowserPage.APPLY_FILTER_BUTTON).click()

    def _open_year_filter(self):
        self.focus_on_dossier_frame()

        self._open_filter_menu()

        self.find_element_by_text_in_elements_list_by_css(
            ImportDossierFilterBrowserPage.DOSSIER_FILTER_NAME,
            ImportDossierFilterBrowserPage.DOSSIER_FILTER_YEAR
        ).click()

    def _open_filter_menu(self):
        self.get_element_by_css(ImportDossierFilterBrowserPage.FILTERS_BUTTON).click()

    def _select_filter_checkbox(self, filter_name):
        self.get_element_by_css(ImportDossierFilterBrowserPage.DOSSIER_FILTER_VALUE % filter_name).click()

    def _get_filter_summary_item_by_name(self, filter_name):
        filter_items = self.get_elements_by_css(ImportDossierFilterBrowserPage.FILTER_SUMMARY_ITEMS_CLASS)

        for filter_item in filter_items:
            filter_title_css = ImportDossierFilterBrowserPage.FILTER_SUMMARY_ITEM_TITLE_CLASS
            filter_title = filter_item.get_element_by_css(filter_title_css).text

            if filter_title == filter_name:
                return filter_item

        raise MstrException(f'Could not find filter by name [{filter_name}]')
