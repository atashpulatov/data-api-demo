package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.driver.implementations.mac.WebElementWithBooleanAXValue;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.selectors.helpers.ImportedObjectInListSelectors;
import org.openqa.selenium.WebElement;

import static junit.framework.TestCase.assertEquals;

public abstract class ImportedObjectInList extends ImportedObjectInListSelectors {
    protected WebDriverElemWrapper mainElem;
    protected Machine machine;

    public ImportedObjectInList(WebDriverElemWrapper mainElem, Machine machine) {
        this.mainElem = mainElem;
        this.machine = machine;
    }

    public WebDriverElemWrapper getMainElem() {
        return mainElem;
    }

    public WebElement getIconElem() {
        WebElement objIcon;

        try {
            objIcon = mainElem.getDriverElement().findElement(IMPORTED_REPORT_ICON_ELEM);
        } catch (Exception e) {
            objIcon = mainElem.getDriverElement().findElement(IMPORTED_DATASET_ICON_ELEM);
        }

        return objIcon;
    }

    public abstract WebElement getNameElem();

    public String getName(){
        String res = getNameElem().getText();
        return res;
    }

    public void assertNameIsAsExpected(String expectedName) {
        assertEquals(expectedName, getName());
    }

    public WebDriverElemWrapper getEditNameElem(){
        return machine.waitAndFindInElement(mainElem.getDriverElement(), IMPORTED_OBJECT_EDIT_NAME_ELEM);
    }

    public WebElement getDateElem() {
        throw new NotImplementedForDriverWrapperException();
    }

    public abstract WebElement getEditBtnElem();

    public abstract WebElement getRefreshBtnElem();

    public void clickRefreshBtnAndAssertRefreshFlowSingle(boolean isDataset){
        getRefreshBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(isDataset);
    }

    public abstract WebElement getDeleteBtnElem();

    public WebElementWithBooleanAXValue getRepromptBtnElem() {
        throw new RuntimeException("Deprecated button");
    }

    public void rename(String newName){
        WebElement name = getNameElem();

        if (machine.isWindowsMachine())
            machine.actions
                    .moveToElement(name)
                    .click()
                    .pause(200)
                    .doubleClick()
                    .perform();
        else
            machine.actions
                    .pause(machine.isBrowser() ? 1_000 : 0)
                    .doubleClick(name)
                    .perform();

        renameHelper(newName);
    }

    protected abstract void renameHelper(String newName);

    public abstract void pasteNameFromClipboard();

    public void openContextMenuAndClickCopy(){
        openContextMenu();
        clickCopyContextMenuElem();
    }

    public void openContextMenu(){
        machine.contextClickElem(mainElem.getDriverElement());
    }

    public void clickCopyContextMenuElem(){
        getContextMenuCopyElem().click();
    }

    public WebDriverElemWrapper getContextMenuCopyElem(){
        return machine.waitAndFindElemWrapper(CONTEXT_MENU_COPY_NAME_BTN);
    }
}
