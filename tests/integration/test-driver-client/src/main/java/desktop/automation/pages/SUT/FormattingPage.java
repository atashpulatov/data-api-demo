package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ToggleButton;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.FormattingPageSelectors;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public abstract class FormattingPage extends FormattingPageSelectors {
    protected Machine machine;

    public FormattingPage(Machine machine) {
        this.machine = machine;
    }

    public WebElement getConditionalFormattingMenuElem(){
        return machine.waitAndFind(CONDITIONAL_FORMATTING_MENU_ELEM);
    }

    public WebElement getHighlightCellsMenuItemElem(){
        return machine.waitAndFind(HIGHLIGHT_CELLS_MENU_ITEM_ELEM);
    }

    public WebDriverElemWrapper getManageRulesMenuItemElem() {
        return machine.waitAndFindElemWrapper(MANAGE_RULES_MENU_ITEM_ELEM);
    }

    public WebDriverElemWrapper getManageRulesPromptStopIfTrueCheckboxElem() {
        return machine.waitAndFindElemWrapper(MANAGE_RULES_PROMPT_STOP_IF_TRUE_CHECKBOX_ELEM);
    }

    public WebDriverElemWrapper getManageRulesPropmtOKBtnElem(){
        return machine.waitAndFindElemWrapper(MANAGE_RULES_PROMPT_OK_BTN);
    }

    public WebElement getHighlightSubruleGreaterThanElem(){
        return machine.waitAndFind(HIGHLIGHT_SUBRULE_GREATER_THAN_ELEM);
    }

    public WebDriverElemWrapper getHighlightGreaterThanBoundInputElem(){
        return machine.waitAndFindElemWrapper(HIGHLIGHT_GREATER_THAN_BOUND_INPUT_ELEM);
    }

    public WebElement getGreaterThanRuleInputElem(){
        return machine.waitAndFind(GREATER_THAN_RULE_INPUT_ELEM);
    }

    public WebElement getConditionalFormattingPromptOKBtnElem(){
        return machine.waitAndFind(CONDITIONAL_FORMATTING_PROMPT_OK_BTN_ELEM);
    }

    public abstract WebDriverElemWrapper getFirstTableStyleElem();

    public abstract boolean isTableStyleElemSelected(WebDriverElemWrapper tableStyleElem);

    public ToggleButton getCenterAlignElem(){
        return ToggleButton.getToggleButton(machine.getDriverType(), machine.waitAndFindElemWrapper(CENTER_ALIGN_TEXT_ELEM));
    }

    public WebElement getFormatHomeTabElem(){
        WebElement homeGroupElem = machine.waitAndFind(By.xpath("//Group[@Name=\"Home\"]"));

        return homeGroupElem.findElement(By.xpath(".//*[@Name='Format']"));
    }
}
