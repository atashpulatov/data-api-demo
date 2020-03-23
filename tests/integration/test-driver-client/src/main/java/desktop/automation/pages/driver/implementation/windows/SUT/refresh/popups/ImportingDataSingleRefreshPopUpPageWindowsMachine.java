package desktop.automation.pages.driver.implementation.windows.SUT.refresh.popups;

import desktop.automation.driver.wrappers.WindowsMachine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.exceptions.ImageBasedElemNotFound;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.refresh.popups.ImportingDataSingleRefreshPopUpPage;

public class ImportingDataSingleRefreshPopUpPageWindowsMachine extends ImportingDataSingleRefreshPopUpPage {
    private static final String IMPORTING_DATA_TITLE_IMAGE = "importingDataSingleRefreshPopUpPage/importingDataTitle";

    public ImportingDataSingleRefreshPopUpPageWindowsMachine(WindowsMachine machine) {
        super(machine);
    }

    public AnyInterfaceElement getImportingDataTitleElem(double secondsToWaitFor){
        return new ImageComparisonElem(IMPORTING_DATA_TITLE_IMAGE, 850, 1100, 450, 530,
                (int)(secondsToWaitFor * 1000));
    }

    private void assertImportTitleElemPresence(){
        double secondsToWaitFor = 2.5;
        try {
            getImportingDataTitleElem(secondsToWaitFor);
        } catch (ImageBasedElemNotFound e){
            System.out.println(String.format("Importing data title not found within: %f seconds", secondsToWaitFor));
        }
    }

    @Override
    public void assertImportSingleFlow(int secondsToWait) {
//        assertImportTitleElemPresence();
        machine.getMainPage().getDataLoadedSuccessfullyNotification(secondsToWait);

        //the retrieval of imported objects often fails due to too quick pull of elems from server, alternatively can extend the driver wait
        try {
            Thread.sleep(5_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void assertRefreshSingleFlow(boolean isDataset, int secondsToWait) {
        if (isDataset)
            machine.getMainPage().getDatasetRefreshedMessageElem(secondsToWait);
        else
            machine.getMainPage().getReportRefreshedMessageElem(secondsToWait);

        try {
            Thread.sleep(5_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void assertDialogOpenNotificationNoLongerPresent() {
        assertImportTitleElemPresence();
        throw new NotImplementedForDriverWrapperException();
    }
}
