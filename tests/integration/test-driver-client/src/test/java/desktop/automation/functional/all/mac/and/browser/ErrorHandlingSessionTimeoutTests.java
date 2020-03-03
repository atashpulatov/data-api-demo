package desktop.automation.functional.all.mac.and.browser;

import desktop.automation.elementWrappers.MyLibrarySwitch;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Ignore;
import org.junit.Test;

import java.io.IOException;

@Ignore
public class ErrorHandlingSessionTimeoutTests extends BaseLoggedInTests {
    private int sessionTimeOutSeconds = 300 + 30;

    //TC35428
    @Test
    public void prepareData() throws InterruptedException, IOException {
        String report = ImportPrepareDataHelperArgumments.DEFAULT_REPORT;

        machine.getMainPage().getImportDataBtnElem().click();

        MyLibrarySwitch myLibrarySwitchElem = machine.getImportPromptPage().getMyLibrarySwitchElem();
        if (myLibrarySwitchElem.isOn())
            myLibrarySwitchElem.click();

        machine.getImportPromptPage().getSearchBarElemAndSendKeys(report);
//        machine.getImportPromptPage().getObjectToImportNameCellElem(report).click();
        machine.getImportPromptPage().clickFirstObjectToImport();
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getPrepareDataPromptPage().assertPrepareDataPromptTitlePresent(false, report);
        machine.getPrepareDataPromptPage().clickAttributes(new int[]{1,3});
//        machine.getPrepareDataPromptPage().getAttributeHeader(2, 7);
        machine.getPrepareDataPromptPage().clickMetrics(new int[]{0, 1});
//        machine.getPrepareDataPromptPage().getMetricHeader(2, 2);

        Thread.sleep(sessionTimeOutSeconds * 1000);

        machine.getPrepareDataPromptPage().getImportBtn().click();

        assertSessionExpirationFlow();
    }

    //TC36621
    @Test
    public void smartFolder() throws InterruptedException, IOException {
        String report = ImportPrepareDataHelperArgumments.DEFAULT_REPORT;

        machine.getMainPage().getImportDataBtnElem().click();

        MyLibrarySwitch myLibrarySwitchElem = machine.getImportPromptPage().getMyLibrarySwitchElem();
        if (myLibrarySwitchElem.isOn())
            myLibrarySwitchElem.click();

        machine.getImportPromptPage().getSearchBarElemAndSendKeys(report);
//        machine.getImportPromptPage().getObjectToImportNameCellElem(report).click();
        machine.getImportPromptPage().clickFirstObjectToImport();

        Thread.sleep(sessionTimeOutSeconds * 1000);

        machine.getImportPromptPage().getImportBtnElem().click();

        assertSessionExpirationFlow();
    }

    //TC36672
    @Test
    public void beforeImportPrompt() throws InterruptedException, IOException {
        Thread.sleep(sessionTimeOutSeconds * 1000);

        machine.getMainPage().getImportDataBtnElem().click();

        assertSessionExpirationFlow();
    }

    private void assertSessionExpirationFlow() throws IOException {
        machine.getMainPage().getSessionExpiredNotificationElem();

        machine.getLoginPage().getStartLoginBtnElem();
    }
}
