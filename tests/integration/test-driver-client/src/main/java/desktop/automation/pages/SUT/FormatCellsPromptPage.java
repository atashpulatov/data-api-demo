package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ToggleButton;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.windows.FillColor;
import desktop.automation.selectors.SUT.FormatCellsPromptPageSelectors;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public abstract class FormatCellsPromptPage extends FormatCellsPromptPageSelectors {
    protected Machine machine;

    public FormatCellsPromptPage(Machine machine) {
        this.machine = machine;
    }

    public WebElement getFormatCellsBorderTabElem() {
        return machine.waitAndFind(FORMAT_CELLS_BORDER_TAB_ELEM);
    }

    public WebDriverElemWrapper getFormatCellsFontTabElem(){
        return machine.waitAndFindElemWrapper(FORMAT_CELLS_FONT_TAB_ELEM);
    }

    public WebDriverElemWrapper getFormatCellsFontInputElem(){
        return machine.waitAndFindElemWrapper(FORMAT_CELLS_FONT_INPUT);
    }

    public WebElement getFormatCellsFillTabElem() {
        return machine.waitAndFind(FORMAT_CELLS_FILL_TAB_ELEM);
    }

    public WebElement getOutlineBorderValueElem(){
        return machine.waitAndFind(FORMAT_CELLS_BORDER_OUTLINE_BTN);
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

    public abstract void assertFillValueSelected(FillColor color);

    public abstract WebElement getFillValueElem(FillColor color);

    public abstract void assertBorderOutlineIsSelected();

    public WebElement getOKButtonElem(){
        return machine.waitAndFind(By.name("OK"));
    }
}
