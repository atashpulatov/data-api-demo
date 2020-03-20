package desktop.automation.functional.maintained.mvp;

import desktop.automation.elementWrappers.MyLibrarySwitch;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

public class ImportTests extends BaseLoggedInTests {

    @Test
    public void importDataset() {
        String dataset = ImportPrepareDataHelperArgumments.DEFAULT_DATASET;
        machine.getMainPage().getImportDataBtnElem().click();

        MyLibrarySwitch myLibSwitch = machine.getImportPromptPage().getMyLibrarySwitch();
        if (myLibSwitch.isOn())
            myLibSwitch.getDriverElement().click();

        machine.focusOnImportDataPopUpFrameForBrowser();

        machine.getImportPromptPage().getSearchBarElemAndSendKeys(dataset);
        machine.getImportPromptPage().clickFirstObjectToImport();

        machine.getImportPromptPage().clickImportDataBtnAndAssertImportFlow();

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(dataset);
    }

    @Test
    public void importReport() {
        String report = ImportPrepareDataHelperArgumments.DEFAULT_REPORT;
        machine.getMainPage().getImportDataBtnElem().click();

        MyLibrarySwitch myLibSwitch = machine.getImportPromptPage().getMyLibrarySwitch();
        if (myLibSwitch.isOn())
            myLibSwitch.getDriverElement().click();

        machine.focusOnImportDataPopUpFrameForBrowser();

        machine.getImportPromptPage().getSearchBarElemAndSendKeys(report);
        //TODO once mac desktop can find element name cell refactor against method that gets cell with the appropriate name
        machine.getImportPromptPage().clickFirstObjectToImport();

        machine.getImportPromptPage().clickImportDataBtnAndAssertImportFlow();

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(report);
    }
}