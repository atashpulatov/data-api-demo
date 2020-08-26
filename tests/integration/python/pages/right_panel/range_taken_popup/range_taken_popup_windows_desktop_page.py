from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class RangeTakenPopupWindowsDesktopPage(BaseWindowsDesktopPage):
    RANGE_TAKEN_OK_BUTTON = 'OK button'
    RANGE_TAKEN_CANCEL_BUTTON = 'Cancel button'
    RANGE_TAKEN_ACTIVE_CELL_OPTION = 'Active Cell'

    def click_ok(self):
        self.get_element_by_name(
           RangeTakenPopupWindowsDesktopPage.RANGE_TAKEN_OK_BUTTON
        ).click()

    def click_cancel(self):
        self.get_element_by_name(
           RangeTakenPopupWindowsDesktopPage.RANGE_TAKEN_CANCEL_BUTTON
        ).click()

    def select_active_cell(self):
        self.get_element_by_name(
           RangeTakenPopupWindowsDesktopPage.RANGE_TAKEN_ACTIVE_CELL_OPTION
        ).click()
