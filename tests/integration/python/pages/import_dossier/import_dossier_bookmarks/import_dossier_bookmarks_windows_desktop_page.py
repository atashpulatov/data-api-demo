from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.const import SHORT_TIMEOUT
from framework.util.exception.MstrException import MstrException


class ImportDossierBookmarksWindowsDesktopPage(BaseWindowsDesktopPage):
    BOOKMARK_BUTTON = 'Bookmarks'

    BOOKMARKS_FRAME = '//Pane[starts-with(@Name, "Bookmarks dialog")]'
    BOOKMARKS_FRAME_CLOSE = 'Close'

    BOOKMARK_WRAPPER = '//Text[@Name="MY BOOKMARKS"]/../List'
    BOOKMARK_ITEM_TAG = 'ListItem'

    ADD_BOOKMARK_BUTTON = 'Add Bookmark'
    BOOKMARK_NAME_INPUT = 'Bookmark name required'
    SAVE_BOOKMARK_BUTTON = 'Save'

    ERROR_DUPLICATE_NAME = 'The name is already taken.'

    def select_bookmark(self, bookmark_number):
        # open bookmarks window
        self.get_element_by_name(
          ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON,
          image_name=self.prepare_image_name(ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON)
        ).click()

        # select specified bookmark
        bookmark_wrapper = self.get_element_by_xpath(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_WRAPPER
        )

        bookmark_items = bookmark_wrapper.get_elements_by_tag_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_ITEM_TAG
        )

        bookmark_items[int(bookmark_number)-1].click()

    def create_bookmark(self, bookmark_name):
        # open bookmarks window
        self.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON,
            image_name=self.prepare_image_name(ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON)
        ).click()

        bookmarks_frame = self.get_element_by_xpath(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARKS_FRAME
        )

        # create new bookmark
        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.ADD_BOOKMARK_BUTTON
        ).click()

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_NAME_INPUT
        ).send_keys(bookmark_name)

        if bookmarks_frame.check_if_element_exists_by_name(
                ImportDossierBookmarksWindowsDesktopPage.ERROR_DUPLICATE_NAME,
                timeout=SHORT_TIMEOUT):
            raise MstrException('Bookmark with name "%s" already exists' % bookmark_name)

        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.SAVE_BOOKMARK_BUTTON
        ).click()

        # close bookmarks window
        bookmarks_frame.get_element_by_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARKS_FRAME_CLOSE
        ).click()
