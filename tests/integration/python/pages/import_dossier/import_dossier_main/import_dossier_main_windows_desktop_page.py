from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


class ImportDossierMainWindowsDesktopPage(BaseWindowsDesktopPage):
    VISUALIZATION_TILE = '//Button/Pane/Pane/Group'

    IMPORT_BUTTON = 'Import'

    def import_visualization_by_name(self, visualization_name):
        tile = self._find_tile_by_name(visualization_name)
        tile.click(offset_x=5, offset_y=5)

        self.pause(5)  # TODO wait when ready

        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.IMPORT_BUTTON)
        ).click()

        self.pause(5)  # TODO wait when ready

    def _find_tile_by_name(self, visualization_name):
        popup_main_element = self.get_popup_main_element()

        all_tiles = popup_main_element.find_elements_by_xpath(ImportDossierMainWindowsDesktopPage.VISUALIZATION_TILE)

        for tile in all_tiles:
            if tile.text.startswith(visualization_name):
                return tile

        raise MstrException('Visualization not found: %s.' % visualization_name)
