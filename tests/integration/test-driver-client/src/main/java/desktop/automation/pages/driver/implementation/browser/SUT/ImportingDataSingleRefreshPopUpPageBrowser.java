package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.refresh.popups.ImportingDataSingleRefreshPopUpPage;

public class ImportingDataSingleRefreshPopUpPageBrowser extends ImportingDataSingleRefreshPopUpPage {

    public ImportingDataSingleRefreshPopUpPageBrowser(Machine machine) {
        super(machine);
    }

    @Override
    public void assertImportSingleFlow(int secondsToWait) {
        machine.getMainPage().getDataLoadedSuccessfullyNotification(secondsToWait);
    }

    @Override
    public void assertRefreshSingleFlow(boolean isDataset, int secondsToWait) {
        try {
            Thread.sleep(2_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        if (isDataset)
            machine.getMainPage().getDatasetRefreshedMessageElem(secondsToWait);
        else
            machine.getMainPage().getReportRefreshedMessageElem(secondsToWait);
    }

    @Override
    protected void assertDialogOpenNotificationNoLongerPresent() {
        //TODO check if require to assert other element presence
        machine.assertNotPresent(DIALOG_OPEN_NOTIFICATION);
    }
}
