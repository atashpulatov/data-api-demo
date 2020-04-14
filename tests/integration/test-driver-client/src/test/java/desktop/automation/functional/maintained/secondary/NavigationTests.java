package desktop.automation.functional.maintained.secondary;

import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

public class NavigationTests extends BaseLoggedInTests {

    //TC40356
    //TC40357
    @Test
    public void navigationWithPrepareDataImportBackAndCancel() throws InterruptedException {
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);

        machine.getImportPromptPage().getPrepareDataBtnElem().click();
        machine.getHierarchyPromptPage().assertPromptOpen();

        machine.getStandardPromptPage().getBackBtnElem().click();
        machine.getImportPromptPage().getTitleElem();

        //start TC40357
        machine.getImportPromptPage().getImportBtnElem().click();
        machine.getHierarchyPromptPage().assertPromptOpen();

        machine.getHierarchyPromptPage().getCancelBtnElem().click();
        Thread.sleep(3_000);
        machine.getImportPromptPage().assertPromptNotOpen();
    }

    //TC40358
    //TC40359
    @Test
    public void navigationWithPrepareDataAfterRunImportBackAndCancel() throws InterruptedException {
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{-1});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withAttributes(new int[]{0, 0})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getHierarchyPromptPage().answerPromptCorrectly();
        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);

        machine.getPrepareDataPromptPage().getBackBtn().click();
        machine.getImportPromptPage().getTitleElem();

        //start TC40359
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getHierarchyPromptPage().answerPromptCorrectly();
        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);

        machine.getPrepareDataPromptPage().getCancelBtn().click();
        Thread.sleep(3_000);
        machine.getPrepareDataPromptPage().assertPromptNotOpen();
        machine.getImportPromptPage().assertPromptNotOpen();
    }
}
