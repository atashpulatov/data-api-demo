package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.MoreItemMenuPage;

import static junit.framework.TestCase.assertEquals;

public class MoreItemMenuPageBrowser extends MoreItemMenuPage {

    public MoreItemMenuPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    public void assertUserInitialsAndUserName(String expectedUserName, String expectedUserInitials) {
        assertEquals(expectedUserName, getUserNameTextElem().getDriverElement().getText());
        assertEquals(expectedUserInitials, getUserInitialElem().getDriverElement().getText());
    }

    @Override
    public WebDriverElemWrapper getUserInitialElem() {
        machine.focusOnAddInFrameForBrowser();
        return machine.waitAndFindElemWrapper(USER_INITIAL_TEXT_ELEM);
    }

    @Override
    public WebDriverElemWrapper getUserNameTextElem() {
        machine.focusOnAddInFrameForBrowser();
        return machine.waitAndFindElemWrapper(USER_NAME_TEXT_ELEM);
    }

    @Override
    public void assertEmailClientCalled() {
        throw new NotImplementedForDriverWrapperException();
    }
}
