package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;

public class StandardPromptPage extends BasePromptPage {
    public StandardPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        throw new RuntimeException("Standard prompt page does not provide an implementation for answer prompt correctly method");
    }
}
