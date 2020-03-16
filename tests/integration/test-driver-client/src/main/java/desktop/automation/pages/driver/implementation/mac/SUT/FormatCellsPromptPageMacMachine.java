package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.driver.implementations.windows.FillColor;
import desktop.automation.pages.SUT.FormatCellsPromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static junit.framework.TestCase.assertEquals;

public class FormatCellsPromptPageMacMachine extends FormatCellsPromptPage {
    private static final String FILL_VALUE_BTN_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXTabGroup[@AXIdentifier='_NS:18']/AXGroup[@AXIdentifier='_NS:1427']/AXMenuButton[@AXIdentifier='_NS:1437']/AXMenu[0]/AXMenuItem[0]/AXGroup[0]/AXRadioButton[%d]";
    private static final By FILL_VALUE_MENU_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXTabGroup[@AXIdentifier='_NS:18']/AXGroup[@AXIdentifier='_NS:1427']/AXMenuButton[@AXIdentifier='_NS:1437']");

    private static final String[] OUTLINE_BORDER_SELECTED_IMAGES = {"formatCellsPromptPage/borderAssertion1", "formatCellsPromptPage/borderAssertion2"};

    public FormatCellsPromptPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public void assertFillValueSelected(FillColor color) {
        assertEquals("1", machine.getFormatCellsPromptPage().getFillValueElem(color).getAttribute("AXValue"));
    }

    @Override
    public WebElement getFillValueElem(FillColor color) {
        getFillValueMenuBtnElem().click();
        String selector = String.format(FILL_VALUE_BTN_BASE, color.getMacIndex());
        return machine.waitAndFind(By.xpath(selector));
    }

    @Override
    public void assertBorderOutlineIsSelected() {
        getBorderOutlineSelctedImageElem();
    }

    public ImageComparisonElem getBorderOutlineSelctedImageElem(){
        return new ImageComparisonElem(OUTLINE_BORDER_SELECTED_IMAGES,  1770, 2120, 640, 950);
    }

    public WebDriverElemWrapper getFillValueMenuBtnElem(){
        return machine.waitAndFindElemWrapper(FILL_VALUE_MENU_BTN);
    }
}
