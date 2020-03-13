package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.LoginPageSelectors;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

import java.io.IOException;

public abstract class LoginPage extends LoginPageSelectors {
    protected Machine machine;

    public LoginPage(Machine machine) {
        this.machine = machine;
    }

    public void enterCredentials(String username, String password){
        WebDriverElemWrapper usernameInputElem = getUserNameInputElem();
        usernameInputElem.clear();
        usernameInputElem.sendKeys(username);

        if (password != null && password.length() > 0) {
            WebElement passwordInputElem = getPasswordInputElem();
            passwordInputElem.clear();
            passwordInputElem.sendKeys(password);
        }
    }

    public WebDriverElemWrapper getUserNameInputElem(){
        return machine.waitAndFindElemWrapper(USERNAME_INPUT_ELEM);
    }

//    public WebElement getUserNameInputElemAndTakeScreenshot() throws IOException {
//        return machine.takeElementScreenshotWithDetailsAndReturnElem(getUserNameInputElem(), USERNAME_INPUT_IMAGE);
//    }

    public ImageComparisonElem getUsernameInputImageBasedElem(){
        return new ImageComparisonElem(USERNAME_INPUT_IMAGE, 750, 1160, 430, 550,
                10_000, 10);
    }

    public RemoteWebElement getPasswordInputElem(){
        return machine.waitAndFind(PASSWORD_INPUT_ELEM);
    }


    public WebDriverElemWrapper getLoginBtnElemWebdriverElem(){
        return machine.waitAndFindElemWrapper(LOGIN_BTN_ELEM);
    }

    public abstract AnyInterfaceElement getLoginBtnElem() throws IOException;

    public WebDriverElemWrapper getLoginBtnElemAndTakeScreenshot() throws IOException {
        return machine.takeElementScreenshotWithDetailsAndReturnElem(getLoginBtnElemWebdriverElem().getDriverElement(), LOGIN_BTN_IMAGE);
    }

    public ImageComparisonElem getLoginBtnImageBasedElem(){
        return new ImageComparisonElem(LOGIN_BTN_IMAGE, 750, 1150, 630, 750);
    }

    public RemoteWebElement getAuthenticationErrorMessageElem(){
        return machine.waitAndFind(AUTH_ERROR_MESSAGE);
    }

    public void assertAuthenticationMessageElemNotPresent(){
        machine.assertNotPresent(AUTH_ERROR_MESSAGE);
    }

    public abstract AnyInterfaceElement getStartLoginBtnElem() throws IOException;

    public WebDriverElemWrapper getStartLoginBtnWebDriverElem() {
        WebDriverElemWrapper res = machine.waitAndFindElemWrapper(OPEN_LOGIN_PROMPT_BTN_ELEM, machine.FOUR_UNITS);

        return res;
    }

    public WebElement findStartLoginBtn(){
        return machine.driver.findElement(OPEN_LOGIN_PROMPT_BTN_ELEM);
    }

    public WebDriverElemWrapper getStartLoginBtnElemAndTakeScreenshot() throws IOException {
        WebDriverElemWrapper res = getStartLoginBtnWebDriverElem();

        machine.takeElementScreenshotWithDetails(res.getDriverElement(), START_LOGIN_BTN_IMAGE);

        return res;
    }

    public ImageComparisonElem getStartLoginBtnImageBasedElem(){
        return new ImageComparisonElem(START_LOGIN_BTN_IMAGE, 1530, 1820, 630, 750);
    }

    public RemoteWebElement getOKBtnElem(){
        return machine.waitAndFind(OK_BTN_ELEM);
    }

    public abstract boolean isLoginBtnEnabled();
    public abstract void assertUserNameValueAsExpected(String expected);
}