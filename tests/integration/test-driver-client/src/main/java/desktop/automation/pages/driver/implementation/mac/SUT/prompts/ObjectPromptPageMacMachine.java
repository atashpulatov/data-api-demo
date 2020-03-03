package desktop.automation.pages.driver.implementation.mac.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.ObjectPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class ObjectPromptPageMacMachine extends ObjectPromptPage {

    public ObjectPromptPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public List<WebElement> getImportObjectElems() {
        return machine.iterateOverBaseUntilExceptionEncountered(OBJECT_PROMPT_IMPORT_OBJECT_ELEM_BASE);
    }
}
