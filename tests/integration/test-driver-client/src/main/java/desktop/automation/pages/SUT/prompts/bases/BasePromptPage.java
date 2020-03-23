package desktop.automation.pages.SUT.prompts.bases;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.prompts.PromptSelectors;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

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
        clickRunBtnAndAssertImportFLow(40);
    }

    public void clickRunBtnAndAssertImportFLow(int importTimeout){
        getRunBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(importTimeout);
    }

    public void clickRunBtnAndAssertRefreshFlowSingle(boolean isDataset){
        clickRunBtnAndAssertRefreshFlowSingle(isDataset, 40);
    }

    public void clickRunBtnAndAssertRefreshFlowSingle(boolean isDataset, int refreshTimeout){
        getRunBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(isDataset, refreshTimeout);
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

    public WebDriverElemWrapper getNumericPromptOutOfRangeMessage(){
        return machine.waitAndFindElemWrapper(NUMERIC_OUT_OF_RANGE_MESSAGE_ELEM);
    }

    public WebDriverElemWrapper getPromptRequiresAnswerMessageElem(){
        return machine.waitAndFindElemWrapper(PROMPT_REQUIRES_ANS_MESSAGE_ELEM);
    }

    abstract public void answerPromptCorrectly();
}
