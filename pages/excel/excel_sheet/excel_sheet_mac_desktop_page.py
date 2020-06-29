from selenium.webdriver.common.keys import Keys

from pages.base_page import BasePage
from util.util import Util


class ExcelSheetMacDesktopPage(BasePage):
    EDIT_MENU = "/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Edit']"
    EDIT_TAB_FIND = "/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Edit']/" \
                    "AXMenu[0]/AXMenuItem[@AXTitle='Find']"
    EDIT_TAB_FIND_GO_TO = "/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Edit']/" \
                          "AXMenu[0]/AXMenuItem[@AXTitle='Find']/AXMenu[0]/AXMenuItem[@AXTitle='Go to...']"
    GO_TO_PROMPT_INPUT = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Go to' and @AXIdentifier=" \
                         "'_NS:117' and @AXSubrole='AXDialog']/AXTextField[@AXIdentifier='_NS:31']"

    FORMAT_TAB = "/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Format']"
    FORMAT_TAB_CELLS = "/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Format']/" \
                       "AXMenu[0]/AXMenuItem[@AXTitle='Cells...']"
    FORMAT_CELLS_PROMPT_SAMPLE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and " \
                                 "@AXSubrole='AXDialog']/AXTabGroup/AXGroup/AXStaticText"
    FORMAT_CELLS_PROMPT_CANCEL_BUTTON = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' " \
                                        "and @AXSubrole='AXDialog']/AXButton[@AXTitle='Cancel']"

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
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.EDIT_TAB_FIND).click()
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.EDIT_TAB_FIND_GO_TO).click()

        cell_input = self.get_element_by_xpath(ExcelSheetMacDesktopPage.GO_TO_PROMPT_INPUT)
        Util.pause(0.1)

        cell_input.clear()
        Util.pause(0.1)

        cell_input.send_keys(cell_upper)
        Util.pause(0.1)

        cell_input.send_keys_raw(Keys.ENTER)
        Util.pause(0.1)

    def _get_selected_cell_value(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_TAB).click()
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_TAB_CELLS).click()

        sample_element = self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_CELLS_PROMPT_SAMPLE)

        sample_element_text = sample_element.text.strip()

        result = sample_element_text if len(sample_element_text) > 0 else ''

        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_CELLS_PROMPT_CANCEL_BUTTON).click()

        return result
