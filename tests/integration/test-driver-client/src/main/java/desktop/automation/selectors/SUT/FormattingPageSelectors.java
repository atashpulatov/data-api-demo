package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class FormattingPageSelectors {
    protected static final By CONDITIONAL_FORMATTING_MENU_ELEM;
    protected static final By HIGHLIGHT_CELLS_MENU_ITEM_ELEM;
    protected static final By HIGHLIGHT_SUBRULE_GREATER_THAN_ELEM;
    protected static final By HIGHLIGHT_GREATER_THAN_BOUND_INPUT_ELEM;
    protected static final By GREATER_THAN_RULE_INPUT_ELEM;
    protected static final By CONDITIONAL_FORMATTING_PROMPT_OK_BTN_ELEM;
    protected static final By MANAGE_RULES_MENU_ITEM_ELEM;
    protected static final By MANAGE_RULES_PROMPT_STOP_IF_TRUE_CHECKBOX_ELEM;
    protected static final By MANAGE_RULES_PROMPT_OK_BTN;
    protected static final By TABLE_STYLE_CONTAINER_ELEM;
    protected static final String TABLE_STYLE_ELEM_BASE;
    protected static final By TABLE_STYLE_ONE_ELEM;
    protected static final By CENTER_ALIGN_TEXT_ELEM;

    static {
        switch (DESIRED_DRIVER_TYPE) {
            case MAC_DESKTOP:
                CONDITIONAL_FORMATTING_MENU_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[4]/AXMenuButton[@AXTitle='Conditional Formatting']");
                HIGHLIGHT_CELLS_MENU_ITEM_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Conditional Formatting']/AXGroup[0]/AXMenuButton[@AXTitle='Highlight Cells Rules']");
                MANAGE_RULES_MENU_ITEM_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Conditional Formatting' and @AXSubrole='AXUnknown']/AXGroup[0]/AXMenuButton[@AXTitle='Manage Rules...']");
                MANAGE_RULES_PROMPT_STOP_IF_TRUE_CHECKBOX_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Manage Rules' and @AXIdentifier='_NS:330' and @AXSubrole='AXDialog']/AXCheckBox[@AXIdentifier='_NS:107']");
                MANAGE_RULES_PROMPT_OK_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Manage Rules' and @AXIdentifier='_NS:330' and @AXSubrole='AXDialog']/AXButton[@AXTitle='OK' and @AXIdentifier='_NS:319']");
                HIGHLIGHT_SUBRULE_GREATER_THAN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Highlight Cells Rules']/AXGroup[0]/AXMenuButton[@AXTitle='Greater Than...']");
                HIGHLIGHT_GREATER_THAN_BOUND_INPUT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='New Formatting Rule' and @AXIdentifier='_NS:1694' and @AXSubrole='AXDialog']/AXTextField[@AXIdentifier='_NS:1258']");
                GREATER_THAN_RULE_INPUT_ELEM = null;
                CONDITIONAL_FORMATTING_PROMPT_OK_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='New Formatting Rule' and @AXIdentifier='_NS:1694' and @AXSubrole='AXDialog']/AXButton[@AXTitle='OK' and @AXIdentifier='_NS:1166']");
                TABLE_STYLE_CONTAINER_ELEM = null;
                TABLE_STYLE_ELEM_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[4]/AXScrollArea[0]/AXRadioButton[%d]";
                TABLE_STYLE_ONE_ELEM = null;
                CENTER_ALIGN_TEXT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[2]/AXCheckBox[@AXTitle='Centre' and @AXSubrole='AXToggle']");
                break;
            case WINDOWS_DESKTOP:
                CONDITIONAL_FORMATTING_MENU_ELEM = By.name("Conditional Formatting");
                HIGHLIGHT_CELLS_MENU_ITEM_ELEM = By.name("Highlight Cells Rules");
                MANAGE_RULES_MENU_ITEM_ELEM = null;
                MANAGE_RULES_PROMPT_STOP_IF_TRUE_CHECKBOX_ELEM = null;
                MANAGE_RULES_PROMPT_OK_BTN = null;
                HIGHLIGHT_SUBRULE_GREATER_THAN_ELEM = By.name("Greater Than...");
                HIGHLIGHT_GREATER_THAN_BOUND_INPUT_ELEM = null;
                GREATER_THAN_RULE_INPUT_ELEM = By.name("Format cells that are GREATER THAN");
                CONDITIONAL_FORMATTING_PROMPT_OK_BTN_ELEM = By.name("OK");
                TABLE_STYLE_CONTAINER_ELEM = By.xpath("//*[@Name='Quick Styles'][@LocalizedControlType='Data Grid']");
                TABLE_STYLE_ELEM_BASE = null;
                TABLE_STYLE_ONE_ELEM = By.xpath("//*[contains(@Name,'Green, Table Style Light')]");//By.name("Light Green, Table Style Light 21");
                CENTER_ALIGN_TEXT_ELEM = By.name("Center");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }

}
