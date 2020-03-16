package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import org.openqa.selenium.WebElement;

public class TextValuePromptPage extends BasePromptPage {
    public TextValuePromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        WebElement runBtn = machine.getTextValuePromptPage().getRunBtnElem();
        runBtn.click();
    }

    public WebDriverElemWrapper getAnswerInputElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(STANDARD_PROMPT_ANSWER_INPUT_ELEM, machine.TWO_UNITS);
    }
}
