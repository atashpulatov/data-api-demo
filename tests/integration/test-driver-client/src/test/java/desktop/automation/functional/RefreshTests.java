package desktop.automation.functional;

import desktop.automation.driver.wrappers.DriverType;
import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.pages.driver.implementation.mac.SUT.MainPageMacMachine;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Ignore;
import org.junit.Test;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class RefreshTests extends BaseLoggedInTests {

    //TC51722
    @Ignore
    @Test
    public void refreshRePromptedReport(){
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();
        machine.getHierarchyPromptPage().answerPromptCorretly();

        machine.getMainPage().getImportedObjectInListNameElem(report);
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.getRepromptBtnElem().click();

        machine.getHierarchyPromptPage().getRemoveAllBtnElem().click();
        machine.getHierarchyPromptPage().getImportObjectElems().get(0).click();
        machine.getHierarchyPromptPage().getAddBtnElem().click();
        machine.getHierarchyPromptPage().getRunBtnElem().click();
        if (DESIRED_DRIVER_TYPE.equals(DriverType.MAC_DESKTOP))
            ((MainPageMacMachine)machine.getMainPage()).waitForDialogOpenNotificationToAppearAndDisappears();

        machine.getMainPage().getImportedObjectInListNameElem(report);

        //refresh
//        machine.getRefreshPromptPage().refreshObjectAndAssertFlow(0, report, false, 10);
        importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.getRefreshBtnElem().click();
        machine.getImportingDataSingleRefreshPopUpPage().assertRefreshSingleFlow(false);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"D33", "433 233"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

}
