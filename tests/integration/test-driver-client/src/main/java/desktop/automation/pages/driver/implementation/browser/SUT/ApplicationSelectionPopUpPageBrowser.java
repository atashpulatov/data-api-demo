package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.ApplicationSelectionPopUpPage;

import java.util.List;

public class ApplicationSelectionPopUpPageBrowser extends ApplicationSelectionPopUpPage {

    public ApplicationSelectionPopUpPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    public List<String> getListOfApplicationNames() {
        throw new NotImplementedForDriverWrapperException();
    }
}
