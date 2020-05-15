package desktop.automation.functional.not.maintained;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.helpers.FilterAndValues;
import desktop.automation.helpers.FilterAndValuesNameBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SubtotalsTests extends BaseLoggedInTests {

    //TODO add subtotal reports to package manager
    //TODO TC48981
    @Ignore
    @Test
    public void importSubtotalsAtEachLevelAndGrandTotal(){
        String report = "";//TODO test data

        //TODO expected Cell values
        String[][] expectedCellValues = {
                {"", ""},
                {"", ""},
                {"", ""},
                {"", ""},
                {"", ""}
        };

        //TODO cells expected to be bold
        String[] cellsExpectedToBeBold = {
                "",
                "",
                "",
                "",
                ""
        };

        importSubtotalsTest(report, expectedCellValues, cellsExpectedToBeBold);

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        assertEquals(report, importedObjectInList.getNameElem().getText());


    }

    //TC48984
    @Test
    public void prepareDataTotalsSubtotals(){
        String report = "Report with Totals and Subtotals";

        //first text based filter implementation
        //FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{0, 2, 3});
        FilterAndValues filterAndValuesNameBased = new FilterAndValuesNameBased("Category", new String[]{"Books", "Movies", "Music"});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withAttributes(new int[]{0, 1})
                .withMetrics(new int[]{-1, -1, -1})
                .withFiltersAndValues(new FilterAndValues[]{filterAndValuesNameBased})
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        String[][] expectedCellValues = {
                {"A2", "Books"},
                {"D23", "$10 632 405"},
                {"A23", "Total"},
                {"D2", "$480 173"},
                {"C8", "$569 278"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        String[] cellsExpectedToBeBold = {
                "B8",
                "D15",
                "D23",
                "A23",
                "B22"
        };

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
