from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from pages.right_panel.right_panel_tile.right_panel_tile_mac_desktop_page import RightPanelTileMacDesktopPage


class DuplicateObjectPopupMacDesktopPage(BaseMacDesktopPage):
    DUPLICATE_POPUP_IMPORT_BUTTON = BaseMacDesktopPage.RIGHT_SIDE_PANEL_DIALOG_ELEM + "/AXButton[1]"
    DUPLICATE_POPUP_EDIT_BUTTON = BaseMacDesktopPage.RIGHT_SIDE_PANEL_DIALOG_ELEM + "/AXButton[2]"

    DUPLICATE_POPUP_ACTIVE_CELL_OPTION = BaseMacDesktopPage.RIGHT_SIDE_PANEL_DIALOG_ELEM + "/AXGroup[2]/" \
                                                                                           "AXRadioButton" \
                                                                                           "[@AXDOMIdentifier=" \
                                                                                           "'active_cell']"

    def __init__(self):
        super().__init__()

        self.right_panel_tile_mac_desktop_page = RightPanelTileMacDesktopPage()

    def click_import(self):
        self.get_element_by_xpath(DuplicateObjectPopupMacDesktopPage.DUPLICATE_POPUP_IMPORT_BUTTON).click()

        self.right_panel_tile_mac_desktop_page.wait_for_duplicate_object_to_finish_successfully()

    def click_edit(self):
        self.get_element_by_xpath(DuplicateObjectPopupMacDesktopPage.DUPLICATE_POPUP_EDIT_BUTTON).click()

    def select_active_cell(self):
        self.get_element_by_xpath(DuplicateObjectPopupMacDesktopPage.DUPLICATE_POPUP_ACTIVE_CELL_OPTION).click()
