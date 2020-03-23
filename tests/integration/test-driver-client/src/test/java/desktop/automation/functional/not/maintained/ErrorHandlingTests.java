package desktop.automation.functional.not.maintained;

import desktop.automation.helpers.*;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Ignore;
import org.junit.Test;

public class ErrorHandlingTests extends BaseLoggedInTests {

    //TC39688
    @Test
    //TODO refactor flow changed, move mouse over the "Import" button and assert tooltip states correct message
    public void cubeNotPublished() throws InterruptedException {
        String dataset = "Not Published Dataset.xlsx";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isDataset(true)
                .withObjectName(dataset)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().getCubeNotPublishedMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertCubeNotPublishedMessageElemNotPresent();
    }

    //TC48372
    @Test
    public void editingFilterExcludesAllData() {
        //TODO mac implement filters with text values
        FilterAndValues filterAndValues1 = new FilterAndValuesNameBased("Order Date", new String[]{"1/1/2010"});
        FilterAndValues filterAndValues2 = new FilterAndValuesNameBased("Order ID", new String[]{"104845464"});

        String report = ImportPrepareDataHelperArgumments.DEFAULT_REPORT;
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withAttributes(new int[]{})
                .withMetrics(new int[]{})
                .withFiltersAndValues(new FilterAndValues[]{filterAndValues1, filterAndValues2})
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.getMainPage().getImportedObjectsInList().get(0).getEditBtnElem().click();

        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);
        machine.getPrepareDataPromptPage().getImportBtn().click();
        //flaky - error message can disappear too fast
        machine.getPrepareDataPromptPage().getFilterExcludesAllDataMessage();

        //recovery
//        ImportPrepareDataHelper.prepareDataSimple(argumments);
//
//        Thread.sleep(2_000);
//        machine.getPrepareDataPromptPage().assertCancelBtnElemNotPresent();
    }

    //TC35147
    //Deprecated
    @Ignore
    @Test
    public void reportWithCrossTab() {
        String report = "Report with Crosstab";

        machine.getMainPage().getImportDataBtnElem().click();
        //skipping "Select Reports" step, since it's redundant
        machine.getImportPromptPage().getSearchBarElemAndSendKeys(report);
//        machine.getImportPromptPage().getObjectToImportNameCellElem(report).click();
        machine.getImportPromptPage().clickFirstObjectToImport();
        machine.getImportPromptPage().getImportBtnElem().click();

//        machine.getMainPage().getCrossTabTotalSubtotalErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

//        machine.getMainPage().assertCrossTabTotalSubtotalErrorMessageElemNotPresent();
    }

    //TC35148
    //Deprecated
    @Ignore
    @Test
    public void reportWithTotalsAndSubtotals() {
        String report = "Report with Totals and Subtotals";

        machine.getMainPage().getImportDataBtnElem().click();
        //skipping "Select Reports" step, since it's redundant
        machine.getImportPromptPage().getSearchBarElemAndSendKeys(report);
//        machine.getImportPromptPage().getObjectToImportNameCellElem(report).click();
        machine.getImportPromptPage().clickFirstObjectToImport();
        machine.getImportPromptPage().getImportBtnElem().click();

//        machine.getMainPage().getCrossTabTotalSubtotalErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

//        machine.getMainPage().assertCrossTabTotalSubtotalErrorMessageElemNotPresent();
    }

    //TC36598
    @Ignore
    //@Test
    public void lostNetwork(){
        //run only locally not remotely
        //disconnect is too slow
        try {
            String report = "100010 rows report";

            machine.getMainPage().getImportDataBtnElem().click();

            machine.getImportPromptPage().getSearchBarElemAndSendKeys(report);
//            machine.getImportPromptPage().getObjectToImportNameCellElem(report).click();
            machine.getImportPromptPage().clickFirstObjectToImport();
            machine.getImportPromptPage().getPrepareDataBtnElem().click();

            machine.getPrepareDataPromptPage().clickAttributes(new int[]{1, 3});
            machine.getPrepareDataPromptPage().clickMetrics(new int[]{0, 1, 2});
            machine.getPrepareDataPromptPage().getImportBtn().click();

            machine.getPreSUTPage().getConnectionElem().click();
            machine.getPreSUTPage().getDisconnectElem().click();
            machine.getPreSUTPage().getConnectionElem().click();

            //assert that addin error is shown
//            machine.getMainPage().getImportedObjectInListElem(report);
        }
        finally {
            //check if disconnected
            //reconnect
        }
    }

    //TC48373
    @Ignore //TODO
    @Test
    public void editProjectLimits() throws InterruptedException {
        String report = "rows 100001";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, false)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{-1})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.getMainPage().getImportedObjectsInList().get(0).getEditBtnElem().click();

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine, false)
                .withObjectName(report)
                .withAttributes(new int[]{})
                .withMetrics(new int[]{})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);
        machine.getPrepareDataPromptPage().getImportBtn().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getProjectLimitsExceededErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertProjectLimitsExceededErrorMessageNotPresent();

        //assert values stay the same
        String[][] expectedCellValues = {
                {"A2", "1"},
                {"A50000", "49999"},
                {"A50001", null}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }
}
