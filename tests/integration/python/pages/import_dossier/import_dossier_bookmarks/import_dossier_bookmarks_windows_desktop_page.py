from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import SHORT_TIMEOUT


class ImportDossierBookmarksWindowsDesktopPage(BaseWindowsDesktopPage):
    BOOKMARK_BUTTON = 'Bookmarks'

    BOOKMARKS_FRAME = '//Pane[starts-with(@Name, "Bookmarks dialog")]'
    BOOKMARKS_FRAME_CLOSE = 'Close'

    BOOKMARK_WRAPPER = '//Text[@Name="MY BOOKMARKS"]/../List'
    BOOKMARK_ITEM_TAG = 'ListItem'

    ADD_NEW_BUTTON = 'Add New'
    ADD_BOOKMARK_BUTTON = 'Add Bookmark'
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

    def create_bookmark_if_not_exists(self, bookmark_name):
        self._open_bookmarks_window()

        add_in_main_element = self.get_add_in_main_element()
        bookmarks_frame = add_in_main_element.get_element_by_xpath(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARKS_FRAME
        )

        add_new_button_exists = bookmarks_frame.check_if_element_exists_by_name(
            ImportDossierBookmarksWindowsDesktopPage.ADD_NEW_BUTTON, timeout=SHORT_TIMEOUT
        )

        if add_new_button_exists:
            self._add_first_bookmark(bookmarks_frame, bookmark_name)
        else:
            self._add_subsequent_bookmark(bookmarks_frame, bookmark_name)

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARKS_FRAME_CLOSE
        ).click()

    def _add_first_bookmark(self, bookmarks_frame, bookmark_name):
        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.ADD_NEW_BUTTON
        ).click()

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_NAME_INPUT
        ).send_keys(bookmark_name)

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.SAVE_BOOKMARK_BUTTON
        ).click()

    def _add_subsequent_bookmark(self, bookmarks_frame, bookmark_name):
        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.ADD_BOOKMARK_BUTTON
        ).click()

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_NAME_INPUT
        ).send_keys(bookmark_name)

        if not bookmarks_frame.check_if_element_exists_by_name(
                ImportDossierBookmarksWindowsDesktopPage.ERROR_DUPLICATE_NAME,
                timeout=SHORT_TIMEOUT):
            bookmarks_frame.get_element_by_name(
                ImportDossierBookmarksWindowsDesktopPage.SAVE_BOOKMARK_BUTTON
            ).click()

    def _open_bookmarks_window(self):
        self.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON,
            image_name=self.prepare_image_name(ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON)
        ).click()
