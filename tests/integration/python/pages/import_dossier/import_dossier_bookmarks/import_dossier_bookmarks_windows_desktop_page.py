from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException


class ImportDossierBookmarksWindowsDesktopPage(BaseWindowsDesktopPage):
    BOOKMARK_BUTTON = 'Bookmarks'

    BOOKMARKS_FRAME = '//Pane[starts-with(@Name, "Bookmarks dialog")]'
    BOOKMARKS_FRAME_CLOSE = 'Close'

    BOOKMARK_WRAPPER = '//Text[@Name="MY BOOKMARKS"]/../List'
    BOOKMARK_ITEM_TAG = 'ListItem'

    ADD_BOOKMARK_BUTTON = 'Add New'
    BOOKMARK_NAME_INPUT = 'Bookmark name required'
    SAVE_BOOKMARK_BUTTON = 'Save'

    ERROR_DUPLICATE_NAME = 'The name is already taken.'

    def select_bookmark(self, bookmark_number):
        self._open_bookmarks_window()

        add_in_main_element = self.get_add_in_main_element()
        bookmark_wrapper = add_in_main_element.get_element_by_xpath(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_WRAPPER
        )

        bookmark_items = bookmark_wrapper.get_elements_by_tag_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_ITEM_TAG
        )

        bookmark_items[int(bookmark_number) - 1].click()

    def create_bookmark(self, bookmark_name):
        self._open_bookmarks_window()

        add_in_main_element = self.get_add_in_main_element()
        bookmarks_frame = add_in_main_element.get_element_by_xpath(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARKS_FRAME
        )

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.ADD_BOOKMARK_BUTTON
        ).click()

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_NAME_INPUT
        ).send_keys(bookmark_name)

        if bookmarks_frame.check_if_element_exists_by_name(
                ImportDossierBookmarksWindowsDesktopPage.ERROR_DUPLICATE_NAME,
                timeout=SHORT_TIMEOUT):
            raise MstrException(f'Bookmark called [{bookmark_name}] already exists.')

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.SAVE_BOOKMARK_BUTTON
        ).click()

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARKS_FRAME_CLOSE
        ).click()

    def _open_bookmarks_window(self):
        self.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON,
            image_name=self.prepare_image_name(ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON)
        ).click()
