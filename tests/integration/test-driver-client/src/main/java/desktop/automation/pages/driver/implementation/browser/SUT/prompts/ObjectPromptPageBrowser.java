package desktop.automation.pages.driver.implementation.browser.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.ObjectPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class ObjectPromptPageBrowser extends ObjectPromptPage {

    public ObjectPromptPageBrowser(Machine machine) {
        super(machine);
    }

    @Override
    public List<WebElement> getImportObjectElems() {
        machine.focusOnPromptPopUpFrameForBrowser();
        machine.waitAndFind(OBJECT_PROMPT_IMPORT_OBJECT_ELEMS, machine.TWO_UNITS);

        return machine.driver.findElements(OBJECT_PROMPT_IMPORT_OBJECT_ELEMS);

    }
}
