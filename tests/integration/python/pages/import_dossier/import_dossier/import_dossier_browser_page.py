from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage
from pages_base.base_browser_page import BaseBrowserPage
from util.exception.MstrException import MstrException


class ImportDossierBrowserPage(BaseBrowserPage):
    VISUALIZATION_RADIO_BUTTON = '.mstrmojo-VizBox-selector'
    VISUALIZATION_LABEL = '.mstrmojo-EditableLabel'
    VISUALIZATION_TILE = '.mstrmojo-UnitContainer'

    RESET_BUTTON = 'div.mstr-nav-icon.icon-resetfile'
    RESET_CONFIRMATION_YES = '.mstrd-DeleteDossier-button'

    IMPORT_BUTTON = 'import'

    TILE_CONTEXT_MENU = '.hover-menu-btn'
    CONTEXT_MENU_SHOW_DATA = 'Show Data'
    CONTEXT_MENU_TEXT_ELEMENTS = '.mtxt'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def import_visualization_by_name(self, visualization_name):
        self.select_visualization_by_name(visualization_name)

        self.click_import_visualization()

    def select_visualization_by_name(self, visualization_name):
        self.focus_on_import_dossier_frame()

        tile = self._find_tile_by_name(visualization_name)

        tile.get_element_by_css(ImportDossierBrowserPage.VISUALIZATION_RADIO_BUTTON).click()

        self.pause(5)  # TODO wait when ready

    def open_show_data_panel(self, visualization_name):
        self.focus_on_import_dossier_frame()

        tile = self._find_tile_by_name(visualization_name)

        tile.get_element_by_css(ImportDossierBrowserPage.TILE_CONTEXT_MENU).move_to_and_click()

        self.find_element_in_list_by_text(
            ImportDossierBrowserPage.CONTEXT_MENU_TEXT_ELEMENTS,
            ImportDossierBrowserPage.CONTEXT_MENU_SHOW_DATA
        ).click()

    def _find_tile_by_name(self, visualization_name):
        all_tiles = self.get_elements_by_css(ImportDossierBrowserPage.VISUALIZATION_TILE)

        for tile in all_tiles:
            label_element = tile.get_element_by_css(ImportDossierBrowserPage.VISUALIZATION_LABEL)
            if label_element.text == visualization_name:
                return tile

        raise MstrException('Visualization not found: %s.' % visualization_name)

    def click_import_visualization(self):
        self.focus_on_add_in_frame()

        self.get_element_by_id(ImportDossierBrowserPage.IMPORT_BUTTON).click()

        self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully()

    def reset_dossier(self):
        self.focus_on_import_dossier_frame()

        self.get_element_by_css(ImportDossierBrowserPage.RESET_BUTTON).click()

        self.get_element_by_css(ImportDossierBrowserPage.RESET_CONFIRMATION_YES).click()
