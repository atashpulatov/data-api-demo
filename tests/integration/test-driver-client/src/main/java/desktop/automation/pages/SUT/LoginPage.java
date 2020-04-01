package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.LoginPageSelectors;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

public abstract class LoginPage extends LoginPageSelectors {
    protected Machine machine;

    public LoginPage(Machine machine) {
        this.machine = machine;
    }

    public void enterCredentials(String username, String password){
        AnyInterfaceElement usernameInputElem = getUserNameInputElemWebElement();
        usernameInputElem.clear();
        usernameInputElem.sendKeys(username);

        if (password != null && password.length() > 0) {
            WebElement passwordInputElem = getPasswordInputElem();
            passwordInputElem.clear();
            passwordInputElem.sendKeys(password);
        }
    }

    public WebDriverElemWrapper getUserNameInputElemWebElement(){
        return machine.waitAndFindElemWrapper(USERNAME_INPUT_ELEM);
    }

    public AnyInterfaceElement getUserNameInputElem() {
        return machine.waitAndFindElemWrapper(USERNAME_INPUT_ELEM);
    }

    public RemoteWebElement getPasswordInputElem(){
        return machine.waitAndFind(PASSWORD_INPUT_ELEM);
    }

    public WebDriverElemWrapper getLoginBtnElemWebdriverElem(){
        return machine.waitAndFindElemWrapper(LOGIN_BTN_ELEM);
    }

    public AnyInterfaceElement getLoginBtnElem(){
        return machine.waitAndFindElemWrapper(LOGIN_BTN_ELEM);
    }

    public RemoteWebElement getAuthenticationErrorMessageElem(){
        return machine.waitAndFind(AUTH_ERROR_MESSAGE);
    }

    public void assertAuthenticationMessageElemNotPresent(){
        machine.assertNotPresent(AUTH_ERROR_MESSAGE);
    }

    public abstract AnyInterfaceElement getStartLoginBtnElem();

    public WebDriverElemWrapper getStartLoginBtnWebDriverElem() {
        WebDriverElemWrapper res = machine.waitAndFindElemWrapper(OPEN_LOGIN_PROMPT_BTN_ELEM, machine.FOUR_UNITS);

        return res;
    }

    public WebElement findStartLoginBtn(){
        return machine.driver.findElement(OPEN_LOGIN_PROMPT_BTN_ELEM);
    }

    public WebElement getOKBtnElem(){
        return machine.waitAndFind(OK_BTN_ELEM);
    }

    public abstract boolean isLoginBtnEnabled();

    public abstract void assertUserNameValueAsExpected(String expected);
}