package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.ImportPromptPage;
import org.openqa.selenium.WebElement;

public class ImportPromptPageBrowser extends ImportPromptPage {

    public ImportPromptPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    protected WebDriverElemWrapper getMyLibrarySwitchElement() {
        return machine.waitAndFindElemWrapper(MY_LIBRARY_SWITCH_ELEM);
    }

    @Override
    public AnyInterfaceElement getSearchBarElem() {
        machine.focusOnImportDataPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(SEARCH_BAR_ELEM);
    }

    @Override
    public String getSearchBarInputText(WebElement searchBarElem) {
        String res = ((WebDriverElemWrapper)getSearchBarElem()).getDriverElement().getAttribute("value");
        return res;
    }

    @Override
    public void clickFirstObjectToImport() {
        WebDriverElemWrapper nameHeaderElem = (WebDriverElemWrapper) machine.getImportPromptPage().getNameHeaderElem();
        machine.actions
                .pause(1_000)
                .moveToElement(nameHeaderElem.getDriverElement(), 100, 50 + 60 * 0)
                .click()
                .perform();
    }

    @Override
    public AnyInterfaceElement getImportBtnElem() {
        machine.focusOnImportDataPopUpFrameForBrowser();
        try {
            Thread.sleep(2_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return machine.waitAndFindElemWrapper(IMPORT_BTN_ELEM);
    }

    @Override
    public WebDriverElemWrapper getPrepareDataBtnElem() {
        machine.focusOnImportDataPopUpFrameForBrowser();
        try {
            Thread.sleep(2_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return machine.waitAndFindElemWrapper(PREPARE_DATA_BTN_ELEM);
    }

    @Override
    public AnyInterfaceElement getNameHeaderElem() {
        return machine.waitAndFindElemWrapper(NAME_HEADER_ELEM);
    }
}
