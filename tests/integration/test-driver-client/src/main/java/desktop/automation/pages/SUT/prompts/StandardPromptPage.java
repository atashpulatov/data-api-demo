package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class StandardPromptPage extends BasePromptPage {
    protected static final By STANDARD_PROMPT_ANSWER_INPUT_ELEM = MobileBy.AccessibilityId("id_mstr20_txt");

    public StandardPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorretly() {
        throw new RuntimeException("StandardPromptPage is deprecated and should be removed");
    }

    public WebElement getDateInputElem(){
        return machine.waitAndFind(STANDARD_PROMPT_ANSWER_INPUT_ELEM);
    }
}
