package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public abstract class AttributeQualificationPromptPage extends BasePromptPage {
    //TODO implement
    private static final By QUALIFY_BTN = By.xpath("//Group[@Name='Qualify']");
    //TODO implement
    private static final By SELECT_BTN = By.xpath("//Group[@Name='Select']");

    public AttributeQualificationPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        machine.getAttributeQualificationPromptPage().getOperatorSelectionDropDownElem().click();
        machine.getAttributeQualificationPromptPage().clickOperatorSelectionOptionByIndex(3);

        machine.getAttributeQualificationPromptPage().getValueInputElem().sendKeys("2015");

        machine.getAttributeQualificationPromptPage().getRunBtnElem().click();
    }

    public WebElement getAttributeSelectionDropDownElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(ATTRIBUTE_SELECTION_DROP_DOWN, machine.SIX_UNITS);
    }

    public List<WebElement> getAttributeSelectionOptionElems(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.driver.findElements(ATTRIBUTE_SELECTION_OPTIONS);
    }

    public WebElement getQualifyBtnElem(){
        return machine.waitAndFind(QUALIFY_BTN);
    }

    public WebElement getSelectBtn(){
        return machine.waitAndFind(SELECT_BTN);
    }

    public WebElement getOperatorSelectionDropDownElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(OPERATOR_SELECTION_DROP_DOWN);
    }

    public abstract void clickOperatorSelectionOptionByIndex(int index);

    public WebElement getValueInputElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(ATTRIBUTE_QUALIFICATION_PROMPT_VALUE_INPUT);
    }
}
