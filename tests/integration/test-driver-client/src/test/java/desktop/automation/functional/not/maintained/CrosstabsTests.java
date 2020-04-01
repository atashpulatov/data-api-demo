package desktop.automation.functional.not.maintained;

import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Ignore;
import org.junit.Test;

public class CrosstabsTests extends BaseLoggedInTests {

    //TODO TC48534
    @Ignore
    @Test
    public void prepareDataCrosstabs(){
        String report = ""; //TODO name

        //TODO prep data flow args
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{})
                .withMetrics(new int[]{})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{})
                .build();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        //TODO expected values
        String[][] expectedCellValues = {
                {"", ""},
                {"", ""},
                {"", ""},
                {"", ""},
                {"", ""}
        };

        machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.getMainPage().assertCellValues(expectedCellValues);
    }
}
