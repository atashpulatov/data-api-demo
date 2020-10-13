from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.exception.MstrException import MstrException
from pages.right_panel.right_panel_tile.right_panel_tile_mac_desktop_page import RightPanelTileMacDesktopPage


class ImportDossierMainMacDesktopPage(BaseMacDesktopPage):
    VISUALIZATION_COMMON_PATH = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]" \
                                                                        "/AXGroup[%s]/AXGroup[1]/AXGroup[0]"
    FIRST_STATIC_TEXT_GROUP = VISUALIZATION_COMMON_PATH + "/AXGroup[0]/AXGroup[1]/AXStaticText"
    VISUALIZATION_TITLE = VISUALIZATION_COMMON_PATH + "/AXGroup[%%s]/AXGroup[1]/AXStaticText[@AXValue='%s']"
    VISUALIZATION_TITLE_PARENT = VISUALIZATION_COMMON_PATH + "/AXGroup[%s]/AXGroup[1]"

    VISUALIZATION_RADIO_OFFSET_X = 3
    VISUALIZATION_RADIO_OFFSET_Y = 10

    DOSSIER_INFO_TEXT = 'This view supports the regular dossier manipulations. To import data, select a visualization.'
    DOSSIER_INFO_ELEM = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[0]/AXStaticText" \
                                                                "[@AXValue='%s']" % DOSSIER_INFO_TEXT

    BUTTON_IMPORT = BaseMacDesktopPage.POPUP_WRAPPER_ELEM + "/AXGroup[2]/AXButton[@AXTitle='Import']"

    def __init__(self):
        super().__init__()

        self.right_panel_tile_mac_desktop_page = RightPanelTileMacDesktopPage()

    def select_visualization_by_name(self, visualization_name):
        """
        Selects first Visualization called visualization_name.

        1. Find index of the first group containing AXStaticText (first Visualization, not necessarily
        called visualization_name). Assumption: AXStaticText contains AXValue which is equal to visualization_name.

        2. In the group found in 1., find index of a sub-group containing AXStaticText element, having AXValue
        equal to visualization_name.

        3. Find parent element of this AXStaticText element.

        4. Click parent element with a necessary offset.

        :param visualization_name: Visualization name to select.
        """
        first_static_text_selector = ImportDossierMainMacDesktopPage.FIRST_STATIC_TEXT_GROUP
        first_static_text_index = self.get_element_by_xpath_workaround_with_index(
            first_static_text_selector
        ).index

        visualization_title_selector = ImportDossierMainMacDesktopPage.VISUALIZATION_TITLE % (
            first_static_text_index, visualization_name
        )
        visualization_title_index = self.get_element_by_xpath_workaround_with_index(
            visualization_title_selector
        ).index

        visualization = ImportDossierMainMacDesktopPage.VISUALIZATION_TITLE_PARENT % (
            first_static_text_index, visualization_title_index
        )

        self.get_element_by_xpath(visualization).move_to_and_click(
            offset_x=ImportDossierMainMacDesktopPage.VISUALIZATION_RADIO_OFFSET_X,
            offset_y=ImportDossierMainMacDesktopPage.VISUALIZATION_RADIO_OFFSET_Y
        )

    def click_import_visualization(self):
        self.get_element_by_xpath(ImportDossierMainMacDesktopPage.BUTTON_IMPORT).click()

        self.right_panel_tile_mac_desktop_page.wait_for_import_to_finish_successfully()

    def wait_for_dossier_to_load(self):
        if not self.check_if_element_exists_by_xpath(ImportDossierMainMacDesktopPage.DOSSIER_INFO_ELEM):
            raise MstrException('Error while loading dossier, element not present: '
                                f'{ImportDossierMainMacDesktopPage.DOSSIER_INFO_ELEM}')

        # dossier object is ready when information text is visible, needs more time for final render of page content
        # TODO check if page loaded fully
        self.pause(2)
