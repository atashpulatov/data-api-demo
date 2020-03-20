package desktop.automation.elementWrappers.driver.implementations.windows;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import io.appium.java_client.windows.WindowsDriver;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

public class ImportedObjectInListWindowsMachine extends ImportedObjectInList {

    public ImportedObjectInListWindowsMachine(WebDriverElemWrapper mainElem, Machine machine) {
        super(mainElem, machine);
    }

    @Override
    public WebElement getNameElem() {
        return mainElem.getDriverElement().findElement(IMPORTED_OBJECT_NAME_ELEM);
    }

    public WebElement getEditBtnElem() {
        return mainElem.getDriverElement().findElement(IMPORTED_OBJECT_EDIT_ELEM);
    }

    public WebElement getRefreshBtnElem() {
        return mainElem.getDriverElement().findElement(IMPORTED_OBJECT_REFRESH_ELEM);
    }

    public WebElement getDeleteBtnElem() {
        return mainElem.getDriverElement().findElement(IMPORTED_OBJECT_DELETE_ELEM);
    }

    @Override
    protected void renameHelper(String newName) {
        WebDriverElemWrapper input = getEditNameElem();
        if (newName != null)
            input.sendKeys(newName);
        input.sendKeys(Keys.ENTER);
    }

    @Override
    public void pasteNameFromClipboard() {
        machine.doubleClickElem(getNameElem());
        ((WindowsDriver) machine.driver).getKeyboard().sendKeys(Keys.chord(Keys.CONTROL + "v"));
        ((WindowsDriver) machine.driver).getKeyboard().sendKeys(Keys.ENTER);
    }
}
