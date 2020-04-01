package desktop.automation.pages.driver.implementation.mac.nonSUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.helpers.mac.Terminal;
import desktop.automation.pages.driver.implementation.mac.SUT.MainPageMacMachine;
import desktop.automation.pages.nonSUT.PreSUTPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.io.IOException;

import static desktop.automation.helpers.mac.Terminal.terminateMacExcelProcess;

public class PreSUTPageMacMachine extends PreSUTPage {
    public PreSUTPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public WebDriverElemWrapper getSheetTabElemByIndex(int index) {
        String locator = String.format(SHEET_BTN_BASE_BY_INDEX, index);
        return machine.waitAndFindElemWrapper(By.xpath(locator));
    }

    @Override
    public void openFormatCellsPromptPage() {
        ((MainPageMacMachine)machine.getMainPage()).getFormatTabElem().click();
        ((MainPageMacMachine)machine.getMainPage()).getFormatTabCellsElem().click();
    }


    public WebElement getAddInSelectionElem(){
        return machine.waitAndFind(ADDIN_DROP_DOWN);
    }

    public void clickAddInDropDownElem(){
        WebElement dropDown = getAddInSelectionElem();

        machine.actions
                .moveToElement(dropDown, 93, 20)
                .click()
                .perform();
    }

    public WebElement getAddInToImportElem(){
        return machine.waitAndFind(ADDIN_TO_IMPORT);
    }

    public void getPasteBtnElem(){
        machine.waitAndFind(PASTE_BTN, machine.QUARTER_UNIT);
    }

    public void refocusOnHomeTab(){
        try {
            getPasteBtnElem();
        } catch (Exception e) {
            getHomeTabElem().click();
        }
    }

    public WebElement getExcelInDockElem(){
        return machine.waitAndFind(EXCEL_IN_DOCK);
    }

    public WebElement getContextMenuQuitBtnElem(){
        return machine.waitAndFind(CONTEXT_MENU_QUIT_BTN, machine.QUARTER_UNIT);
    }

    public void closeExcel() {
        closeExcelByAppiumDriver();
    }

    private void closeExcelByAppiumDriver(){
        machine.actions
                .moveToElement(getExcelInDockElem())
                .contextClick()
                .perform();

        try {
            do {
                getContextMenuQuitBtnElem().click();
                try {
                    getDontSaveBtnElem().click();
                } catch (Exception ignored) {
                }
            } while (Terminal.isExcelProcessRunning());
        } catch (Exception ignored) {}
    }

    private void closeExcelByTerminal() throws IOException {
        terminateMacExcelProcess();
    }

    public WebElement getEditMenuElem() {
        return machine.waitAndFind(EDIT_MENU);
    }

}
