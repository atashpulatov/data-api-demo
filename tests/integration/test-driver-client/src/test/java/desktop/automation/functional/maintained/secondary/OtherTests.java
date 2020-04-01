package desktop.automation.functional.maintained.secondary;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.driver.implementations.ImportObject;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertFalse;

public class OtherTests extends BaseLoggedInTests {

    //TC35407
    @Test
    public void importWithNotSupportedFeatures(){
        String reportName = "Report with Page by, Advanced Sorting, Thresholds, Outline, Banding, Merge cells & Multiform attributes";
        ImportPrepareDataHelperArgumments arguments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(reportName)
                .build();
        ImportPrepareDataHelper.importObject(arguments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(arguments.getObjectName());
        machine.getMainPage().assertErrorMessageOKBtnElemNotPresent();
    }

    //TC48363
    @Test
    public void editNumericReport() throws InterruptedException {
        String report = "Report with prompt - Value prompt - Numeric (Year) | Required | Default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        WebDriverElemWrapper input = machine.getNumericPromptPage().getNumberInputElem();
        input.clear();
        input.sendKeys("2015");

        machine.getStandardPromptPage().clickRunBtnAndAssertImportFLow();

        //assert import succeeded
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);

        // edit
        importedObjectInList.getEditBtnElem().click();

        Thread.sleep(6_000);
        machine.getStandardPromptPage().getRunBtnElem().click();

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{0, 0, 0, 1, -1, 1})
                .withMetrics(new int[]{0, 1, 0, 1, -1, 1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{new FilterAndValuesIndexBased(1, new int[]{-1, 3, 3, 3, 1, 1})})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        //assert that import succeeded
        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(report);

        //assert cell values
        String[][] values = {
                {"A2", "2015"},
                {"C5", "$55 778"},
                {"B3", "Electronics"}
        };
        machine.getMainPage().assertCellValues(values);
    }

    //TC48337
    @Test
    public void editNonFilteredReport() {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        ImportedObjectInList importedReport = machine.getMainPage().getImportedObjectsInList().get(0);
        importedReport.getEditBtnElem().click();

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(1, new int[]{2, 3, 4 ,5});
        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withImportObject(ImportObject.ONE_K_REPORT_VERSION_TWO)
                .withAttributes(new int[]{0, 2, 3})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        String[][] expectedCellValues = {
                {"A2", "Cereal"},
                {"D138", "Online"},
                {"C123", "Central America and the Caribbean"},
                {"B66", "M"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC48338
    @Test
    public void editFilteredDataset() throws InterruptedException {
        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(1, new int[]{0, 2, 4});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(2, new int[]{3, 4});
        ImportObject dataset = ImportObject.FIVE_K_SALES_RECORDS_VERSION_ONE;

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withImportObject(dataset)
                .withAttributes(new int[]{0, 2})
                .withMetrics(new int[]{0, 1, 2})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues2})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        Thread.sleep(5_000);

        ImportedObjectInList importedDataset = machine.getMainPage().getImportedObjectsInList().get(0);
        importedDataset.assertNameIsAsExpected(dataset.getName());
        importedDataset.getEditBtnElem().click();

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withImportObject(ImportObject.FIVE_K_SALES_RECORDS_VERSION_ONE)
                .withAttributes(new int[]{1, 4, 5})
                .withMetrics(new int[]{0, 1, 2, 3, 4})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues2, filterAndValues1})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        String[][] cellExpectedValues = {
                {"A2", "Middle East and North Africa"},
                {"F4", "1330261,9"},
                {"G33", "75120,64"},
                {"B64", "Angola"},
                {"C42", "Meat"}
        };

        machine.getMainPage().assertCellValues(cellExpectedValues);
    }

    //TC48339
    @Test
    public void editNonFilteredDataset() {
        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(1, new int[]{-1, 2, 3});

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withImportObject(ImportObject.FIVE_K_SALES_RECORDS_VERSION_ONE)
                .isFirstImport(true)
                .withImportRefreshFlowTimeOut(100)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        ImportedObjectInList importedDataset = machine.getMainPage().getImportedObjectsInList().get(0);
        importedDataset.getEditBtnElem().click();

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withImportObject(ImportObject.FIVE_K_SALES_RECORDS_VERSION_ONE)
                .withAttributes(new int[]{0, 1, 0, 4})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        String[][] cellExpectedValues = {
                {"C6", "Offline"}
        };

        machine.getMainPage().assertCellValues(cellExpectedValues);
    }

    //TC48340
    @Test
    public void editFilteredReport() throws InterruptedException {
        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(1, new int[]{0, 2, 4});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(2, new int[]{3, 4});

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withImportObject(ImportObject.FIVE_K_SALES_RECORDS_VERSION_TWO)
                .withAttributes(new int[]{1, 3, 4})
                .withMetrics(new int[]{-1, 0, 1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues2})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        Thread.sleep(5_000);

        ImportedObjectInList importedReport = machine.getMainPage().getImportedObjectsInList().get(0);
        importedReport.getEditBtnElem().click();

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withImportObject(ImportObject.FIVE_K_SALES_RECORDS_VERSION_TWO)
                .withAttributes(new int[]{-1})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues2, filterAndValues1})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        String[][] cellExpectedValues = {
                {"A2", "Afghanistan"},
                {"O64", "3774"},
                {"L53", "27672,78"},
                {"H58", "10/3/2015"},
                {"E13", "L"}
        };

        machine.getMainPage().assertCellValues(cellExpectedValues);
    }

    //TC48529
    @Test
    public void importReportCrosstabAndPrompt() {
        String report = "Report with crosstab & prompt";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        //assert steps work and are for correct prompt
        machine.getStandardPromptPage().getCancelBtnElem();
        machine.getStandardPromptPage().getRunBtnElem();

        WebElement searchElem = machine.getAttributeElementPromptPage().getSearchElem();
        searchElem.sendKeys("Books");
        searchElem.sendKeys(Keys.ENTER);

        machine.getAttributeElementPromptPage().getAddBtnElem().click();
        machine.getStandardPromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(report);

        String[][] cellExpectedValues = {
                {"A3", "Month"},
                {"A9", "Jun 2014"},
                {"A39", "Dec 2016"},
        };

        machine.getMainPage().assertCellValues(cellExpectedValues);
    }

    //TC39605
    @Test
    public void removeReportAndDataset() throws InterruptedException {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName("2X2R")
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        if (machine.isBrowser())
            Thread.sleep(5_000);
        machine.getPreSUTPage().getAddSheetBtnElem().click();

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withObjectName("2X2D")
                .isFirstImport(false)
                .withSheetIndex(2)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        List<ImportedObjectInList> importedObjects = machine.getMainPage().getImportedObjectsInList();
        ImportedObjectInList importedReport = importedObjects.get(1);

        int importedObjectCount = 2;
        String reportName = importedReport.getNameElem().getText();

        importedReport.getMainElem().click();
        importedReport.getDeleteBtnElem().click();
        Thread.sleep(5_000);

        machine.getMainPage().goToCellAndAssertValue("A1", null);

        importedObjects = machine.getMainPage().getImportedObjectsInList();

        assertEquals(--importedObjectCount, importedObjects.size());
        for (ImportedObjectInList importedObject : importedObjects) {
            assertFalse(importedObject.getNameElem().getText().matches(reportName));
        }

        ImportedObjectInList importedDataset = machine.getMainPage().getImportedObjectsInList().get(0);

        String datasetName = importedDataset.getNameElem().getText();

        importedDataset.getMainElem().click();
        importedDataset.getDeleteBtnElem().click();
        Thread.sleep(5_000);

        machine.getMainPage().goToCellAndAssertValue("A1", null);

        importedObjects = machine.getMainPage().getImportedObjectsInList();

        assertEquals(importedObjectCount, importedObjects.size());
        for (ImportedObjectInList importedObject : importedObjects) {
            assertFalse(importedObject.getNameElem().getText().matches(datasetName));
        }
    }

    //TC41078
    @Test
    public void renameReport(){
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName("2X2R")
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withObjectName("2X2R")
                .isFirstImport(false)
                .withCell("AA1")
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        List<ImportedObjectInList> importedObjs = machine.getMainPage().getImportedObjectsInList();

        //first import
        String newName = "test1";
        importedObjs.get(0).rename(newName);
        assertEquals(newName, importedObjs.get(0).getNameElem().getText());

        //second import
        newName = "test2";
        importedObjs.get(1).rename(newName);
        assertEquals(newName, importedObjs.get(1).getNameElem().getText());
    }

    //TC41092
    @Test
    public void rename255PlusAndEmpty()  {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName("2X2R")
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withObjectName("2X2D")
                .isFirstImport(false)
                .withCell("AA1")
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        String name255 = "mzWoVVfmDf65KuxY1KbRSo30J0jzJKR3oRKJOh7GMkosuazSJ5GqZLhkLRyskpTxHBvIjEXdPHkPCuQID6wMNlnCPs74gVQd3I6lI00hs7vmU7cdQ6muaNdIXxIinqJPno0xJ7JwhOoPoUmCeKVUpk9BHpWrW50HC4s9ukDrImrix7FDrPnjID2cf5mPEUOzpgLRilM8qp44VxDIZ8KTmo5i7uhguAzTrwhFoJZs5nquMhP5k6EBjBzKjnHaW2Q";

        List<ImportedObjectInList> importedObjs = machine.getMainPage().getImportedObjectsInList();

        ImportedObjectInList importedReport = importedObjs.get(0);
        String reportName = importedReport.getNameElem().getText();

        importedReport.rename(null);
        assertEquals(reportName, importedReport.getNameElem().getText());

        importedReport.rename(name255 + "additional test");
        assertEquals(name255, importedReport.getNameElem().getText());

        //Dataset
        ImportedObjectInList importedDataset = importedObjs.get(1);
        String datasetName = importedDataset.getNameElem().getText();
        importedDataset.rename(null);
        assertEquals(datasetName, importedDataset.getNameElem().getText());

        importedReport.openContextMenuAndClickCopy();

        importedDataset.pasteNameFromClipboard();

        assertEquals(name255, importedDataset.getNameElem().getText());
    }

    // TC48361
    @Test
    public void editBigDecimalReport() throws InterruptedException {
        String report = "Report with prompt - Value prompt - Big Decimal (Customer ID) | Not required | No default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getStandardPromptPage().getRunBtnElem();

        WebElement inputElem = machine.getBigDecimalPromptPage().getAnswerInputElem();
        inputElem.sendKeys("1820");

        machine.getStandardPromptPage().getRunBtnElem().click();
        Thread.sleep(5_000);

        //assert that import succeeded
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);

        //edit
        importedObjectInList.getEditBtnElem().click();
        Thread.sleep(6_000);
        machine.getBigDecimalPromptPage().getRunBtnElem().click();

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{-1,0,0})
                .withMetrics(new int[]{-1,0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{new FilterAndValuesIndexBased(0, new int[]{-1})})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);
        Thread.sleep(5_000);

        //assert that import succeeded
        importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);


        //assert cell values
        machine.getMainPage().assertCellValues(new String[][]{{"A2", "1820"}});
    }
}
