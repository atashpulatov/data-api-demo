package notToBeRunAsPartOfTestSuite;

import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

public class DraftPrepData extends BaseLoggedInTests {

    @Test
    public void testDataset() {
        String object = "5k Sales Records.csv";

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{-1, 0});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1, 0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withObjectName(object)
                .withAttributes(new int[]{-1, 0})
                .withMetrics(new int[]{-1, 0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1, filterAndValues2})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(object);
    }

    @Test
    public void testReportWithoutCrosstab() {
        String report = "1k report";

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{-1, 0});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1, 0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{-1, 0})
                .withMetrics(new int[]{-1, 0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1, filterAndValues2})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(report);
    }

    @Test
    public void testReportWithCrosstab() {
        String report = "Report with crosstab 123";

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{-1, 0});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1, 0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{-1, 0})
                .withMetrics(new int[]{-1, 0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1, filterAndValues2})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(report);
    }
}
