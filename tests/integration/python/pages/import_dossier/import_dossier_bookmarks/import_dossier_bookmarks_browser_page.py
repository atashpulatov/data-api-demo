from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.exception.MstrException import MstrException


class ImportDossierBookmarksBrowserPage(BaseBrowserPage):
    BOOKMARK_BUTTON = '.icon-bookmark'
    BOOKMARK_ITEMS = '.mstrd-BookmarkItem-nameText'

    def select_bookmark(self, bookmark_number):
        self.focus_on_dossier_frame()

        self.get_element_by_css(ImportDossierBookmarksBrowserPage.BOOKMARK_BUTTON).click()

        bookmark_items = self.get_elements_by_css(ImportDossierBookmarksBrowserPage.BOOKMARK_ITEMS)

        bookmark_index = int(bookmark_number) - 1

        if bookmark_index > len(bookmark_items):
            raise MstrException(
                ('Not possible to click bookmark item, given object index is too big', bookmark_index, bookmark_items))

        bookmark_items[bookmark_index].click()

    def create_bookmark(self, bookmark_name):
        # TODO: Implement
        self.log('Missing step implementation.')
