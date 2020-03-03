package desktop.automation.pages.driver.implementation.mac.SUT.prompts;

import desktop.automation.driver.wrappers.MacMachine;
import desktop.automation.pages.SUT.prompts.HierarchyPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class HierarchyPromptPageMacMachine extends HierarchyPromptPage {

    public HierarchyPromptPageMacMachine(MacMachine machine) {
        super(machine);
    }

    @Override
    public List<WebElement> getImportObjectElems() {
        return machine.iterateOverBaseUntilExceptionEncountered(HIERARCHY_PROMPT_IMPORT_OBJECT_ELEM_BASE);
    }
}
