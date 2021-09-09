from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.mstr_exception import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_windows_desktop_page import RightPanelTileWindowsDesktopPage


class ImportDossierMainWindowsDesktopPage(BaseWindowsDesktopPage):
    VISUALIZATION_TILE = '//DataGrid[@Name="%s"]'
    IMPORT_BUTTON = 'Import'
    RESET_DOSSIER = 'Reset'
    RESET_DOSSIER_CONFIRM = 'Yes'

    IMPORT_BUTTON_IMAGE_NAME = IMPORT_BUTTON + 'Dossier'

    VISUALIZATION_MENU_BUTTON = 'Menu for %s'
    SHOW_DATA = 'Show Data'

    CONTENT_PANEL_XPATH = '//Pane[@Name="Contents Panel"]'
    PANEL_STACK_ELEMENT_XPATH = '//Group/Table/DataItem[@Name="%s"]'
    NESTED_PANEL_STACK_ELEMENT_XPATH = '//Pane[@Name="Contents Panel"]/Group/Group/Group/Table/DataItem[@Name="%s"]'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_windows_desktop_page = RightPanelTileWindowsDesktopPage()

    def import_visualization_by_name(self, visualization_name):
        self.select_visualization_by_name(visualization_name)

        self.click_import_visualization()

    def select_visualization_by_name(self, visualization_name):
        tile = self.find_tile_by_name(visualization_name)
        tile.click(offset_x=5, offset_y=-32)

        self.pause(5)  # TODO wait when ready

    def click_import_visualization(self):
        self.click_import_visualization_without_waiting_for_results()
        self.right_panel_tile_windows_desktop_page.wait_for_import_object_to_finish_successfully()

    def click_import_visualization_to_duplicate(self):
        self.click_import_visualization_without_waiting_for_results()
        self.right_panel_tile_windows_desktop_page.wait_for_duplicate_object_to_finish_successfully()

    def click_import_visualization_without_waiting_for_results(self):
        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.IMPORT_BUTTON,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.IMPORT_BUTTON_IMAGE_NAME)
        ).click()

    def find_tile_by_name(self, visualization_name):
        popup_main_element = self.get_add_in_main_element()

        return popup_main_element.get_element_by_xpath(
            ImportDossierMainWindowsDesktopPage.VISUALIZATION_TILE % visualization_name
        )

    def wait_for_dossier_to_load(self):
        self.pause(30)  # TODO wait when ready

    def select_panel_stack(self, panel_stack_name):
        content_panel = self.get_element_by_xpath(ImportDossierMainWindowsDesktopPage.CONTENT_PANEL_XPATH)

        content_panel.get_element_by_xpath(
            ImportDossierMainWindowsDesktopPage.PANEL_STACK_ELEMENT_XPATH % panel_stack_name,
        ).click()

    def select_panel_stack_nested_in_panel_stack(self, nested_panel_stack_name, panel_stack_name):
        content_panel = self.get_element_by_xpath(ImportDossierMainWindowsDesktopPage.CONTENT_PANEL_XPATH)

        content_panel.get_element_by_xpath(
            ImportDossierMainWindowsDesktopPage.PANEL_STACK_ELEMENT_XPATH % panel_stack_name,
        ).click()

        content_panel.get_element_by_xpath(
            ImportDossierMainWindowsDesktopPage.NESTED_PANEL_STACK_ELEMENT_XPATH % nested_panel_stack_name
        ).click()

    def reset_dossier(self):
        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.RESET_DOSSIER,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.RESET_DOSSIER)
        ).click()

        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.RESET_DOSSIER_CONFIRM,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.RESET_DOSSIER_CONFIRM)
        ).click()

    def open_show_data_panel(self, visualization_name):
        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.VISUALIZATION_MENU_BUTTON % visualization_name
        ).click()

        self.get_element_by_name(
            ImportDossierMainWindowsDesktopPage.SHOW_DATA,
            image_name=self.prepare_image_name(ImportDossierMainWindowsDesktopPage.SHOW_DATA)
        ).click()
