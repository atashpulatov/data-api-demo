from pages.base_browser_page import BaseBrowserPage
from pages.right_panel.right_panel_browser_page import RightPanelBrowserPage
from util.exception.MstrException import MstrException


class ImportDossierBrowserPage(BaseBrowserPage):
    VISUALIZATION_RADIO_BUTTON = '.mstrmojo-VizBox-selector'
    VISUALIZATION_LABEL = '.mstrmojo-EditableLabel'
    VISUALIZATION_TILE = '.mstrmojo-UnitContainer'

    IMPORT_BUTTON_ELEM = 'import'

    def __init__(self):
        super().__init__()

        self.right_panel_browser_page = RightPanelBrowserPage()

    def import_visualization_by_name(self, visualization_name):
        self.focus_on_import_dossier_frame()

        tile = self._find_tile_by_name(visualization_name)

        self.find_element_by_css_from_parent(tile, ImportDossierBrowserPage.VISUALIZATION_RADIO_BUTTON).click()

        self.pause(5)  # TODO wait when ready

        self._click_import_visualization()

    def _find_tile_by_name(self, visualization_name):
        all_tiles = self.get_elements_by_css(ImportDossierBrowserPage.VISUALIZATION_TILE)

        for tile in all_tiles:
            label_element = self.find_element_by_css_from_parent(tile, ImportDossierBrowserPage.VISUALIZATION_LABEL)
            if label_element.text == visualization_name:
                return tile

        raise MstrException('Visualization not found: %s.' % visualization_name)

    def _click_import_visualization(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(ImportDossierBrowserPage.IMPORT_BUTTON_ELEM).click()

        self.right_panel_browser_page.wait_for_import_to_finish_successfully()
