import re

from selenium.webdriver.common.keys import Keys

from framework.pages_base.base_mac_desktop_page import BaseMacDesktopPage
from framework.util.excel_util import ExcelUtil
from framework.util.util import Util


class ExcelSheetMacDesktopPage(BaseMacDesktopPage):
    EDIT_MENU = BaseMacDesktopPage.EXCEL_MENU_ELEM + "/AXMenuBarItem[@AXTitle='Edit']"

    EDIT_FIND_MENU = EDIT_MENU + "/AXMenu[0]/AXMenuItem[@AXTitle='Find']"
    EDIT_FIND_GO_TO_MENU = EDIT_FIND_MENU + "/AXMenu[0]/AXMenuItem[@AXTitle='Go to...']"

    GO_TO_PROMPT_INPUT = BaseMacDesktopPage.EXCEL_APP_ELEM + "/AXWindow[@AXTitle='Go to']/AXTextField"

    FORMAT_MENU = BaseMacDesktopPage.EXCEL_MENU_ELEM + "/AXMenuBarItem[@AXTitle='Format']"
    FORMAT_CELLS_MENU = FORMAT_MENU + "/AXMenu[0]/AXMenuItem[@AXTitle='Cells...']"

    FORMAT_CELLS_PROMPT_DIALOG = BaseMacDesktopPage.EXCEL_APP_ELEM + "/AXWindow[@AXTitle='Format Cells' " \
                                                                     "and @AXSubrole='AXDialog']"
    FORMAT_CELLS_PROMPT_SAMPLE = FORMAT_CELLS_PROMPT_DIALOG + "/AXTabGroup/AXGroup/AXStaticText"
    FORMAT_CELLS_PROMPT_CANCEL_BUTTON = FORMAT_CELLS_PROMPT_DIALOG + "/AXButton[@AXTitle='Cancel']"

    WORKSHEETS_TABS = BaseMacDesktopPage.EXCEL_APP_ELEM + "/AXWindow[@AXSubrole='AXStandardWindow']/AXSplitGroup[0]/" \
                                                          "AXLayoutArea[@AXTitle='Content Area']/AXButton[%s]"
    WORKSHEET_ITEM_RE = re.compile(r'^sheetTab\d+$')
    ADD_WORKSHEET_BUTTON_ELEM = BaseMacDesktopPage.EXCEL_WINDOW_ELEM + "/AXSplitGroup[0]/" \
                                                                       "AXLayoutArea[@AXTitle='Content Area']/" \
                                                                       "AXButton[@AXIdentifier='addSheetTabButton']"
    IDENTIFIER_ATTRIBUTE = 'AXIdentifier'

    TABLE_HOME_TAB = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXRadioButton[@AXTitle='Home']"
    TABLE_DESIGN_TAB = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + "/AXRadioButton[@AXTitle='Table']"

    EXCEL_WINDOW_TOP_PANE_ELEM = BaseMacDesktopPage.EXCEL_WINDOW_TOP_PART_ELEM + '/AXScrollArea[0]'

    GREEN_TABLE_STYLE = EXCEL_WINDOW_TOP_PANE_ELEM + "/AXGroup[4]/AXScrollArea[0]/AXRadioButton[@AXIdentifier=" \
                                                     "'in_ribbon_gallery_XLGalTableStyles_Control_1_7']"

    EXCEL_WINDOW_TOP_FORMAT_PANE_ELEM = EXCEL_WINDOW_TOP_PANE_ELEM + "/AXGroup[3]"

    PERCENTAGE_BUTTON = EXCEL_WINDOW_TOP_FORMAT_PANE_ELEM + "/AXButton[@AXTitle='Percentage Style']"
    COMMA_STYLE_BUTTON = EXCEL_WINDOW_TOP_FORMAT_PANE_ELEM + "/AXButton[@AXTitle='Comma Style']"

    EXCEL_WINDOW_TOP_ALIGN_PANE_ELEM = EXCEL_WINDOW_TOP_PANE_ELEM + "/AXGroup[2]"

    ALIGN_MIDDLE_BUTTON = EXCEL_WINDOW_TOP_ALIGN_PANE_ELEM + "/AXCheckBox[@AXTitle='Align to Middle']"
    ALIGN_LEFT_BUTTON = EXCEL_WINDOW_TOP_ALIGN_PANE_ELEM + "/AXCheckBox[@AXTitle='Align to Left']"

    EXCEL_WINDOW_TOP_FONT_PANE_ELEM = EXCEL_WINDOW_TOP_PANE_ELEM + "/AXGroup[1]"

    BOLD_BUTTON = EXCEL_WINDOW_TOP_FONT_PANE_ELEM + "/AXCheckBox[@AXTitle='Bold']"
    FONT_COLOR_BUTTON = EXCEL_WINDOW_TOP_FONT_PANE_ELEM + "/AXMenuButton[@AXTitle='Font Colour']"
    FILL_COLOR_BUTTON = EXCEL_WINDOW_TOP_FONT_PANE_ELEM + "/AXMenuButton[@AXTitle='Shading']"
    EXCEL_FONT_NAME_INPUT = EXCEL_WINDOW_TOP_FONT_PANE_ELEM + "/AXComboBox[@AXValue='Calibri (Body)']"

    def get_cells_values(self, cells):
        result = []

        for cell in cells:
            result.append(self._get_cell_value(cell))

        return result

    def _get_cell_value(self, cell):
        self.go_to_cell(cell)

        value = self._get_selected_cell_value()

        return value.strip() if value else value

    def go_to_cell(self, cell):
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

        cell_input.send_keys(Keys.ENTER)
        Util.pause(0.1)

    def _get_selected_cell_value(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_MENU).click()
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_CELLS_MENU).click()

        sample_element = self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_CELLS_PROMPT_SAMPLE)

        sample_element_text = sample_element.text.strip()

        result = sample_element_text if len(sample_element_text) > 0 else ''

        formatted_result = ExcelUtil.format_cell_value(result)

        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FORMAT_CELLS_PROMPT_CANCEL_BUTTON).click()

        return formatted_result

    def get_number_of_worksheets(self):
        tabs_elements = self._get_worksheet_tabs()

        return len(tabs_elements)

    def add_worksheet(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.ADD_WORKSHEET_BUTTON_ELEM).click()

    def _get_worksheet_tabs(self):
        found_elements = []

        all_elements = self.get_elements_by_xpath(ExcelSheetMacDesktopPage.WORKSHEETS_TABS)

        for element in all_elements:
            identifier = element.get_attribute(ExcelSheetMacDesktopPage.IDENTIFIER_ATTRIBUTE)
            if ExcelSheetMacDesktopPage.WORKSHEET_ITEM_RE.search(identifier):
                self.log(identifier)
                found_elements.append(element)

        return found_elements

    def click_table_design_tab(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.TABLE_DESIGN_TAB).click()

    def click_green_table_style(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.GREEN_TABLE_STYLE).click()

    def click_home_tab(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.TABLE_HOME_TAB).click()

    def click_percentage_button(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.PERCENTAGE_BUTTON).click()

    def click_comma_style_button(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.COMMA_STYLE_BUTTON).click()

    def click_align_middle_button(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.ALIGN_MIDDLE_BUTTON).click()

    def click_align_left_button(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.ALIGN_LEFT_BUTTON).click()

    def click_bold_button(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.BOLD_BUTTON).click()

    def click_font_color_button(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FONT_COLOR_BUTTON).click()

    def click_fill_color_button(self):
        self.get_element_by_xpath(ExcelSheetMacDesktopPage.FILL_COLOR_BUTTON).click()

    def change_font_name_of_cell(self, cell_name, font_name):
        self.go_to_cell(cell_name)

        font_name_element = self.get_element_by_xpath(ExcelSheetMacDesktopPage.EXCEL_FONT_NAME_INPUT)

        font_name_element.click(offset_x=20, offset_y=10)

        font_name_element.send_keys(Keys.BACKSPACE)
        font_name_element.send_keys_with_check(font_name)

        self.press_enter()
