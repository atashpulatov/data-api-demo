package desktop.automation.pages.driver.implementation.windows.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.MetricQualificationPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class MetricQualificationPromptPageWindowsMachine extends MetricQualificationPromptPage {

    public MetricQualificationPromptPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    public List<WebElement> getAllMetricSelectionOptions() {
        return machine.driver.findElements(METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTIONS);
    }
}
