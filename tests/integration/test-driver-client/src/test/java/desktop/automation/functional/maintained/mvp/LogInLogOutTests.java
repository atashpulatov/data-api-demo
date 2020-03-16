package desktop.automation.functional.maintained.mvp;

import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.test.infrastructure.BaseCommonTests;
import org.junit.Test;
import org.openqa.selenium.interactions.Actions;

import java.io.IOException;

import static desktop.automation.ConfigVars.*;
import static junit.framework.TestCase.assertFalse;
import static junit.framework.TestCase.assertTrue;

public class LogInLogOutTests extends BaseCommonTests {

    //TC39214
    @Test
    public void loginPositive() throws InterruptedException, IOException {
        ifLoggedInLogOutForBrowser();

        machine.getLoginPage().getStartLoginBtnElem().click();
        if (machine.isBrowser())
            browser.switchToLoginPopUpWindow();

        assertFalse(machine.getLoginPage().isLoginBtnEnabled());
        machine.getLoginPage().enterCredentials(EXCEL_ADD_IN_TEST_USER_NAME, EXCEL_ADD_IN_TEST_USER_PASS);
        machine.getLoginPage().getLoginBtnElem().click();

        if (machine.isBrowser()) {
            browser.switchToExcelWorkbookWindow();
            machine.focusOnAddInFrameForBrowser();
        }
        else
            Thread.sleep(3_000);

        machine.getMainPage().getMoreItemsMenuElem().click();

        machine.getMoreItemMenuPage().assertUserInitialsAndUserName(EXCEL_ADD_IN_TEST_USER_NAME, EXCEL_ADD_IN_TEST_USER_INITIALS);
    }

    //TC39215
    @Test
    public void loginNegative() throws IOException {
        ifLoggedInLogOutForBrowser();

        machine.getLoginPage().getStartLoginBtnElem().click();
        if (machine.isBrowser())
            browser.switchToLoginPopUpWindow();

        assertFalse(machine.getLoginPage().isLoginBtnEnabled());

        machine.getLoginPage().getUserNameInputElem().sendKeys("wrong");
        machine.getLoginPage().getPasswordInputElem().sendKeys("more wrong");
        machine.getLoginPage().getLoginBtnElem().click();

        machine.getLoginPage().getAuthenticationErrorMessageElem();

        Actions actionBuilder = machine.getDriverType().equals(DriverType.BROWSER) ?
                machine.actions.moveToElement(machine.getLoginPage().getOKBtnElem()) :
                machine.actions.moveToElement(machine.getLoginPage().getOKBtnElem(), 50, 20);
        actionBuilder
                .click()
                .perform();

        machine.getLoginPage().assertAuthenticationMessageElemNotPresent();

        machine.getLoginPage().assertUserNameValueAsExpected("wrong");
        assertTrue(machine.getLoginPage().isLoginBtnEnabled());
        if (machine.isBrowser())
            machine.driver.close();
    }

    //TC39220
    @Test
    public void logOut() throws InterruptedException, IOException {
        ifLoggedInLogOutForBrowser();

        machine.getLoginPage().getStartLoginBtnElem().click();
        if (machine.getDriverType().equals(DriverType.BROWSER))
            browser.switchToLoginPopUpWindow();

        machine.getLoginPage().enterCredentials(EXCEL_ADD_IN_TEST_USER_NAME, EXCEL_ADD_IN_TEST_USER_PASS);
        machine.getLoginPage().getLoginBtnElem().click();

        if (machine.getDriverType().equals(DriverType.BROWSER))
            browser.switchToExcelWorkbookWindow();

        Thread.sleep(3_000);

        machine.getMainPage().getMoreItemsMenuElem().click();
        machine.getMoreItemMenuPage().getLogOutBtnElem().click();

        machine.getLoginPage().getStartLoginBtnElem();
    }

    private void ifLoggedInLogOutForBrowser(){
        //If user logged in then go click more items menu button, click log out. In case log out broken, can quit driver, open new window and call getToSUT method. Ideally delete secure cookie JSESSIONID
        if (machine.isBrowser() && !browser.isUserLoggedOut()) {
            machine.getMainPage().getMoreItemsMenuElem().click();
            machine.getMoreItemMenuPage().getLogOutBtnElem().click();
        }
    }
}
