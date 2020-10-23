from framework.pages_base.base_windows_desktop_page import BaseWindowsDesktopPage
from framework.util.exception.MstrException import MstrException


class ImportDossierBookmarksWindowsDesktopPage(BaseWindowsDesktopPage):
    BOOKMARK_BUTTON = 'Bookmarks'
    BOOKMARK_WRAPPER = '//Text[@Name="MY BOOKMARKS"]/../List'
    BOOKMARK_ITEM_TAG = 'ListItem'

    def select_bookmark(self, bookmark_number):
        self.get_element_by_name(
          ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON,
          image_name=self.prepare_image_name(ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_BUTTON)
        ).click()

        bookmark_wrapper = self.get_element_by_xpath(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_WRAPPER
        )

        bookmark_items = bookmark_wrapper.get_elements_by_tag_name(
            ImportDossierBookmarksWindowsDesktopPage.BOOKMARK_ITEM_TAG
        )

        bookmark_items[int(bookmark_number)-1].click()
