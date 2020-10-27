from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_windows_desktop_page import RightPanelTileWindowsDesktopPage


class ImportDossierMainWindowsDesktopPage(BaseWindowsDesktopPage):
    VISUALIZATION_TILE = '//Group/Pane/Pane/Group'

    IMPORT_BUTTON = 'Import'
    RESET_DSSIER = 'Reset'
    RESET_DSSIER_CONFIRM = 'Yes'

    VISUALIZATION_MENU_BUTTON = 'Menu for %s'
    SHOW_DATA = 'Show Data'

    def __init__(self):
        super().__init__()
        self.right_panel_tile_windows_desktop_page = RightPanelTileWindowsDesktopPage()

    def import_visualization_by_name(self, visualization_name):
        self.select_visualization_by_name(visualization_name)

        self.click_import_visualization()

    def select_visualization_by_name(self, visualization_name):
        tile = self.find_tile_by_name(visualization_name)
        tile.click(offset_x=5, offset_y=5)

        self.pause(5)  # TODO wait when ready

    def click_import_visualization(self):
        self.click_import_visualization_without_waiting_for_results()

        self.right_panel_tile_windows_desktop_page.wait_for_import_object_to_finish_successfully()

    def click_import_visualization_without_waiting_for_results(self):
        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.IMPORT_BUTTON)
        ).click()

    def click_import_visualization_to_duplicate(self):
        self.click_import_visualization_without_waiting_for_results()

        self.right_panel_tile_windows_desktop_page.wait_for_duplicate_object_to_finish_successfully()

    def find_tile_by_name(self, visualization_name):
        popup_main_element = self.get_add_in_main_element()

        all_tiles = popup_main_element.get_elements_by_xpath(ImportDossierMainWindowsDesktopPage.VISUALIZATION_TILE)

        for tile in all_tiles:
            if tile.text.startswith(visualization_name):
                return tile

        raise MstrException('Visualization not found: %s.' % visualization_name)

    def wait_for_dossier_to_load(self):
        self.pause(30)  # TODO wait when ready

    def reset_dossier(self):
        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.RESET_DSSIER,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.RESET_DSSIER)
        ).click()

        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.RESET_DSSIER_CONFIRM,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.RESET_DSSIER_CONFIRM)
        ).click()

    def open_show_data_panel(self, visualization_name):
        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.VISUALIZATION_MENU_BUTTON % visualization_name
        ).click()

        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.SHOW_DATA,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.SHOW_DATA)
        ).click()
