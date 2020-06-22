from pages.base_page import BasePage


class DuplicateObjectPopupWindowsDesktopPage(BasePage):
    DUPLICATE_POPUP_IMPORT_BUTTON = 'Import button'
    DUPLICATE_POPUP_EDIT_BUTTON = 'Edit button'

    def __init__(self):
        super().__init__()

        # self.right_panel_browser_page = RightPanelBrowserPage()

    def click_import(self):
        self.click_element_by_name(DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_IMPORT_BUTTON,
                                   image_name=self.prepare_image_name(
                                       DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_IMPORT_BUTTON))

        # TODO check if import finished

    def click_edit(self):
        self.click_element_by_name(DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_EDIT_BUTTON,
                                   image_name=self.prepare_image_name(
                                       DuplicateObjectPopupWindowsDesktopPage.DUPLICATE_POPUP_EDIT_BUTTON))

        # TODO check if import finished
