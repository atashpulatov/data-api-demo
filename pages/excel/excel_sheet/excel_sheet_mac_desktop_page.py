import re

from selenium.webdriver.common.keys import Keys

from pages.base_mac_desktop_page import BaseMacDesktopPage
from util.util import Util


class ExcelSheetMacDesktopPage(BaseMacDesktopPage):
    EDIT_MENU = "%s/AXMenuBarItem[@AXTitle='Edit']" % BaseMacDesktopPage.EXCEL_MENU_ELEM

    EDIT_FIND_MENU = "%s/AXMenu[0]/AXMenuItem[@AXTitle='Find']" % EDIT_MENU
    EDIT_FIND_GO_TO_MENU = "%s/AXMenu[0]/AXMenuItem[@AXTitle='Go to...']" % EDIT_FIND_MENU

    GO_TO_PROMPT_INPUT = "%s/AXWindow[@AXTitle='Go to' and @AXSubrole='AXDialog']/" \
                         "AXTextField" % BaseMacDesktopPage.EXCEL_APP_ELEM

    FORMAT_MENU = "%s/AXMenuBarItem[@AXTitle='Format']" % BaseMacDesktopPage.EXCEL_MENU_ELEM
    FORMAT_CELLS_MENU = "%s/AXMenu[0]/AXMenuItem[@AXTitle='Cells...']" % FORMAT_MENU

    FORMAT_CELLS_PROMPT_DIALOG = "%s/AXWindow[@AXTitle='Format Cells' and " \
                                 "@AXSubrole='AXDialog']" % BaseMacDesktopPage.EXCEL_APP_ELEM
    FORMAT_CELLS_PROMPT_SAMPLE = "%s/AXTabGroup/AXGroup/AXStaticText" % FORMAT_CELLS_PROMPT_DIALOG
    FORMAT_CELLS_PROMPT_CANCEL_BUTTON = "%s/AXButton[@AXTitle='Cancel']" % FORMAT_CELLS_PROMPT_DIALOG

    WORKSHEETS_TABS = "%s/AXWindow[@AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXLayoutArea" \
                      "[@AXTitle='Content Area']/AXButton[%%s]" % BaseMacDesktopPage.EXCEL_APP_ELEM

    WORKSHEET_ITEM_RE = re.compile('^sheetTab\d+$')

    def get_cells_values(self, cells):
        result = []

        for cell in cells:
            result.append(self._get_cell_value(cell))

        return result

    def _get_cell_value(self, cell):
        self._go_to_cell(cell)

        value = self._get_selected_cell_value()

        return value.strip() if value else value

    def _go_to_cell(self, cell):
        cell_upper = cell.upper()

        self.get_element_by_xpath(ExcelSheetMacDesktopPage.EDIT_MENU).click()
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.EDIT_FIND_MENU).click()
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.EDIT_FIND_GO_TO_MENU).click()

        cell_input = self.get_element_by_xpath(ExcelSheetMacDesktopPage.GO_TO_PROMPT_INPUT)
        Util.pause(0.1)

        cell_input.clear()
        Util.pause(0.1)

        cell_input.send_keys(cell_upper)
        Util.pause(0.1)

        cell_input.send_keys_raw(Keys.ENTER)
        Util.pause(0.1)

    def _get_selected_cell_value(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_MENU).click()
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_CELLS_MENU).click()

        sample_element = self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_CELLS_PROMPT_SAMPLE)

        sample_element_text = sample_element.text.strip()

        result = sample_element_text if len(sample_element_text) > 0 else ''

        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_CELLS_PROMPT_CANCEL_BUTTON).click()

        return result

    def get_number_of_worksheets(self):
        tabs_elements = self._get_worksheet_tabs()

        return len(tabs_elements)

    def _get_worksheet_tabs(self):
        found_elements = []

        all_elements = self.get_elements_by_xpath(ExcelSheetMacDesktopPage.WORKSHEETS_TABS)

        for element in all_elements:
            identifier = element.get_attribute('AXIdentifier')
            if ExcelSheetMacDesktopPage.WORKSHEET_ITEM_RE.search(identifier):
                self.log(identifier)
                found_elements.append(element)

        return found_elements
