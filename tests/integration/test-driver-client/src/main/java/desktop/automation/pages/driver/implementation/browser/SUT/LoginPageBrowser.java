package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.LoginPage;

import static junit.framework.TestCase.assertEquals;

public class LoginPageBrowser extends LoginPage {

    public LoginPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    public AnyInterfaceElement getStartLoginBtnElem() {
        machine.focusOnAddInFrameForBrowser();
        return machine.waitAndFindElemWrapper(OPEN_LOGIN_PROMPT_BTN_ELEM, machine.FOUR_UNITS);
    }

    @Override
    public boolean isLoginBtnEnabled() {
        String loginBtnClass = ((WebDriverElemWrapper) getLoginBtnElem()).getDriverElement().getAttribute("class");
        switch (loginBtnClass){
            case "login-button":
                return true;
            case "login-button disabledLogin":
                return false;
            default:
                throw new RuntimeException("Could not assert login button enabled status");
        }
    }

    @Override
    public void assertUserNameValueAsExpected(String expected) {
        assertEquals(expected, getUserNameInputElemWebElement().getDriverElement().getAttribute("value"));
    }
}
