package desktop.automation.functional.not.maintained;

import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

public class ImportTests extends BaseLoggedInTests {

    //TC35247 test data with positive flow
    //TC35090
    //TODO Mac
    @Test
    public void importReportWith1048576Rows() throws InterruptedException {
        String report = "rows 1048576";
        machine.getMainPage().getImportDataBtnElem().click();

//        WebElementWithAriaProperties myLibSwitch = machine.getImportPromptPage().getMyLibrarySwitchElem();
//        if (myLibSwitch.isChecked())
//            myLibSwitch.getElement().click();

        machine.focusOnImportDataPopUpFrameForBrowser();

        machine.getImportPromptPage().getSearchBarElemAndSendKeys(report);
        machine.getImportPromptPage().clickFirstObjectToImport();

        machine.getImportPromptPage().getImportBtnElem().click();

        if (machine.isBrowser()) {
            machine.focusOnAddInFrameForBrowser();
            machine.getMainPage().getDataLoadedSuccessfullyNotification(300);
        }
        else
            Thread.sleep(300_000);

        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC39670
    //TC39671
    @Test
    public void importGridGraphReport(){
        String report = "Grid showing Graphs Aligned in rows";
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, false)
                .withObjectName(report)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        if (machine.isBrowser())
            machine.getMainPage().getDataLoadedSuccessfullyNotification(40);
        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(report);

        String[][] expectedCellValues = {
                {"A2", "Books"},
                {"F33", "31 572"},
                {"C15", "$1 280 174"},
                {"B11", "Mid-Atlantic"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);
    }
}
