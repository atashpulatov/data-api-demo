package desktop.automation.pages.driver.implementation.mac.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.DatePromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class DatePromptPageMacMachine extends DatePromptPage {

    public DatePromptPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    protected List<WebElement> getTimeEditElems() {
        return machine.iterateOverBase(DATE_PROMPT_EDIT_BASE, 1, 4);
    }
}
