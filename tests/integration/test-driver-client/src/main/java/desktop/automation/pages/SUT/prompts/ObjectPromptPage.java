package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptWithSingleSelectionListPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public abstract class ObjectPromptPage extends BasePromptWithSingleSelectionListPage {
    public ObjectPromptPage(Machine machine) {
        super(machine);
    }


    @Override
    public void answerPromptCorrectly() {
        WebElement runBtn = machine.getObjectPromptPage().getRunBtnElem();

        machine.getObjectPromptPage().getAddAllBtnElem().click();
        runBtn.click();

    }

    public abstract List<WebElement> getImportObjectElems();
}
