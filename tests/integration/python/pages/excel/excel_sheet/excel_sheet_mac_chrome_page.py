from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage


class ExcelSheetMacChromePage(ExcelSheetBrowserPage):
    COLUMN_HEADER = '.ewrch-col-nosel > .ewr-chc'
    EXCEL_COLUMN_OPTION_CSS = '.label-100'
    OPTION_DELETE_COLUMNS = 'Delete Columns'

    def remove_columns(self, column_name, number_of_columns):
        # TODO investigate if it's possible to delete column using top menu or using keyboard keys
        self.focus_on_excel_frame()

        for i in range(0, int(number_of_columns)):
            self.go_to_cell('%s1' % column_name)

            self.press_tab()

            self.find_element_by_text_in_elements_list_by_css(
                ExcelSheetMacChromePage.COLUMN_HEADER, column_name).right_click()

            self.find_element_by_text_in_elements_list_by_css(
                ExcelSheetMacChromePage.EXCEL_COLUMN_OPTION_CSS,
                ExcelSheetMacChromePage.OPTION_DELETE_COLUMNS
            ).click()
