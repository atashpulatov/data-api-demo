from pages.base_browser_page import BaseBrowserPage
from pages.right_panel.right_panel_browser_page import RightPanelBrowserPage


class ImportDossierBrowserPage(BaseBrowserPage):
    VISUALIZATION_AT_TILE = '.mstrmojo-DocSubPanel-content > div > div:nth-child(%s)'
    VISUALIZATION_SELECTOR = '.mstrmojo-VizBox-selector'

    IMPORT_BUTTON_ELEM = 'import'

    def __init__(self):
        super().__init__()

        self.right_panel_browser_page = RightPanelBrowserPage()

    def import_visualization(self, visualization_number):
        self.focus_on_import_dossier_frame()

        radio_button_selector = ImportDossierBrowserPage.VISUALIZATION_AT_TILE % visualization_number

        radio_buttons = self.get_element_by_css(radio_button_selector)
        visualization = self.find_element_by_css_from_parent(
            radio_buttons,
            ImportDossierBrowserPage.VISUALIZATION_SELECTOR
        )
        visualization.click()

        self._click_import_visualization()

    def _click_import_visualization(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(ImportDossierBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_browser_page.wait_for_import_to_finish_successfully()
