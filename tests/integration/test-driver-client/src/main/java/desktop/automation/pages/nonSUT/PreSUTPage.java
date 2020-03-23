package desktop.automation.pages.nonSUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.nonSUT.PreSUTPageSelectors;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

public abstract class PreSUTPage extends PreSUTPageSelectors {
    protected Machine machine;

    public PreSUTPage(Machine machine) {
        this.machine = machine;
    }

    public RemoteWebElement getBlankSheetElem(){
        return machine.waitAndFind(BLANK_SHEET_ELEM);
    }

    public WebDriverElemWrapper getBlankSheetElemAndTakeScreenshot() {
        return machine.takeElementScreenshotWithDetailsAndReturnElem(getBlankSheetElem(), BLANK_SHEET_IMAGE);
    }

    public ImageComparisonElem getBlankSheetImageBasedElem() {
        return new ImageComparisonElem(BLANK_SHEET_IMAGE, 200, 500, 100, 350);
    }

    public WebDriverElemWrapper getHomeTabElem(){
        machine.focusOnExcelFrameForBrowser();
        return machine.waitAndFindElemWrapper(HOME_TAB_ELEM);
    }

    public RemoteWebElement getInsertTabElem(){
        return machine.waitAndFind(INSERT_TAB_ELEM);
    }

    public RemoteWebElement getMyAddInsElem(){
        return machine.waitAndFind(MY_ADD_INS_ELEM);
    }

    public RemoteWebElement getSharedFolderElem(){
        return machine.waitAndFind(SHARED_FOLDER_ELEM);
    }

    public RemoteWebElement getAddInToLoadElem(){
        return machine.waitAndFind(ADD_IN_TO_LOAD_ELEM);
    }

    public RemoteWebElement getAddAddInBtnElem(){
        return machine.waitAndFind(ADD_ADD_IN_BTN_ELEM);
    }

    public WebElement getAddInStartElem() {
        machine.focusOnExcelFrameForBrowser();
        return machine.waitAndFind(ADDIN, machine.isBrowser() ? machine.FOUR_UNITS : machine.ONE_UNIT);
    }

    public WebDriverElemWrapper getAddInStartElemAndTakeScreenshot() {
        return machine.takeElementScreenshotWithDetailsAndReturnElem(getAddInStartElem(), ADD_IN_START_IMAGE);
    }

    public ImageComparisonElem getAddInStartImageBasedElem(){
        return new ImageComparisonElem(ADD_IN_START_IMAGE, 1650, -1, 50, 200);
    }

    public RemoteWebElement getFileTabElem(){
        return machine.waitAndFind(FILE_TAB_ELEM);
    }

    public RemoteWebElement getNewSubTabElem(){
        return machine.waitAndFind(NEW_TAB_ELEM);
    }

    public RemoteWebElement getOpenSubTabElem() {
        return machine.waitAndFind(OPEN_TAB_ELEM);
    }

    public RemoteWebElement getFileToOpenElem(String name) {
        return machine.waitAndFind(By.name(name));
    }

    public RemoteWebElement getCloseBtnElem(){
        return machine.waitAndFind(CLOSE_BTN_ELEM);
    }

    public RemoteWebElement getDontSaveBtnElem(){
        return machine.waitAndFind(DONT_SAVE_BTN_ELEM);
    }

    public WebDriverElemWrapper getDontSaveBtnElemAndTakeScreenshot() {
        return machine.takeElementScreenshotWithDetailsAndReturnElem(getDontSaveBtnElem(), DONT_SAVE_BTN_IMAGE);
    }

    public ImageComparisonElem getDontSaveBtnImageBasedElem() {
        return new ImageComparisonElem(DONT_SAVE_BTN_IMAGE, 880, 1050, 500, 610);
    }

    public RemoteWebElement getExcelStartElem(int runningWindows){
        String name = runningWindows == 0 ? "Excel" : "Excel - " + runningWindows + " running windows";

        return machine.waitAndFind(By.name(name));
    }

    public ImageComparisonElem getExcelStartImageBasedElem(int runningWindows) {
        return new ImageComparisonElem(String.format(EXCEL_START_IMAGE_BASE, runningWindows), 730, 820, 1000, 1080);
    }

    public abstract WebDriverElemWrapper getSheetTabElemByIndex(int index);

    public WebDriverElemWrapper getAddSheetBtnElem(){
        machine.focusOnExcelFrameForBrowser();
        return machine.waitAndFindElemWrapper(ADD_SHEET_BTN_ELEM);
    }

    public WebElement getSheetDeleteContextMenuElem(){
        return machine.waitAndFind(DELETE_CONTEXT_MENU_ELEM);
    }

    public WebElement getDeleteSheetPromptDeleteBtnElem(){
        return machine.waitAndFind(DELETE_SHEET_PROMPT_DELETE_BTN_ELEM);
    }

    public RemoteWebElement getExcelWindowElem(){
        return machine.waitAndFind(OPEN_EXCEL_ELEM);
    }

    public RemoteWebElement getConnectionElem(){
        return machine.waitAndFind(CONNECTION_ELEM);
    }

    public RemoteWebElement getDisconnectElem(){
        return machine.waitAndFind(DISCONNECT_BTN_ELEM);
    }

    public abstract void openFormatCellsPromptPage();
}
