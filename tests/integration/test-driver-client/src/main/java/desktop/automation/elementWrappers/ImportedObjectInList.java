package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.mac.WebElementWithBooleanAXValue;
import desktop.automation.selectors.helper.ImportedObjectInListSelectors;
import org.openqa.selenium.WebElement;

import java.util.List;

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
//        try {
//            Thread.sleep(2_000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//        mainElem.getDriverElement().click();
        return machine.waitAndFindInElement(mainElem.getDriverElement(), IMPORTED_OBJECT_EDIT_NAME_ELEM);
    }

    public WebElement getDateElem() {
        List<WebElement> texts = mainElem.getDriverElement().findElements(IMPORTED_OBJECT_TEXT_ELEMS);
        return texts.get(0);
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
