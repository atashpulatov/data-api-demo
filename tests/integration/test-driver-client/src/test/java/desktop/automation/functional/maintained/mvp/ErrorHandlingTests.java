package desktop.automation.functional.maintained.mvp;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

public class ErrorHandlingTests extends BaseLoggedInTests {

    //TC35194
    @Test
    public void cubeExceedingLimitsAtEdge() throws InterruptedException {
        String cell = Math.random() < 0.5 ? "A1048575" : "XFD1";
        String dataset = "5k Sales Records.csv";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .isFirstImport(true)
                .withCell(cell)
                .withObjectName(dataset)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getLimitsExceededErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertLimitsExceededErrorMessageElemNotPresent();
    }

    //TC35247 test data with negative flow
    @Test
    public void reportExceedingLimitsAtStart() throws InterruptedException {
        String report = "rows 1048577R";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getLimitsExceededErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertLimitsExceededErrorMessageElemNotPresent();
    }

    //TC35248
    @Test
    public void reportExceedingLimitsAtEdge() throws InterruptedException {
        String cell = Math.random() < 0.5 ? "A1048575" : "XFD1";
        String report = ImportPrepareDataHelperArgumments.DEFAULT_REPORT;

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withCell(cell)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getLimitsExceededErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertLimitsExceededErrorMessageElemNotPresent();
    }

    //TC35249
    @Test
    public void datasetExceedsProjectLimits() throws InterruptedException {
        String report = "rows 100001D";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withObjectName(report)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getProjectLimitsExceededErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertProjectLimitsExceededErrorMessageNotPresent();
    }

    //TC35250
    @Test
    public void reportExceedsProjectLimits() throws InterruptedException {
        String report = "rows 100001R";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, false)
                .withObjectName(report)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getProjectLimitsExceededErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertProjectLimitsExceededErrorMessageNotPresent();
    }

    //TC35251
    @Test
    public void objectInObject() throws InterruptedException {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, Math.random() < 0.5)
            .withObjectName("2X2D")
            .isFirstImport(true)
            .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(argumments.getObjectName());

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine, Math.random() < 0.5)
                .withObjectName("2X2R")
                .isFirstImport(false)
                .withCell("B2")
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        Thread.sleep(3_000);
        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getRangeNotEmptyMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertRangeNotEmptyMessageElemNotPresent();

        machine.getMainPage().getImportedObjectsInList().get(0).getDeleteBtnElem().click();
    }

    //TC35252
    @Test
    public void objectAboveObject() throws InterruptedException {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName("2X2R")
                .isFirstImport(true)
                .withCell("A2")
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(argumments.getObjectName());

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName("2X2D")
                .isFirstImport(false)
                .withCell("A1")
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getRangeNotEmptyMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertRangeNotEmptyMessageElemNotPresent();
    }

    //TC36826
    @Test
    public void filteredOutReport() throws InterruptedException {
        String report = "Report with All data filtered out";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getThisObjectCannotBeImportedErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertThisObjectCannotBeImportedErrorMessageNotPresent();
    }

    //TC34506
    @Test
    public void notSupportedCube() throws InterruptedException {
        String report = "multi table cube";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getThisObjectCannotBeImportedErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertThisObjectCannotBeImportedErrorMessageNotPresent();
    }

    //TC36625
    @Test
    public void insertTableIntoRangeNextToAnotherTable() throws InterruptedException {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName("2X2R")
                .withCell("B1")
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(argumments.getObjectName());

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName("2X2D")
                .withCell("A1")
                .isFirstImport(false)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getRangeNotEmptyMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertRangeNotEmptyMessageElemNotPresent();
    }

    //edit error handling
    //TC48370
    //TODO split into two tests 1)one vertical assert, 2) one horizontal
    @Test
    public void editOverlapsAnotherObject() throws InterruptedException {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withCell("A5")
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(3, new int[]{0});
        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(false)
                .withAttributes(new int[]{0,1,2,3,4,5})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().assertImportedObjectListNames(new String[]{"1k report", "1k report"});

        machine.getMainPage().getImportedObjectsInList().get(0).getEditBtnElem().click();
        filterAndValues = new FilterAndValuesIndexBased(3, new int[]{0});
        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(false)
                .withAttributes(new int[]{})
                .withMetrics(new int[]{})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);
        machine.getPrepareDataPromptPage().getImportBtn().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getRangeNotEmptyMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertRangeNotEmptyMessageElemNotPresent();
    }

    //TC48371
    @Test
    public void reportExceedsLimitsAfterEdit() throws InterruptedException {
        String report = "1.5M report";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(6, new int[]{0, 1});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{0})
                .withMetrics(new int[]{0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);
        importedObjectInList.getEditBtnElem().click();

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{-1})
                .withMetrics(new int[]{})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);
        machine.getPrepareDataPromptPage().getImportBtn().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getLimitsExceededErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertLimitsExceededErrorMessageElemNotPresent();
    }

    //TC48374
    @Test
    public void reportAfterEditIsOutsideExcelSheetLimits() throws InterruptedException {
        String cell = Math.random() < 0.5 ? "A1048574" : "XFD1";
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(3, new int[]{0});

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withCell(cell)
                .withAttributes(new int[]{0})
                .withMetrics(new int[]{})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).getEditBtnElem().click();
        filterAndValues = new FilterAndValuesIndexBased(3, new int[]{0});
        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withAttributes(new int[]{1,2,3})
                .withMetrics(new int[]{})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);
        machine.getPrepareDataPromptPage().getImportBtn().click();

        machine.focusOnAddInFrameForBrowser();
        machine.getMainPage().getLimitsExceededErrorMessageElem();
        machine.getMainPage().getErrorMessageOKBtnElem().click();

        Thread.sleep(3_000);
        machine.getMainPage().assertLimitsExceededErrorMessageElemNotPresent();
    }
}
