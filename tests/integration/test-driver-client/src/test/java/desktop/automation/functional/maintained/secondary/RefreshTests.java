package desktop.automation.functional.maintained.secondary;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

public class RefreshTests extends BaseLoggedInTests {

    //refresh flows
    //TC48131
    @Test
    public void refreshReportWithoutPrompt(){
        String report = "1k report";
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);

        //refresh
        importedObjectInList.clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        //values
        String[][] expectedCellValues = {
                {"A2", "Afghanistan"},
                {"I1001", "199048,89"},
                {"F649", "Europe"},
                {"C545", "8/3/2015"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC48134
    @Test
    public void refreshObjectReqDefault() throws InterruptedException {
        String report = "Report with prompt - Object prompt | Required | Default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getStandardPromptPage().getCancelBtnElem();

        Thread.sleep(machine.isBrowser() ? 10_000 : 3_000);
        machine.getStandardPromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);

        //refresh
        importedObjectInList.clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        //cells to check
        String[][] expectedCellValues = {
                {"A2", "Books"},
                {"D25", "$471 814"},
                {"B11", "Electronics - Miscellaneous"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC48135
    @Test
    public void nestedPrompts() throws InterruptedException {
        String report = "Report with nested prompt";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        Thread.sleep(machine.isBrowser() ? 10_000 : 3_000);
        machine.getStandardPromptPage().getRunBtnElem().click();
        Thread.sleep(machine.isBrowser() ? 10_000 : 3_000);
        machine.getStandardPromptPage().clickRunBtnAndAssertImportFLow();

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);

        //refresh
        importedObjectInList.clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        //values
        String[][] expectedCellValues = {
                {"A2", "2014"},
                {"F97", "263 072"},
                {"C26", "Books"},
                {"D19", "$175 083"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC48136
    @Test
    public void refreshMultiplePrompts(){
        String report = "Report with multiple prompts";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getMultiplePromptsPage().answerPromptCorrectly();

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);

        //refresh
        importedObjectInList.clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().getImportedObjectInListNameElem(report);
        // values
        String[][] expectedCellValues = {
                {"A2", "2014"},
                {"E25", "$174 191"},
                {"C17", "Books"},
                {"B8", "Southwest"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC48137
    @Test
    public void refreshEditedReportWithPrompt() throws InterruptedException {
        String report = "Report with prompt - Object prompt | Required | Default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getStandardPromptPage().getCancelBtnElem();

        Thread.sleep(machine.isBrowser() ? 10_000 : 3_000);
        machine.getStandardPromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded and edit
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);
        importedObjectInList.getEditBtnElem().click();

        Thread.sleep(machine.isBrowser() ? 10_000 : 6_000);
        machine.getStandardPromptPage().getRunBtnElem().click();

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{-1, 3});
        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{0,1,0})
                .withMetrics(new int[]{1,-1,1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .isEditFlow(true)
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        //refresh
        importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.assertNameIsAsExpected(report);
        importedObjectInList.clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        //cells to check
        String[][] expectedCellValues = {
                {"A2", "Art & Architecture"},
                {"B4", "$57 986"},
                {"B19", "$62 172"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }
}
