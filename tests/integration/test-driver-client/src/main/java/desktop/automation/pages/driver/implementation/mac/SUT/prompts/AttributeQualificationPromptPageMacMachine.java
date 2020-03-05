package desktop.automation.pages.driver.implementation.mac.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.AttributeQualificationPromptPage;

public class AttributeQualificationPromptPageMacMachine extends AttributeQualificationPromptPage {

    public AttributeQualificationPromptPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public void clickOperatorSelectionOptionByIndex(int index) {
        machine.clickObjectWithOffset(getOperatorSelectionDropDownElem(), -20, 46 + 26 * index);
    }
}
