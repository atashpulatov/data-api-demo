package desktop.automation.pages.driver.implementation.browser.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.AttributeQualificationPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class AttributeQualificationPromptPageBrowser extends AttributeQualificationPromptPage {

    public AttributeQualificationPromptPageBrowser(Machine machine) {
        super(machine);
    }

    @Override
    public void clickOperatorSelectionOptionByIndex(int index) {
        getOperatorSelectionOptionElems().get(index).click();
    }

    public List<WebElement> getOperatorSelectionOptionElems(){
        machine.focusOnPromptPopUpFrameForBrowser();
        machine.waitAndFind(OPERATOR_SELECTION_OPTIONS, machine.SIX_UNITS);

        return machine.driver.findElements(OPERATOR_SELECTION_OPTIONS);
    }

}
