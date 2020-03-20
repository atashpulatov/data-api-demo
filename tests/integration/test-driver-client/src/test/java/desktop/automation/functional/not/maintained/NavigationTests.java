package desktop.automation.functional.not.maintained;

import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Ignore;
import org.junit.Test;

public class NavigationTests extends BaseLoggedInTests {

    //TC40353
    //TODO TC40354 cancel button
    @Ignore
    @Test
    public void navigationWihtoutPrepareDataImportBackAndCancel(){
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getHierarchyPromptPage().getBackBtnElem().click();

        machine.getImportPromptPage().getSearchBarElem().clear();
        machine.getImportPromptPage().getSearchBarElemAndSendKeys("Report with prompt");
        machine.getImportPromptPage().getNameHeaderElem().click();

//        machine.getImportPromptPage().assertOnlyTargetObjectSelected(report);

        //TODO start TC40354
        machine.getImportPromptPage().getImportBtnElem().click();
        machine.getHierarchyPromptPage().getCancelBtnElem().click();

        machine.getHierarchyPromptPage().assertPromptNotOpen();
        machine.getImportPromptPage().assertPromptNotOpen();
    }


}
