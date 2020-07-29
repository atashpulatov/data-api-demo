from pages_base.base_browser_page import BaseBrowserPage


class ImportDossierShowDataBrowserPage(BaseBrowserPage):
    CLOSE_SHOW_DATA_SELECTOR = '.mstrmojo-ViewDataDialog .mstrmojo-Button-text'

    def close_show_data(self):
        self.get_element_by_css(ImportDossierShowDataBrowserPage.CLOSE_SHOW_DATA_SELECTOR).click()
