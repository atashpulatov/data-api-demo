package desktop.automation.pages.driver.implementation.mac.nonSUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.driver.implementation.mac.SUT.MainPageMacMachine;
import desktop.automation.pages.nonSUT.PreSUTPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import static desktop.automation.helpers.Terminal.terminateMacExcelProcess;

public class PreSUTPageMacMachine extends PreSUTPage {
    public PreSUTPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public WebElement getAddInStartElem() {
        return machine.waitAndFind(ADDIN);
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

    public WebElement clickAddInDropDownElem(){
        WebElement dropDown = getAddInSelectionElem();

        machine.actions
                .moveToElement(dropDown, 93, 20)
                .click()
                .perform();

        return dropDown;
    }

    public WebElement getAddInToImportElem(){
        return machine.waitAndFind(ADDIN_TO_IMPORT);
    }

    public WebElement getPasteBtnElem(){
        return machine.waitAndFind(PASTE_BTN, machine.QUARTER_UNIT);
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

    public boolean isExcelProcessRunning(){
        try {
            Process p = Runtime.getRuntime().exec(new String[]{"/bin/sh", "-c", "ps -e | grep Excel | wc -l"});
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line;
            while ((line = br.readLine()) == null) {
                Thread.sleep(500);
            }

            return Integer.parseInt(line.trim()) > 1;
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        throw new RuntimeException("something went wrong");
    }

    public void closeExcel() throws IOException {
        closeExcelByAppium();
    }

    private void closeExcelByAppium(){
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
            } while (isExcelProcessRunning());
        } catch (Exception ignored) {}
    }

    private void closeExcelByTerminal() throws IOException {
        terminateMacExcelProcess();
    }

    public WebElement getEditMenuElem() {
        return machine.waitAndFind(EDIT_MENU);
    }

}
