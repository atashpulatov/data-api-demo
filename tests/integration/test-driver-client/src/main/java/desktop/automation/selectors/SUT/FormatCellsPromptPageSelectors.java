package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class FormatCellsPromptPageSelectors {
    protected static final By FORMAT_CELLS_BORDER_TAB_ELEM;
    protected static final By FORMAT_CELLS_BORDER_OUTLINE_BTN;
    protected static final By FORMAT_CELLS_FONT_TAB_ELEM;
    protected static final By FORMAT_CELLS_FONT_INPUT;
    protected static final By FORMAT_CELLS_FILL_TAB_ELEM;

    static {
        switch (DESIRED_DRIVER_TYPE) {
            case MAC_DESKTOP:
                FORMAT_CELLS_BORDER_TAB_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXTabGroup[@AXIdentifier='_NS:18']/AXRadioButton[@AXTitle='Border' and @AXSubrole='AXTabButton']");
                FORMAT_CELLS_BORDER_OUTLINE_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXTabGroup[@AXIdentifier='_NS:18']/AXGroup[@AXIdentifier='_NS:1107']/AXButton[@AXIdentifier='_NS:1141']");
                FORMAT_CELLS_FONT_TAB_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXTabGroup[@AXIdentifier='_NS:18']/AXRadioButton[@AXTitle='Font' and @AXSubrole='AXTabButton']");
                FORMAT_CELLS_FONT_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXTabGroup[@AXIdentifier='_NS:18']/AXTextField[@AXIdentifier='_NS:753']");
                FORMAT_CELLS_FILL_TAB_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXTabGroup[@AXIdentifier='_NS:18']/AXRadioButton[@AXTitle='Fill' and @AXSubrole='AXTabButton']");
                break;
            case WINDOWS_DESKTOP:
                FORMAT_CELLS_BORDER_TAB_ELEM = By.name("Border");
                FORMAT_CELLS_BORDER_OUTLINE_BTN = By.xpath("//*[@LocalizedControlType='button'][@Name='Outline']");
                FORMAT_CELLS_FONT_TAB_ELEM = null;
                FORMAT_CELLS_FONT_INPUT = null;
                FORMAT_CELLS_FILL_TAB_ELEM = By.name("Fill");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
