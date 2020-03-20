package desktop.automation.pages.SUT.refresh.popups;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.selectors.SUT.ImportingDataSingleRefreshPopUpPageSelectors;

public abstract class ImportingDataSingleRefreshPopUpPage extends ImportingDataSingleRefreshPopUpPageSelectors {
    //current status
    //implemented, but not applied:
    //Browser:  only asserts that the Data Loaded, Refresh message loaded
    //Mac:      asserts that the popup Importing data title is present and the correct message afterwards in the add in panel
    //Windows   asserts that the import title is present within 2,5 seconds of the call to the assertion flow methods, if can't find print to system.out that the element was not found, but does not fail the test, later finds the respective notification expected to be present in the run
    //implemented and applied:
    //Browser:  only asserts that the Data Loaded, Refresh message loaded
    //Mac:      only asserts that the Data Loaded, Refresh message loaded
    //Windows   only asserts that the Data Loaded, Refresh message loaded
    protected Machine machine;

    public ImportingDataSingleRefreshPopUpPage(Machine machine) {
        this.machine = machine;
    }

    public AnyInterfaceElement getImportingDataTitleElem(){
        machine.focusOnImportRefreshPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(IMPORTING_DATA_TITLE_ELEM);
    }

    public AnyInterfaceElement getDialogOpenNotificationElem(){
        return machine.waitAndFindElemWrapper(DIALOG_OPEN_NOTIFICATION);
    }

    public AnyInterfaceElement findDialogOpenNotificationElem(){
        return machine.driver.findElement(DIALOG_OPEN_NOTIFICATION);
    }

    public void assertRefreshSingleFlow(boolean isDataset) {
        assertRefreshSingleFlow(isDataset, 180);
    }

    public abstract void assertImportSingleFlow(int secondsToWait);

    public abstract void assertRefreshSingleFlow(boolean isDataset, int secondsToWait);

    public void assertImportSingleFlowFull(int secondsToWait) {
        assertImportRefreshPopUpAppearedAndDisappeared(secondsToWait);

        machine.getMainPage().getDataLoadedSuccessfullyNotification();
    }

    public void assertRefreshSingleFlowFull(boolean isDataset, int secondsToWait){
        assertImportRefreshPopUpAppearedAndDisappeared(secondsToWait);

        if (isDataset)
            machine.getMainPage().getDatasetRefreshedMessageElem();
        else
            machine.getMainPage().getReportRefreshedMessageElem();
    }


    private void assertImportRefreshPopUpAppearedAndDisappeared(int secondsToWait) {
        getImportingDataTitleElem();
        waitUntilDialogOpenNotificationDisappears(secondsToWait);
    }

    public void waitForDialogOpenNotificationToAppearAndDisappear(){
        //if the imported object is small enough the dialog disappears too fast
        try {
            System.out.println("locating dialog open notification");
            getDialogOpenNotificationElem();
            System.out.println("dialog open notification found");
        } catch (Exception ignored) {
            System.out.println("did not find dialog open notification");
        }

        waitUntilDialogOpenNotificationDisappears();
    }

    public void waitUntilDialogOpenNotificationDisappears(){
        waitUntilDialogOpenNotificationDisappears(180);
    }

    public void waitUntilDialogOpenNotificationDisappears(int secondsToWait){
        // when importing a larger object Excel starts to lag and the driver can no longer discover the dialog open notification.
        // therefor right now in order to break the loop need to locate other supporting elems that should be present past dialog end
        System.out.println("waiting for dialog open notification to disappear");

        long start = System.currentTimeMillis();
        while (System.currentTimeMillis() - start < secondsToWait * 1_000) {
            try {
                findDialogOpenNotificationElem();
                try {
                    Thread.sleep(500);
                } catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
            } catch (Exception e){
                try {
                    assertDialogOpenNotificationNoLongerPresent();
                    break;
                } catch (Exception ignored) {}
            }
        }

        System.out.println("dialog open notification no longer detected");
    }

    protected abstract void assertDialogOpenNotificationNoLongerPresent();
}
