package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.MyLibrarySwitch;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.ImportPromptPageSelectors;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.text.SimpleDateFormat;

import static junit.framework.TestCase.assertEquals;

public abstract class ImportPromptPage extends ImportPromptPageSelectors {
    protected Machine machine;
    private static final SimpleDateFormat modifiedColFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    protected static final String SEARCH_BAR_IMAGE_1 = "importPromptPage/searchBar1";
    protected static final String SEARCH_BAR_IMAGE_2 = "importPromptPage/searchBar2";

    public ImportPromptPage(Machine machine) {
        this.machine = machine;
    }

    public AnyInterfaceElement getTitleElem(){
        if (machine.isWindowsMachine()) {
            try {
                Thread.sleep(1_000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        WebDriverElemWrapper res = machine.waitAndFindElemWrapper(TITLE, machine.TWO_UNITS);
        if (machine.isBrowser())
            assertEquals("Import Data", res.getDriverElement().getText());

        return res;
    }

    public void assertPromptNotOpen(){
        if (machine.isBrowser()){
            machine.focusOnExcelFrameForBrowser();
            assertEquals(1, machine.driver.findElements(By.cssSelector(".AddinIframe")).size());
        }
        else
            machine.assertNotPresent(TITLE);
    }

    public WebElement getMyLibraryLblElem(){
        return machine.waitAndFind(MY_LIBRARY_LBL_ELEM);
    }

    public MyLibrarySwitch getMyLibrarySwitch(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        WebElement element = getMyLibrarySwitchElement().getDriverElement();

        return MyLibrarySwitch.getSwitch(element, machine.getDriverType());
    }

    protected abstract WebDriverElemWrapper getMyLibrarySwitchElement();

    public WebElement getRefreshBtnElem(){
        return machine.waitAndFind(REFRESH_BTN_ELEM);
    }

    public WebElement getFiltersBtnElem(){
        return machine.waitAndFind(FILTERS_BTN_ELEM);
    }

    public abstract AnyInterfaceElement getSearchBarElem();

    public AnyInterfaceElement getSearchBarElemAndSendKeys(String message){
        AnyInterfaceElement searchBarElem = getSearchBarElem();
        searchBarElem.sendKeys(message);

        return searchBarElem;
    }

    public abstract String getSearchBarInputText(WebElement searchBarElem);

    public abstract void clickFirstObjectToImport();

    //TODO Mac desktop list of objects not interactable due to Accessibility defects were table and rows of table are identified as unknown,
    // after defect fix check by object name instead of coordinates
//    public abstract void clickObjectToImportNameCell(String nameOfObject);

    public abstract AnyInterfaceElement getImportBtnElem();

    public void clickImportDataBtnAndAssertImportFlow(){
        getImportBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(180);
    }

    public void clickImportDataBtnAndAssertRefreshFlowSingle(boolean isDataset){
        getImportBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(isDataset, 180);
    }

    public abstract WebDriverElemWrapper getPrepareDataBtnElem();

    public WebElement getCancelBtnElem(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        return machine.waitAndFind(CANCEL_BTN_ELEM);
    }

    public abstract AnyInterfaceElement getNameHeaderElem();

    public WebElement getOwnerHeaderElem(){
        return machine.waitAndFind(OWNER_HEADER_ELEM);
    }

    public WebElement getApplicationHeaderElem(){
        return machine.waitAndFind(APPLICATION_HEADER_ELEM);
    }

    public WebElement getModifiedHeaderElem(){
        return machine.waitAndFind(MODIFIED_HEADER_ELEM);
    }
}
