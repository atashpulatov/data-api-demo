package desktop.automation.pages.driver.implementation.browser.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.MetricQualificationPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class MetricQualificationPromptPageBrowser extends MetricQualificationPromptPage {

    public MetricQualificationPromptPageBrowser(Machine machine) {
        super(machine);
    }

    @Override
    public List<WebElement> getAllMetricSelectionOptions() {
        machine.focusOnPromptPopUpFrameForBrowser();
        machine.waitAndFind(METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTIONS);
        return machine.driver.findElements(METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTIONS);
    }
}
