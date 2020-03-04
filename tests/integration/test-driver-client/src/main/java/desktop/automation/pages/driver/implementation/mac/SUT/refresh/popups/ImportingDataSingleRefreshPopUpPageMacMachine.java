package desktop.automation.pages.driver.implementation.mac.SUT.refresh.popups;

import desktop.automation.driver.wrappers.MacMachine;
import desktop.automation.pages.SUT.refresh.popups.ImportingDataSingleRefreshPopUpPage;
import desktop.automation.pages.driver.implementation.mac.nonSUT.PreSUTPageMacMachine;

public class ImportingDataSingleRefreshPopUpPageMacMachine extends ImportingDataSingleRefreshPopUpPage {

    public ImportingDataSingleRefreshPopUpPageMacMachine(MacMachine machine) {
        super(machine);
    }

    @Override
    public void assertImportSingleFlow(int secondsToWait) {
        machine.getMainPage().getDataLoadedSuccessfullyNotification(secondsToWait);
    }

    @Override
    public void assertRefreshSingleFlow(boolean isDataset, int secondsToWait) {
        if (isDataset)
            machine.getMainPage().getDatasetRefreshedMessageElem(secondsToWait);
        else
            machine.getMainPage().getReportRefreshedMessageElem(secondsToWait);
    }

    @Override
    protected void assertDialogOpenNotificationNoLongerPresent() {
        machine.getMainPage().getMoreItemsMenuElem();
        ((PreSUTPageMacMachine)machine.getPreSUTPage()).getEditMenuElem();
    }
}
