package desktop.automation.elementWrappers.driver.implementations.browser;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

public class ImportedObjectInListBrowser extends ImportedObjectInList {
    public ImportedObjectInListBrowser(WebDriverElemWrapper mainElem, Machine machine) {
        super(mainElem, machine);
    }

    @Override
    public WebElement getEditBtnElem() {
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return machine.waitAndFindInElement(mainElem.getDriverElement(), IMPORTED_OBJECT_EDIT_ELEM)
                .getDriverElement();
    }

    @Override
    public WebElement getRefreshBtnElem() {
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return machine.waitAndFindInElement(mainElem.getDriverElement(), IMPORTED_OBJECT_REFRESH_ELEM)
                .getDriverElement();
    }

    @Override
    public WebElement getDeleteBtnElem() {
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return machine.waitAndFindInElement(mainElem.getDriverElement(), IMPORTED_OBJECT_DELETE_ELEM)
                .getDriverElement();
    }

    @Override
    protected void renameHelper(String newName) {
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if (newName == null){
            getEditNameElem().sendKeys(Keys.BACK_SPACE);
            try {
                Thread.sleep(1_000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            getEditNameElem().sendKeys(Keys.ENTER);
        }
        else
            getEditNameElem().sendKeys(newName + Keys.ENTER);

        machine.getMainPage().getOfficeAddInLogoElem().click();
    }

    @Override
    public void pasteNameFromClipboard() {
        machine.actions
                .pause(1_000)
                .doubleClick(getNameElem())
                .pause(1_000)
                .perform();

        machine.sendPaste();
        getEditNameElem().sendKeys(Keys.ENTER);
    }

    @Override
    public WebElement getNameElem() {
        return machine.waitAndFindInElement(mainElem.getDriverElement(), IMPORTED_OBJECT_NAME_ELEM)
                .getDriverElement();
    }
}
