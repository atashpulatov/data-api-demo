package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public abstract class MetricQualificationPromptPage extends BasePromptPage {

    public MetricQualificationPromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        getMetricSelectionInputDropDownElem().click();

        WebElement element = getMetricSelectionOptionByIndex(1);
        element.click();

        WebElement valueInput = getValueInputElem();
        valueInput.sendKeys("1000");

        getRunBtnElem().click();
    }

    public WebElement getMetricSelectionInputDropDownElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_INPUT_DROP_DOWN, machine.SIX_UNITS);
    }

    public WebElement getMetricSelectionOptionByIndex(int index){
        return getAllMetricSelectionOptions().get(index);
    }

    public abstract List<WebElement> getAllMetricSelectionOptions();

    public WebElement getValueInputElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(METRIC_QUALIFICATION_PROMPT_VALUE_INPUT, machine.SIX_UNITS);
    }
}
