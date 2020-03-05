package desktop.automation.pages.driver.implementation.windows.nonSUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.nonSUT.PreSUTPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static desktop.automation.ConfigVars.EXCEL_ADD_IN_NAME_IN_HOME_TAB;

public class PreSUTPageWindowsMachine extends PreSUTPage {
    public PreSUTPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    public WebElement getAddInStartElem() {
        return machine.waitAndFind(By.xpath("//Button[@Name=\"" + EXCEL_ADD_IN_NAME_IN_HOME_TAB + "\"]"));
    }

    @Override
    public WebDriverElemWrapper getSheetTabElemByIndex(int index){
        return machine.waitAndFindElemWrapper(By.name(String.format("Sheet Tab Sheet%d", index)));
    }

    @Override
    public void openFormatCellsPromptPage() {
        getHomeTabElem().click();
        machine.getFormattingPage().getFormatHomeTabElem().click();
        machine.getMainPage().getFormatCellsMenuItemElem().click();
    }
}
