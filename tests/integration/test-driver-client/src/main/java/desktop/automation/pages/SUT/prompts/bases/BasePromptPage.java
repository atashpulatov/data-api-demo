package desktop.automation.pages.SUT.prompts.bases;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.selectors.SUT.prompts.PromptSelectors;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

import java.util.List;

public abstract class BasePromptPage extends PromptSelectors {
    protected Machine machine;

    public BasePromptPage(Machine machine) {
        this.machine = machine;
    }

    public WebElement getRunBtnElem(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        return machine.waitAndFind(RUN_BTN_ELEM, machine.TWO_UNITS);
    }

    public void clickRunBtnAndAssertImportFLow(){
        getRunBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(40);
    }

    public void clickRunBtnAndAssertRefreshFlowSingle(boolean isDataset){
        getRunBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(isDataset, 40);
    }

    public boolean isRunEnabled(){
        return machine.isButtonEnabled(getRunBtnElem());
    }

    public RemoteWebElement getCancelBtnElem(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        return machine.waitAndFind(CANCEL_BTN_ELEM);
    }

    public RemoteWebElement getBackBtnElem(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        return machine.waitAndFind(BACK_BTN_ELEM);
    }

    public boolean isCancelEnabled(){
        return machine.isButtonEnabled(getCancelBtnElem());
    }

    public RemoteWebElement getNumericPromptOutOfRangeMessage(){
        List<WebElement> all = machine.driver.findElements(NUMERIC_OUT_OF_RANGE_MESSAGE_ELEM);

        return (RemoteWebElement) all.get(all.size() - 1);
    }

    public RemoteWebElement getPromptRequiresAnswerMessageElem(){
        List<WebElement> all = machine.driver.findElements(PROMPT_REQUIRES_ANS_MESSAGE_ELEM);

        return (RemoteWebElement) all.get(all.size() - 1);
    }

    abstract public void answerPromptCorretly();
}
