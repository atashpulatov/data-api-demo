package desktop.automation.functional.maintained.secondary;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

import java.util.List;

public class CrosstabsTests extends BaseLoggedInTests {

    //TC48524
    //TC48531
    @Test
    public void importCrosstabsOneAttrOnCol() {
        String report = "Report with crosstab 123";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        String[][] expectedCellValues = {
                {"A1", "Subcategory"},
                {"A39", "Dec 2016"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues); //TODO

        List<ImportedObjectInList> importedObjectsInList = machine.getMainPage().getImportedObjectsInList();
        ImportedObjectInList importedObjectInList = importedObjectsInList.get(0);
        importedObjectInList.assertNameIsAsExpected(report);

        //start TC48531
        importedObjectInList.getEditBtnElem().click();

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1, 0, 1, 2});
        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{0, -1, 1})
                .withMetrics(new int[]{-1, -1, 0, 2})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .isDataset(false)
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        expectedCellValues = new String[][]{
                {"A2", "Jan 2014"},
                {"C1", "Revenue Forecast"},
                {"A37", "Dec 2016"},
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    // TC48529
    // TC48526
    @Test
    public void crosstabAndPrompt() {
        String report = "Report with crosstab & prompt";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getAttributeElementPromptPage().getAddAllBtnElem().click();
        machine.getAttributeElementPromptPage().clickRunBtnAndAssertImportFLow();

        //expected cell values
        String[][] expectedCellValues = {
                {"A2", "Metrics"},
                {"BJ1", "Horror"},
                {"A39", "Dec 2016"},
                {"AY2", "Profit Forecast"}
        };

        machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.getMainPage().assertCellValues(expectedCellValues);

        //start TC48526
        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC48530
    //TC48533
    @Test
    public void importCrosstabTwoAttrOnCol(){
        String report = "Report with crosstab (2 attributes on column axis)";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        //expected cell values
        String[][] expectedCellValues = {
                {"A1", "Category"},
                {"CR40", "$21 495"},
                {"CS3", "Revenue Forecast"},
                {"A40", "Dec 2016"},
                {"Z14", "$16 297"}
        };

        machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.getMainPage().assertCellValues(expectedCellValues);

        //start TC48533
        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }
}
