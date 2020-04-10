package desktop.automation.elementWrappers.driver.implementations.mac;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Keyboard;

import java.util.List;

public class ImportedObjectInListMacMachine extends ImportedObjectInList {
    private static final By IMPORTED_OBJECT_TEXT_ELEMS = By.xpath("//AXStaticText");;

    public ImportedObjectInListMacMachine(WebDriverElemWrapper mainElem, Machine machine) {
        super(mainElem, machine);
    }

    @Override
    public WebElement getNameElem() {
        List<WebElement> texts = mainElem.getDriverElement().findElements(IMPORTED_OBJECT_TEXT_ELEMS);
        return texts.get(1);
    }

    private List<WebElement> getImportedObjectInListButtons(){
        return mainElem.getDriverElement().findElements(By.xpath(".//AXButton"));
    }

    //TODO once the duplicate button is implemented add getter and update indexes of other buttons

    public WebElement getEditBtnElem() {
        return getImportedObjectInListButtons().get(0);
    }

    public WebElement getRefreshBtnElem() {
        return getImportedObjectInListButtons().get(1);
    }

    public WebElement getDeleteBtnElem() {
        return getImportedObjectInListButtons().get(2);
    }

    @Override
    public void renameHelper(String newName) {
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        ((AppiumDriver)machine.getDriver()).getKeyboard().sendKeys(newName == null ? Keys.ENTER : newName + Keys.ENTER);
    }

    @Override
    public void pasteNameFromClipboard() {
        machine.doubleClickElem(getNameElem());
        try {
            Thread.sleep(1_000);
            Keyboard keyboard = ((AppiumDriver) machine.driver).getKeyboard();
            keyboard.pressKey(Keys.COMMAND);
            Thread.sleep(500);
            keyboard.sendKeys("v");
            keyboard.releaseKey(Keys.COMMAND + "v");
            Thread.sleep(500);
            keyboard.sendKeys(Keys.ENTER);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }
}
