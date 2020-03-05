package desktop.automation.pages.driver.implementation.windows.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.DatePromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class DatePromptPageWindowsMachine extends DatePromptPage {

    public DatePromptPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    protected List<WebElement> getTimeEditElems() {
        machine.waitAndFind(DATE_PROMPT_TIME_EDIT_ELEMS, machine.SIX_UNITS);

        List<WebElement> res = machine.driver.findElements(DATE_PROMPT_TIME_EDIT_ELEMS);
        res.remove(0);
        return res;
    }
}
