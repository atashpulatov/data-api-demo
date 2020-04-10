package desktop.automation.pages.driver.implementation.windows.SUT.prompts;

import desktop.automation.driver.wrappers.WindowsMachine;
import desktop.automation.pages.SUT.prompts.HierarchyPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class HierarchyPromptPageWindowsMachine extends HierarchyPromptPage {

    public HierarchyPromptPageWindowsMachine(WindowsMachine machine) {
        super(machine);
    }

    @Override
    public List<WebElement> getImportObjectElems() {
        return machine.driver.findElements(HIERARCHY_PROMPT_IMPORT_OBJECT_ELEMS);
    }
}
