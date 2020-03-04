package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import org.openqa.selenium.WebElement;

import static junit.framework.TestCase.assertEquals;

public class NumericPromptPage extends BasePromptPage {

    public NumericPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorretly() {
        WebDriverElemWrapper inputElem = machine.getNumericPromptPage().getNumberInputElem();
        assertEquals("2014", inputElem.getText().trim());

        WebElement runBtn = machine.getNumericPromptPage().getRunBtnElem();

        inputElem.getDriverElement().clear();
        inputElem.sendKeys("2015");

        runBtn.click();
    }

    public WebDriverElemWrapper getNumberInputElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(NUMERIC_PROMPT_NUMBER_INPUT);
    }
}
