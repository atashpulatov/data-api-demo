package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptWithSingleSelectionListPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public abstract class HierarchyPromptPage extends BasePromptWithSingleSelectionListPage {

    public HierarchyPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        machine.getHierarchyPromptPage().getAddAllBtnElem().click();
        machine.getHierarchyPromptPage().getRunBtnElem().click();
    }

    public abstract List<WebElement> getImportObjectElems();

    public void assertPromptOpen(){
        machine.focusOnPromptPopUpFrameForBrowser();
        getAddAllBtnElem();
    }

    public void assertPromptNotOpen(){
        boolean isPopPresent = false;
        try {
            machine.focusOnPromptPopUpFrameForBrowser();
            isPopPresent = true;
        }catch (Throwable ignored) {}

        if (isPopPresent)
            machine.assertNotPresent(ADD_ALL_BTN_ELEM);
    }
}
