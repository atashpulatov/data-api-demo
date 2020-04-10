package desktop.automation.functional.not.maintained;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.driver.implementations.ImportObject;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

import static junit.framework.TestCase.assertEquals;

public class PrepareDataTests extends BaseLoggedInTests {

    //TC39459
    @Test
    public void importingReport() throws InterruptedException {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withCell("A1").isFirstImport(true).build();
        ImportPrepareDataHelper.importObject(argumments);

        int[] attributes = {0, 1, 3};
        int[] metrics = {2, 4, 5};
        FilterAndValuesIndexBased[] filterAndValues = {
                new FilterAndValuesIndexBased(1, new int[]{2, 3})
        };

        Thread.sleep(3_000);

        String secondObjCell = "P1";
        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withCell(secondObjCell)
                .isFirstImport(false)
                .withImportObject(ImportObject.ONE_K_REPORT_VERSION_TWO)
                .withAttributes(attributes)
                .withMetrics(metrics)
                .withFiltersAndValues(filterAndValues)
                .build();

        ImportPrepareDataHelper.importWithPrepareDataElaborate(argumments);

        //search for import in progress message element is too slow
        //machine.getImportRefreshProgressPopUp().getImportingDataMessageElem();

        machine.getMainPage().goToCellAndAssertValue(secondObjCell, "Country");

        ImportedObjectInList prepareDataReport = machine.getMainPage().getImportedObjectsInList().get(1);
        assertEquals(argumments.getObjectName(), prepareDataReport.getNameElem().getText().trim());
        prepareDataReport.getDeleteBtnElem().click();
    }

    //TC39460
    @Test
    public void importingDataset() throws InterruptedException {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, false)
                .withCell("A1").isFirstImport(true).build();
        ImportPrepareDataHelper.importObject(argumments);

        Thread.sleep(3_000);

        int[] attributes = {1, 4};
        int[] metrics = {1, 2, 3};
        FilterAndValuesIndexBased[] filterAndValues = {new FilterAndValuesIndexBased(1, new int[]{0, 1, 2, 4})};

        String secondObjCell = "P1";
        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withCell(secondObjCell)
                .isFirstImport(false)
                .withImportObject(ImportObject.FIVE_K_SALES_RECORDS_VERSION_ONE)
                .withAttributes(attributes)
                .withMetrics(metrics)
                .withFiltersAndValues(filterAndValues)
                .build();

        ImportPrepareDataHelper.importWithPrepareDataElaborate(argumments);

        //search for import in progress message element is too slow
        //machine.getImportRefreshProgressPopUp().getImportingDataMessageElem();

        machine.getMainPage().goToCellAndAssertValue(secondObjCell, "Country");

        Thread.sleep(5_000);

        ImportedObjectInList prepareDataDataset = machine.getMainPage().getImportedObjectsInList().get(1);
        assertEquals(argumments.getObjectName(), prepareDataDataset.getNameElem().getText());
        prepareDataDataset.getDeleteBtnElem().click();
    }

    //TC40366
    @Test
    public void nestedPrepareData(){
        String report = "Report with nested prompt";
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(2, new int[]{0, 1, 2});
        int[] attributes = {0, 1};
        int[] metrics = {-1};

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(attributes)
                .withMetrics(metrics)
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getStandardPromptPage().getRunBtnElem().click();

        machine.getHierarchyPromptPage().getImportObjectElems().get(1).click();
        machine.getHierarchyPromptPage().getAddBtnElem().click();
        machine.getHierarchyPromptPage().getRunBtnElem().click();

        ImportPrepareDataHelper.prepareDataSimple(argumments);

        String[][] expectedCellValues = {
                {"A2" , "2014"},
                {"E25" , "2 136 821"},
                {"D14" , "$1 619 051"},
                {"B17" , "Web"}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }


}
