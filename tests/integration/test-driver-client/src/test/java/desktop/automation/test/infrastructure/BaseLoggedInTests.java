package desktop.automation.test.infrastructure;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.driver.wrappers.enums.DriverType;

import java.io.IOException;

import static desktop.automation.ConfigVars.*;
import static desktop.automation.helpers.ImportPrepareDataHelper.initPrepareDataSimpleIndexAndImageBased;

public abstract class BaseLoggedInTests extends BaseCommonTests {

    @Override
    protected void beforeStep() throws IOException {
        getToSUTAndLogIn();
    }

    public static void getToSUTAndLogIn() throws IOException {
        getToSUT();

        if (DESIRED_DRIVER_TYPE.equals(DriverType.BROWSER))
            machine.focusOnAddInFrameForBrowser();

        if (!DESIRED_DRIVER_TYPE.equals(DriverType.BROWSER) || ((Browser)machine).isUserLoggedOut()) {
            machine.getLoginPage().getStartLoginBtnElem().click();

            if (DESIRED_DRIVER_TYPE.equals(DriverType.BROWSER))
                browser.switchToLoginPopUpWindow();

            String usernameStr = EXCEL_ADD_IN_TEST_USER_NAME;
            String passwordStr = EXCEL_ADD_IN_TEST_USER_PASS;
            machine.getLoginPage().getUserNameInputElem().sendKeys(usernameStr);

            if (EXCEL_ADD_IN_TEST_USER_PASS != null && EXCEL_ADD_IN_TEST_USER_PASS.length() > 0)
                machine.getLoginPage().getPasswordInputElem().sendKeys(passwordStr);

            machine.getLoginPage().getLoginBtnElem().click();

            if (DESIRED_DRIVER_TYPE.equals(DriverType.BROWSER)) {
                browser.switchToExcelWorkbookWindow();
            }
        }

        //initialize prepareDataWithoutImportingSimple
        if (DESIRED_DRIVER_TYPE.equals(DriverType.WINDOWS_DESKTOP) && UTILIZE_INDEX_IMAGE_BASED_PREPARE_DATA_HELPER) {
            initPrepareDataSimpleIndexAndImageBased(machine);
        }
    }
}
