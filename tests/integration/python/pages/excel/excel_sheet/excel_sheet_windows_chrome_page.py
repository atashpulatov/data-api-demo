from pages.excel.excel_sheet.excel_sheet_browser_page import ExcelSheetBrowserPage


class ExcelSheetWindowsChromePage(ExcelSheetBrowserPage):
    COLUMN_HEADER = '.ewrch-col-nosel > .ewr-chc'
    EXCEL_COLUMN_OPTION_CSS = '.label-100'
    OPTION_DELETE_COLUMNS = 'Delete Columns'

    def remove_columns(self, first_column_to_be_deleted, number_of_columns_to_be_deleted):
        # TODO investigate if it's possible to delete column using top menu or using keyboard keys
        self.focus_on_excel_frame()

        for i in range(0, int(number_of_columns_to_be_deleted)):
            self.go_to_cell('%s1' % first_column_to_be_deleted)

            self.press_tab()

            self.find_element_by_text_in_elements_list_by_css(
                ExcelSheetWindowsChromePage.COLUMN_HEADER, first_column_to_be_deleted).right_click()

            self.find_element_by_text_in_elements_list_by_css(
                ExcelSheetWindowsChromePage.EXCEL_COLUMN_OPTION_CSS,
                ExcelSheetWindowsChromePage.OPTION_DELETE_COLUMNS
            ).click()
