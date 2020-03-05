package notToBeRunAsPartOfTestSuite;

import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

public class DraftRefreshSingle extends BaseLoggedInTests {

    @Test
    public void test() {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName("report 100k rows")
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(180);

        machine.getMainPage().getImportedObjectsInList().get(0).getDeleteBtnElem().click();

        for (int i = 0; i < 1; i++) {
            System.out.println("i = " + i);
            argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                    .isFirstImport(true)
                    .withObjectName("2X2R")
                    .build();
            ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
            machine.getImportPromptPage().getImportBtnElem().click();

            machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(20);

            machine.getMainPage().getImportedObjectsInList().get(0).getDeleteBtnElem().click();
        }

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(20);

        machine.getMainPage().getImportedObjectsInList().get(0).getDeleteBtnElem().click();
    }

    @Test
    public void testRefreshReport(){
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(180);

        machine.getMainPage().getImportedObjectsInList().get(0).getRefreshBtnElem().click();

        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(false,180);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(ImportPrepareDataHelperArgumments.DEFAULT_REPORT);
    }

    @Test
    public void testRefreshDataset(){
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getImportingDataSingleRefreshPopUpPage().assertImportSingleFlow(180);

        machine.getMainPage().getImportedObjectsInList().get(0).getRefreshBtnElem().click();

        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(true,180);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(ImportPrepareDataHelperArgumments.DEFAULT_DATASET);
    }
}
