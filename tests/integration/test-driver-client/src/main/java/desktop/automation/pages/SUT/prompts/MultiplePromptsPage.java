package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.WebElement;

import java.util.List;

public class MultiplePromptsPage extends DatePromptPage{

    public MultiplePromptsPage(Machine machine) {
        super(machine);
    }

    @Override
    public WebElement getDateInputElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(MULTIPLE_PROMPT_DATE_INPUT_ELEM);
    }

    @Override
    public void answerPromptCorrectly() {
        machine.getMultiplePromptsPage().getDateInputElemAndInputDate(2014, 12, 1);

        machine.getDatePromptPage().getRunBtnElem().click();
    }

    @Override
    protected List<WebElement> getTimeEditElems() {
        throw new NotImplementedForDriverWrapperException();
    }

    public WebElement getTextInputElem(){
        return machine.waitAndFind(MULTIPLE_PROMPT_TEXT_INPUT_ELEM);
    }
}
