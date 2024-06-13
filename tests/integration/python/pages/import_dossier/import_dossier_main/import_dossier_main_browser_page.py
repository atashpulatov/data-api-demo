from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.exception.mstr_exception import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_browser_page import RightPanelTileBrowserPage


class ImportDossierMainBrowserPage(BaseBrowserPage):
    VISUALIZATION_RADIO_BUTTON = '.mstrmojo-VizBox-selector'
    VISUALIZATION_LABEL = '.mstrmojo-EditableLabel'
    VISUALIZATION_TILE = '.mstrmojo-UnitContainer'

    RESET_BUTTON = '.icon-tb_reset'
    RESET_CONFIRMATION_YES = '.mstrd-ConfirmationDialog-button'

    IMPORT_BUTTON = 'import'

    IMPORT_FORMATTED_DATA_BUTTON = 'import-formatted-data'

    TILE_CONTEXT_MENU = '.hover-menu-btn'
    CONTEXT_MENU_SHOW_DATA = 'Show Data'
    CONTEXT_MENU_TEXT_ELEMENTS = '.mtxt'

    MAXIMIZE_MINIMIZE_BUTTON_CSS = '.hover-max-restore-btn'

    INFORMATION_TEXT = 'span.dossier-window-information-text'

    PANEL_STACK_TAB_LABEL_CSS = '.mstrmojo-VITab-tab .mstrmojo-EditableLabel'
    PANEL_STACK_DOCUMENT_PANEL_CSS = '.mstrmojo-DocPanelStack-content'
    PANEL_STACK_SCROLL_RIGHT_BUTTON_CSS = '.mstrmojo-VITabStrip-rightBtn'

    INFO_WINDOW_VISUALIZATION_CSS = '.InfoWindowNode .mstrmojo-UnitContainer[aria-label="%s"]'

    def __init__(self):
        super().__init__()

        self.right_panel_tile_browser_page = RightPanelTileBrowserPage()

    def import_visualization_by_name(self, visualization_name):
        self.select_visualization_by_name(visualization_name)

        self.click_import_visualization()

    def select_visualization_by_name(self, visualization_name):
        self.focus_on_dossier_frame()

        tile = self._find_tile_by_name(visualization_name)

        tile.get_element_by_css(ImportDossierMainBrowserPage.VISUALIZATION_RADIO_BUTTON).click()

        self.pause(5)  # TODO wait when ready

    def open_show_data_panel(self, visualization_name):
        self.focus_on_dossier_frame()

        tile = self._find_tile_by_name(visualization_name)

        tile.get_element_by_css(ImportDossierMainBrowserPage.TILE_CONTEXT_MENU).move_to_and_click()

        self.find_element_in_list_by_text(
            ImportDossierMainBrowserPage.CONTEXT_MENU_TEXT_ELEMENTS,
            ImportDossierMainBrowserPage.CONTEXT_MENU_SHOW_DATA
        ).click()

    def _find_tile_by_name(self, visualization_name):
        all_tiles = self.get_elements_by_css(ImportDossierMainBrowserPage.VISUALIZATION_TILE)

        for tile in all_tiles:
            label_element = tile.get_element_by_css(ImportDossierMainBrowserPage.VISUALIZATION_LABEL)
            if label_element.text == visualization_name:
                return tile

        raise MstrException(f'Visualization not found: {visualization_name}.')

    def click_import_visualization(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ImportDossierMainBrowserPage.IMPORT_BUTTON).click()

        self.right_panel_tile_browser_page.wait_for_import_to_finish_successfully()

    def click_import_formatted_data_without_waiting_for_results(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ImportDossierMainBrowserPage.IMPORT_FORMATTED_DATA_BUTTON).click()

    def click_import_visualization_to_duplicate(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ImportDossierMainBrowserPage.IMPORT_BUTTON).click()

        self.right_panel_tile_browser_page.wait_for_duplicate_object_to_finish_successfully()

    def click_import_visualization_without_waiting_for_results(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_id(ImportDossierMainBrowserPage.IMPORT_BUTTON).click()

    def reset_dossier(self):
        self.focus_on_dossier_frame()

        self.get_element_by_css(ImportDossierMainBrowserPage.RESET_BUTTON).click()

        self.get_element_by_css(ImportDossierMainBrowserPage.RESET_CONFIRMATION_YES).click()

    def wait_for_dossier_to_load(self):
        self.focus_on_add_in_popup_frame()

        self.get_element_by_css(ImportDossierMainBrowserPage.INFORMATION_TEXT)

        # dossier object is ready when information text is visible, needs more time for final render of page content
        # TODO check if page loaded fully
        self.pause(2)

    def select_panel_stack(self, panel_stack_name):
        self.focus_on_dossier_frame()

        self._get_panel_stack_tab_label_in_element_by_name(self, panel_stack_name).click()

    def select_panel_stack_nested_in_panel_stack(self, nested_panel_stack_name, panel_stack_name):
        self.select_panel_stack(panel_stack_name)

        document_panel = self.get_element_by_css(ImportDossierMainBrowserPage.PANEL_STACK_DOCUMENT_PANEL_CSS)
        self._get_panel_stack_tab_label_in_element_by_name(
            document_panel,
            nested_panel_stack_name
        ).click()

    def _get_panel_stack_tab_label_in_element_by_name(self, selected_document_panel, panel_stack_tab_name):
        while True:
            panels_stack_tab_labels = selected_document_panel.get_elements_by_css(
                ImportDossierMainBrowserPage.PANEL_STACK_TAB_LABEL_CSS
            )

            for panels_stack_tab_label in panels_stack_tab_labels:
                if panels_stack_tab_label.text == panel_stack_tab_name:
                    return panels_stack_tab_label

            scroll_right_button = selected_document_panel.get_element_by_css(
                ImportDossierMainBrowserPage.PANEL_STACK_SCROLL_RIGHT_BUTTON_CSS
            )
            if not scroll_right_button.is_enabled_by_class_attribute_html():
                break

            scroll_right_button.click()

        raise MstrException(f'Could not find panel stack tab label: {panel_stack_tab_name}')

    def _get_info_window_visualization(self, visualization_name):
        return self.get_element_by_css(ImportDossierMainBrowserPage.INFO_WINDOW_VISUALIZATION_CSS % visualization_name)

    def select_info_window_visualization(self, visualization_name):
        info_window = self._get_info_window_visualization(visualization_name)

        info_window.get_element_by_css(ImportDossierMainBrowserPage.VISUALIZATION_RADIO_BUTTON).click()

    def open_show_data_panel_on_info_window(self, visualization_name):
        self.select_info_window_visualization(visualization_name)

        info_window = self._get_info_window_visualization(visualization_name)

        info_window.get_element_by_css(ImportDossierMainBrowserPage.TILE_CONTEXT_MENU).click()

        self.find_element_in_list_by_text(
            ImportDossierMainBrowserPage.CONTEXT_MENU_TEXT_ELEMENTS,
            ImportDossierMainBrowserPage.CONTEXT_MENU_SHOW_DATA
        ).click()

    def maximize_visualization_on_info_window(self, visualization_name):
        info_window = self._get_info_window_visualization(visualization_name)

        info_window.get_element_by_css(ImportDossierMainBrowserPage.MAXIMIZE_MINIMIZE_BUTTON_CSS).click()

    def minimize_visualization_on_info_window(self, visualization_name):
        info_window = self._get_info_window_visualization(visualization_name)

        info_window.get_element_by_css(ImportDossierMainBrowserPage.MAXIMIZE_MINIMIZE_BUTTON_CSS).click()
