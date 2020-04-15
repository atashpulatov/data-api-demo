package desktop.automation.pages.driver.implementation.browser.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.prompts.HierarchyPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class HierarchyPromptPageBrowser extends HierarchyPromptPage {

    public HierarchyPromptPageBrowser(Machine machine) {
        super(machine);
    }

    @Override
    public List<WebElement> getImportObjectElems() {
        throw new NotImplementedForDriverWrapperException();
    }
}
