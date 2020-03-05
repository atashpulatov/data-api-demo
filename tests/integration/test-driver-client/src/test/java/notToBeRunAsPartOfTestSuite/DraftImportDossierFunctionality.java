package notToBeRunAsPartOfTestSuite;

import desktop.automation.elementWrappers.DossierChapterAndPages;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

import java.util.List;

public class DraftImportDossierFunctionality extends BaseLoggedInTests {

    @Test
    public void test(){
        String dossier = "Prompted dossier";
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(dossier)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        System.out.println("Dossier view title:");
        System.out.println(machine.getImportDossierPage().getDossierViewTitleElem().getDriverElement().getText());

        try {
            Thread.sleep(10_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        List<DossierVisualizationElem> dossierVisualizationElems = machine.getImportDossierPage().getDossierVisualizationElems();
        System.out.println("dossierVisualizationElems.size() = " + dossierVisualizationElems.size());
        for (DossierVisualizationElem dossierVisualizationElem : dossierVisualizationElems) {
            System.out.println("dossierVisualizationElem.getTitleElem() = " + dossierVisualizationElem.getTitleElem().getText());
            dossierVisualizationElem.getImportRadioBtnElem().click();
        }

        machine.getImportDossierPage().getTableOfContentsBtnElem().click();
        machine.getImportDossierPage().getBookmarksBtnElem().click();
        machine.getImportDossierPage().getFiltersBtnElem().click();
        machine.getImportDossierPage().getRepromptBtnElem().click();
        machine.getImportDossierPage().getResetBtnElem().click();
    }

    @Test
    public void test2(){
        String dossier = "Investment Firm Dossier";
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(dossier)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getImportDossierPage().waitForDossierFrameToBeReady();
        List<DossierChapterAndPages> dossierChapterAndPages = machine.getImportDossierPage().openTableOfContentsAndGetDossierChapterAndPagesListElems();

        for (DossierChapterAndPages dossierChapterAndPage : dossierChapterAndPages) {
            System.out.println("dossierChapterAndPage.getChapterElem().getText() = " + dossierChapterAndPage.getChapterElem().getDriverElement().getText());
            for (WebDriverElemWrapper pageElem : dossierChapterAndPage.getPageElems()) {
                System.out.println("pageElem.getText() = " + pageElem.getDriverElement().getText());
            }
        }
    }


}
