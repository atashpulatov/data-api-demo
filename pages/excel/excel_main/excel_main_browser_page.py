from pages.base_browser_page import BasePage
from util.util import Util


class ExcelMainBrowserPage(BasePage):
    NEW_BLANK_WORKBOOK_ELEM = '''[title^='New blank workbook']'''

    is_first_test_case = True

    def open_new_work_book(self):
        # TODO in java second attempt after 20s
        # On Google Chrome the command driver.switchTo().defaultContent() can perpetuate with default PageLoadStrategy
        # there PageLoadStrategy is set to PageLoadStrategy.NONE
        # however due to this when loading the workbook clicking the "New blank workbook" GUI node
        # can misdirect often to one drive instead of new workboo since the pages only needs to load on the first run
        # the below sleep does not introduce significant overhead in a longer test run
        # possible to change by 1)going through the menu in the top left corner,
        # 2) changing selector, 3) or waiting for different element to load
        # try {
        #     if (firstTC) {
        #         pause(1_000);
        #     }

        #     clientApplicationStartClosePage.getNewBlankWorkbookElem().click();
        # } catch (org.openqa.selenium.TimeoutException e) {
        #     getMachine().getDriver().navigate().refresh();
        #     pause(20_000);
        #     clientApplicationStartClosePage.getNewBlankWorkbookElem().click();
        # }

        # firstTC = false;

        if ExcelMainBrowserPage.is_first_test_case:
            Util.pause(7)

        self.click_element_by_css(ExcelMainBrowserPage.NEW_BLANK_WORKBOOK_ELEM)

        ExcelMainBrowserPage.is_first_test_case = False
