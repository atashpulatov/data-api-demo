package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.windows.FillColor;
import desktop.automation.pages.SUT.FormatCellsPromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static junit.framework.TestCase.assertTrue;

public class FormatCellsPromptPageWindowsMachine extends FormatCellsPromptPage {

    public FormatCellsPromptPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    public void assertFillValueSelected(FillColor color) {
        assertTrue(machine.getFormatCellsPromptPage().getFillValueElem(color).isSelected());
    }

    @Override
    public WebElement getFillValueElem(FillColor color) {
        return machine.waitAndFind(By.name(color.getWindowsName()));
    }

    @Override
    public void assertBorderOutlineIsSelected() {
        assertTrue(getTopBorderValueElem().isOn());
        assertTrue(getBottomBorderValueElem().isOn());
        assertTrue(getLeftBorderValueElem().isOn());
        assertTrue(getRightBorderValueElem().isOn());

    }
}
