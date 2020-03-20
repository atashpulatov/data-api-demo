package desktop.automation.functional.maintained.secondary;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

public class SubtotalTests extends BaseLoggedInTests {

    //TC48983
    //TC48986
    @Test
    public void importCrosstabAndTotalsSubtotals(){
        String report = "Report with crosstab & subtotal";

        String[][] expectedCellValues = {
                {"A2", "Metrics"},
                {"C3", null},
                {"AB40", "$2 640 094"}
        };

        String[] cellsExpectedToBeBold = {
                "A40",
                "AB6",
                "AC40"
        };
        importSubtotalsTest(report, expectedCellValues, cellsExpectedToBeBold);

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);

        //TC48986 start
        importedObjectInList.getEditBtnElem().click();

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{-1, 0, 1});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{0})
                .withMetrics(new int[]{1, 0, 2, 0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        expectedCellValues = new String[][]{
                {"C1", "Revenue Forecast"},
                {"A8", "Total"},
                {"A2", "Art & Architecture"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        cellsExpectedToBeBold = new String[]{
                "A8",
                "B8",
                "C8"
        };
        machine.assertThatCellsAreBold(cellsExpectedToBeBold);
    }

    //TC48982
    //TC48985
    @Test
    public void importSubtotalsMultipleFunctionsMinMaxAvg(){
        String report = "Report with a subtotal (min, max & average)";

        String[][] expectedCellValues = {
                {"A2", "Jan 2014"},
                {"B971", "Average"},
                {"A976", "Maximum"},
                {"F1", "Revenue Forecast"}
        };

        String[] cellsExpectedToBeBold = {
                "B917",
                "F976",
                "A976",
                "F971",
                "F26"
        };
        importSubtotalsTest(report, expectedCellValues, cellsExpectedToBeBold);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        //TC48985 start
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);
        importedObjectInList.clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        machine.getMainPage().assertCellValues(expectedCellValues);
        machine.assertThatCellsAreBold(cellsExpectedToBeBold);
    }

    //TC48987
    //TC48988
    @Test
    public void importTotalsSubtotalsPrompt(){
        String report = "Report with a subtotal & prompt";

        String[][] expectedCellValues = {
                {"A2", "Jan 2014"},
                {"B902", "Total"},
        };

        String[] cellsExpectedToBeBold = {
                "F902",
                "A902"
        };

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getAttributeElementPromptPage().getAddAllBtnElem().click();
        machine.getAttributeElementPromptPage().clickRunBtnAndAssertImportFLow();

        machine.getMainPage().getImportedObjectInListNameElem(report);

        machine.getMainPage().assertCellValues(expectedCellValues);

        machine.assertThatCellsAreBold(cellsExpectedToBeBold);

        //TC48988 start
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        machine.getMainPage().assertCellValues(expectedCellValues);
        machine.assertThatCellsAreBold(cellsExpectedToBeBold);
    }

    private void importSubtotalsTest(String reportName, String[][] expectedCellValues, String[] cellsExpectedToBeBold) {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(reportName)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().getImportedObjectInListNameElem(reportName);
        machine.getMainPage().assertCellValues(expectedCellValues);

        machine.assertThatCellsAreBold(cellsExpectedToBeBold);
    }
}
