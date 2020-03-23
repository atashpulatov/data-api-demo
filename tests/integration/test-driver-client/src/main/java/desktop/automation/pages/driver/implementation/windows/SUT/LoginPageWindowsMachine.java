package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.pages.SUT.LoginPage;

import static junit.framework.TestCase.assertEquals;

public class LoginPageWindowsMachine extends LoginPage {
    public LoginPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    public AnyInterfaceElement getLoginBtnElem() {
        return machine.getImageComparisonElemFallBackToWebDriver(LOGIN_BTN_ELEM, LOGIN_BTN_IMAGE, 750, 1150, 630, 750);
    }

    @Override
    public AnyInterfaceElement getStartLoginBtnElem() {
        return machine.getImageComparisonElemFallBackToWebDriver(OPEN_LOGIN_PROMPT_BTN_ELEM, START_LOGIN_BTN_IMAGE, 1530, 1820, 630, 750);
    }

    @Override
    public boolean isLoginBtnEnabled() {
        return !"login disabled".equals(getLoginBtnElemWebdriverElem().getDriverElement().getAttribute("Name"));
    }

    @Override
    public void assertUserNameValueAsExpected(String expected) {
        assertEquals(expected, getUserNameInputElemWebElement().getDriverElement().getAttribute("Value.Value"));
    }

    @Override
    public AnyInterfaceElement getUserNameInputElem() {
        return machine.getImageComparisonElemFallBackToWebDriver(USERNAME_INPUT_ELEM, USERNAME_INPUT_IMAGE, 750, 1160, 430, 550);
    }
}
