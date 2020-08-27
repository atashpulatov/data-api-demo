from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.util import Util
from pages.right_panel.right_panel_tile.right_panel_tile_mac_desktop_page import RightPanelTileMacDesktopPage
from framework.util.exception.MstrException import MstrException


class RangeTakenPopupMacDesktopPage(BaseMacDesktopPage):

    CANCEL_BUTTON_ELEM = BaseMacDesktopPage.RIGHT_SIDE_PANEL_ELEM + \
        "/AXGroup[@AXSubrole='AXApplicationDialog']/AXButton[1]"

    def click_cancel(self):
        self.get_element_by_xpath(RangeTakenPopupMacDesktopPage.CANCEL_BUTTON_ELEM).click()
