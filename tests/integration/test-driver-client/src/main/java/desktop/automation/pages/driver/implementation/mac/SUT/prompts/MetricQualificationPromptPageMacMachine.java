package desktop.automation.pages.driver.implementation.mac.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.MetricQualificationPromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class MetricQualificationPromptPageMacMachine extends MetricQualificationPromptPage {

    public MetricQualificationPromptPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public List<WebElement> getAllMetricSelectionOptions() {
        return machine.iterateOverBaseUntilExceptionEncountered(METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTION_BASE);
    }
}
