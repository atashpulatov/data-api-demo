package desktop.automation.pages.driver.implementation.browser.SUT.prompts;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.pages.SUT.prompts.DatePromptPage;
import org.openqa.selenium.WebElement;

import java.util.List;

public class DatePromptPageBrowser extends DatePromptPage {


    public DatePromptPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    protected List<WebElement> getTimeEditElems() {
        machine.waitAndFind(DATE_PROMPT_TIME_EDIT_ELEMS);
        return machine.driver.findElements(DATE_PROMPT_TIME_EDIT_ELEMS);
    }
}
