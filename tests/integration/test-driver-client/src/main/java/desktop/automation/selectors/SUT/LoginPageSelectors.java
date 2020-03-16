package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class LoginPageSelectors {
    protected static final By AUTH_ERROR_MESSAGE;
    protected static final By OK_BTN_ELEM;
    protected static final By USERNAME_INPUT_ELEM;
    protected static final By PASSWORD_INPUT_ELEM;
    protected static final By LOGIN_BTN_ELEM;
    protected static final By OPEN_LOGIN_PROMPT_BTN_ELEM;
    protected static final String START_LOGIN_BTN_IMAGE;
    protected static final String USERNAME_INPUT_IMAGE;
    protected static final String LOGIN_BTN_IMAGE;

    static{
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                OPEN_LOGIN_PROMPT_BTN_ELEM = By.id("login-btn");
                AUTH_ERROR_MESSAGE = By.xpath("//span[text()=\"Incorrect username and/or password. Please try again.\"]");
                OK_BTN_ELEM = By.id("ActionLinkContainer");
                USERNAME_INPUT_ELEM = By.id("username");
                PASSWORD_INPUT_ELEM = By.id("password");
                LOGIN_BTN_ELEM = By.id("loginButton");
                START_LOGIN_BTN_IMAGE = null;
                USERNAME_INPUT_IMAGE = null;
                LOGIN_BTN_IMAGE = null;
                break;
            case MAC_DESKTOP:
                //TODO
                AUTH_ERROR_MESSAGE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='MessageBoxContainer' and @AXSubrole='AXApplicationDialog']/AXGroup[@AXSubrole='AXDocument']/AXGroup[1]/AXStaticText");
                OK_BTN_ELEM = By.xpath(
//                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Office Add-ins - env-175469.customer.cloud.microstrategy.com' and @AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='MessageBoxContainer' and @AXSubrole='AXApplicationDialog']/AXButton[@AXTitle='OK' and @AXDOMIdentifier='ActionLinkContainer']"
                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='MessageBoxContainer' and @AXSubrole='AXApplicationDialog']/AXButton[@AXTitle='OK' and @AXDOMIdentifier='ActionLinkContainer']"
                );
                USERNAME_INPUT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkMain']/AXGroup[1]/AXTextField[@AXDOMIdentifier='username']");
                PASSWORD_INPUT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkMain']/AXGroup[1]/AXTextField[@AXDOMIdentifier='password' and @AXSubrole='AXSecureTextField']");
                LOGIN_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkMain']/AXGroup[1]/AXButton[@AXDOMIdentifier='loginButton']");
                OPEN_LOGIN_PROMPT_BTN_ELEM = By.xpath(
                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXButton[@AXDOMIdentifier='login-btn']"
//                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXButton[@AXDOMIdentifier='login-btn']"
                );
                START_LOGIN_BTN_IMAGE = "Not utilized";
                USERNAME_INPUT_IMAGE = "Not utilized";
                LOGIN_BTN_IMAGE = "Not utilized";
                break;
            case WINDOWS_DESKTOP:
                AUTH_ERROR_MESSAGE = By.name("Incorrect username and/or password. Please try again.");
                OK_BTN_ELEM = By.name("OK");
                USERNAME_INPUT_ELEM = MobileBy.AccessibilityId("username");
                PASSWORD_INPUT_ELEM = MobileBy.AccessibilityId("password");
                LOGIN_BTN_ELEM = MobileBy.AccessibilityId("loginButton");
                OPEN_LOGIN_PROMPT_BTN_ELEM = MobileBy.AccessibilityId("login-btn");
                START_LOGIN_BTN_IMAGE = "loginPage/startLoginBtnElem";
                USERNAME_INPUT_IMAGE = "loginPage/userNameInput";
                LOGIN_BTN_IMAGE = "loginPage/loginBtn";
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
