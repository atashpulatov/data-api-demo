from framework.pages_base.base_browser_page import BaseBrowserPage
from framework.util.const import Const
from framework.util.exception.MstrException import MstrException


class ImportDossierBookmarksBrowserPage(BaseBrowserPage):
    BOOKMARK_BUTTON = '.icon-tb_bookmarks_n'
    BOOKMARK_ITEMS = '.mstrd-BookmarkItem-nameText'
    BOOKMARK_SHARE_ICON = '.icon-pnl_sharebookmark'

    def select_bookmark(self, bookmark_number):
        self.focus_on_dossier_frame()

        self.get_element_by_css(ImportDossierBookmarksBrowserPage.BOOKMARK_BUTTON).click()

        bookmark_items = self.get_elements_by_css(ImportDossierBookmarksBrowserPage.BOOKMARK_ITEMS)

        bookmark_index = int(bookmark_number) - 1

        if bookmark_index > len(bookmark_items):
            raise MstrException(
                ('Not possible to click bookmark item, given object index is too big', bookmark_index, bookmark_items))

        bookmark_items[bookmark_index].click()

    def create_bookmark_if_not_exists(self, bookmark_name):
        # TODO: Implement
        self.log('Missing step implementation.')

    def is_share_bookmark_not_visible(self):
        self.select_bookmark(1)

        return not self.check_if_element_exists_by_css(
            ImportDossierBookmarksBrowserPage.BOOKMARK_SHARE_ICON,
            timeout=Const.SHORT_TIMEOUT
        )
