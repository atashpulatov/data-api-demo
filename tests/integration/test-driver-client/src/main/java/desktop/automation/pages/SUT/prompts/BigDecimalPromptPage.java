package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import org.openqa.selenium.WebElement;

public class BigDecimalPromptPage extends BasePromptPage {
    public BigDecimalPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        WebElement runBtn = machine.getBigDecimalPromptPage().getRunBtnElem();

        WebElement inputElem = machine.getBigDecimalPromptPage().getAnswerInputElem();
        inputElem.clear();
        inputElem.sendKeys("1820");

        runBtn.click();
    }

    public WebElement getAnswerInputElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(BIG_DECIMAL_PROMPT_ANSWER_INPUT);
    }
}
