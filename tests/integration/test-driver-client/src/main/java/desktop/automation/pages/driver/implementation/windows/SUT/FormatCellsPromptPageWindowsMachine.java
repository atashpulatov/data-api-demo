package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ToggleButton;
import desktop.automation.elementWrappers.driver.implementations.windows.FillColor;
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

    public ToggleButton getTopBorderValueElem(){
        return ToggleButton.getToggleButton(machine.getDriverType(), machine.waitAndFindElemWrapper(By.name("Top")));
    }

    public ToggleButton getBottomBorderValueElem(){
        return ToggleButton.getToggleButton(machine.getDriverType(), machine.waitAndFindElemWrapper(By.name("Bottom")));
    }

    public ToggleButton getLeftBorderValueElem(){
        return ToggleButton.getToggleButton(machine.getDriverType(), machine.waitAndFindElemWrapper(By.name("Left")));
    }

    public ToggleButton getRightBorderValueElem(){
        return ToggleButton.getToggleButton(machine.getDriverType(), machine.waitAndFindElemWrapper(By.name("Right")));
    }

}
