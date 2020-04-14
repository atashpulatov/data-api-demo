package desktop.automation.functional.not.maintained;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.driver.implementations.ImportObject;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import io.appium.java_client.windows.WindowsDriver;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.Keys;

import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.IOException;
import java.util.List;

public class OtherTests extends BaseLoggedInTests {



    //TODO TC41091



    //TC41093
    @Test
    public void refreshTwoObjects() {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(ImportPrepareDataHelperArgumments.DEFAULT_LARGE_REPORT)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withObjectName(ImportPrepareDataHelperArgumments.DEFAULT_LARGE_DATASET)
                .isFirstImport(false)
                .withCell("AA1")
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        List<ImportedObjectInList> importedObjs = machine.getMainPage().getImportedObjectsInList();
        String[] names = Machine.getObjectNameArrayFromImportedObjectList(importedObjs);

        machine.getMainPage().getRefreshAllBtnElem().click();
        machine.getRefreshAllPopUpPage().assertRefreshAllFlow(names);
    }

    //TC41094
    @Ignore
    @Test
    public void refreshTenObjects(){
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        for (int i = 0; i < 9; i++) {
            argumments = new ImportPrepareDataHelperArgumments.Builder(machine, i % 2 == 0)
                    .isFirstImport(false)
                    .withCell((char)((int)'A' + i) + "A1")
                    .build();
            ImportPrepareDataHelper.importObject(argumments);
        }

        List<ImportedObjectInList> importedObjs = machine.getMainPage().getImportedObjectsInList();

        machine.getMainPage().getRefreshAllBtnElem().click();

//        machine.getRefreshPromptPage().waitUntilRefreshCompleteMessageNotPresent(); //TODO implement new method waitUntilElementNoLongerPresent
//        List<RefreshedObjectInlist> refreshedObjectsList = machine.getRefreshPromptPage().getRefreshedObjectsList();
//        assertEquals(importedObjs.size(), refreshedObjectsList.size());
//
//        for (int i = 0; i < refreshedObjectsList.size(); i++) {
//            RefreshedObjectInlist refreshedObjectInlist = refreshedObjectsList.get(i);
//
//            assertEquals(importedObjs.get(i).getNameElem().getText(), refreshedObjectInlist.getNameElem().getText());
//        }
    }

    //TC41102
    @Test
    public void deleteSheet() throws InterruptedException {
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

        machine.contextClickElem(machine.getPreSUTPage().getSheetTabElemByIndex(2).getDriverElement());
        machine.getPreSUTPage().getSheetDeleteContextMenuElem().click();
        machine.getPreSUTPage().getDeleteSheetPromptDeleteBtnElem().click();
        Thread.sleep(1_000);

        List<ImportedObjectInList> importedObjs = machine.getMainPage().getImportedObjectsInList();
        String[] names = Machine.getObjectNameArrayFromImportedObjectList(importedObjs);

        machine.getMainPage().getRefreshAllBtnElem().click();
        machine.getRefreshAllPopUpPage().assertRefreshAllFlow(names);
    }





    //TC48799 //TODO old test case implementation
    @Ignore
    @Test
    public void moreItemsContextMenu() throws InterruptedException, IOException, UnsupportedFlavorException {
        Thread.sleep(3_000);
        machine.getMainPage().getMoreItemsMenuElem().click();

//        assertEquals("A", machine.getMoreItemMenuPage().getUserInitialElem().getText());
//        assertEquals("a", machine.getMoreItemMenuPage().getUserNameTextElem().getText());
//
//        WebElement privacyPolicyBtn = machine.getMoreItemMenuPage().getPrivacyPolicyBtnElem();
//        WebElement termsOfUseBtn = machine.getMoreItemMenuPage().getTermsOfUseBtnElem();
//        machine.getMoreItemMenuPage().getContacUsBtnElem();
//        machine.getMoreItemMenuPage().getLogOutBtnElem();
//        machine.getMoreItemMenuPage().getVersionNumberElem();
//
//        privacyPolicyBtn.click();
//        machine.getBrowser().getAddressBarElem().assertPrivacyPolicyPageLoaded();
//        machine.getBrowser().close();
//        machine.getMainPage().getMoreItemsMenuElem(true).click();

        machine.getMoreItemMenuPage().getTermsOfUseBtnElem().click();
        machine.getMoreItemsMenuLinkPage().assertExpectedTermsOfServicePageUrlDisplayed();
        machine.getMainPage().getMoreItemsMenuElem().click();

        machine.getMoreItemMenuPage().getContacUsBtnElem().click();
        machine.getMoreItemMenuPage().getEmailPopUpTitleElem();
        AnyInterfaceElement target = machine.getMainPage().getMoreItemsMenuElem();
        target.click();
        target.click();

        machine.getMoreItemMenuPage().getContacUsBtnElem().click();
        machine.getMoreItemMenuPage().getEmailPopUpTitleElem();
        ((WindowsDriver) machine.driver).getKeyboard().sendKeys(Keys.ESCAPE);

        target = machine.getMainPage().getMoreItemsMenuElem();
        target.click();
        target.click();

        machine.getMoreItemMenuPage().getLogOutBtnElem().click();
        machine.getLoginPage().getStartLoginBtnElem();
    }


    //TODO TC39583
    @Ignore
    @Test
    public void viewSelected(){
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{-1, 1});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withImportObject(ImportObject.ONE_K_REPORT_VERSION_TWO)
                .withAttributes(new int[]{-1,5,4})
                .withMetrics(new int[]{-1, -1, -1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);

        machine.getPrepareDataPromptPage().getViewSelectedSwitch().click();

        //TODO map no data elems
        //TODO helper methods for the prepare data prompt results
    }

    //TODO TC39600
    @Ignore
    @Test
    public void dataPreview(){
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{0,2});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .isFirstImport(true)
                .withImportObject(ImportObject.ONE_K_REPORT_VERSION_TWO)
                .withAttributes(new int[]{2,4})
                .withMetrics(new int[]{-1,0,0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();
        ImportPrepareDataHelper.prepareDataWithoutImportingSimple(argumments);

        machine.getPrepareDataPromptPage().getDataPreviewBtn().click();

        machine.getDataPreviewPage().getTitleElem();
        machine.getDataPreviewPage().getOnlyTenRowsDisplayedWarningElem();

        String[] expectedCellValues = {
                "",
                "",
                ""
        };

        int[][] coordinates = {
                {0, 0},
                {1, 0},
                {9, 0}
        };

        int totalColCount = 4;
        machine.getDataPreviewPage().assertTableElemsAreAsExpected(expectedCellValues, coordinates, totalColCount);

        machine.getDataPreviewPage().getClosePreviewBtnElem().click();
        machine.getDataPreviewPage().assertTitleElemNotPresent();

        machine.getImportPromptPage().getCancelBtnElem().click();
        machine.getImportPromptPage().assertPromptNotOpen();
    }


    //        // edit template
    //        //TODO metrics, attrs, filters
    //        argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
    //                .withObjectName(report)
    //                .withMetrics(new int[]{})
    //                .withAttributes(new int[]{})
    //                .withFiltersAndValues(new FilterAndValues[]{new FilterAndValues(-1, new int[]{})})
    //                .build();
    //        ImportPrepareDataHelper.prepareDataSimple(argumments);
    //        Thread.sleep(5_000);
    //
    //        //assert that import succeeded
    //        machine.getMainPage().getImportedObjectInListElem(report);
    //
    //        //assert cell values
    //        //TODO values
    //        String[][] values = {
    //                {}
    //        };
    //        machine.getMainPage().assertCellValues(values);
}
