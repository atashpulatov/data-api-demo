from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage


class DuplicateObjectPopupWindowsDesktopPage(BaseWindowsDesktopPage):
    DUPLICATE_POPUP_IMPORT_BUTTON = 'Import button'
    DUPLICATE_POPUP_EDIT_BUTTON = 'Edit button'
    DUPLICATE_POPUP_ACTIVE_CELL_RADIO_BUTTON = 'Active Cell'

    def __init__(self):
        super().__init__()

        # self.right_panel_browser_page = RightPanelBrowserPage()

    def click_import(self):
        self.get_element_by_name(
            DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_IMPORT_BUTTON,
            image_name=self.prepare_image_name(
                DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_IMPORT_BUTTON)
        ).click()

        # TODO check if import finished

    def click_edit(self):
        self.get_element_by_name(
            DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_EDIT_BUTTON,
            image_name=self.prepare_image_name(
                DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_EDIT_BUTTON)
        ).click()

        # TODO check if import finished

    def select_active_cell(self):
        self.get_element_by_name(
            DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_ACTIVE_CELL_RADIO_BUTTON
        ).click()
