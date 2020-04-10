package notToBeRunAsPartOfTestSuite;

import desktop.automation.elementWrappers.DossierBookmark;
import desktop.automation.elementWrappers.DossierChapterAndPages;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

import java.text.ParseException;
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

        if (!machine.isWindowsMachine()) {
            try {
                Thread.sleep(10_000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        List<DossierVisualizationElem> dossierVisualizationElems = machine.getImportDossierPage().getDossierVisualizationElems();
        System.out.println("dossierVisualizationElems.size() = " + dossierVisualizationElems.size());
        for (DossierVisualizationElem dossierVisualizationElem : dossierVisualizationElems) {
            System.out.println("dossierVisualizationElem.getTitleElem() = " + dossierVisualizationElem.getTitleElem().getDriverElement().getText());
            dossierVisualizationElem.clickImportRadioBtnElem();
        }

        List<DossierChapterAndPages> dossierChapterAndPages = machine.getImportDossierPage().openTableOfContentsAndGetDossierChapterAndPagesListElems();

        for (DossierChapterAndPages dossierChapterAndPage : dossierChapterAndPages) {
            System.out.println("dossierChapterAndPage.getChapterElem().getText() = " + dossierChapterAndPage.getChapterElem().getDriverElement().getText());
            for (WebDriverElemWrapper pageElem : dossierChapterAndPage.getPageElems()) {
                System.out.println("pageElem.getText() = " + pageElem.getDriverElement().getText());
            }
        }

        machine.getImportDossierPage().getBookmarksBtnElem().click();
        machine.getImportDossierPage().getFiltersBtnElem().click();
        machine.getImportDossierPage().getRepromptBtnElem().click();
        machine.getImportDossierPage().getResetBtnElem().click();
    }

    @Test
    public void test2() throws InterruptedException {
        String dossier = "Investment Firm Dossier";
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(dossier)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();
        Thread.sleep(10_000);

        List<DossierChapterAndPages> dossierChapterAndPages = machine.getImportDossierPage().openTableOfContentsAndGetDossierChapterAndPagesListElems();

        for (DossierChapterAndPages dossierChapterAndPage : dossierChapterAndPages) {
            System.out.println("dossierChapterAndPage.getChapterElem().getText() = " + dossierChapterAndPage.getChapterElem().getDriverElement().getText());
            for (WebDriverElemWrapper pageElem : dossierChapterAndPage.getPageElems()) {
                System.out.println("pageElem.getText() = " + pageElem.getDriverElement().getText());
            }
        }
    }

    @Test
    public void test3() throws ParseException, InterruptedException {
        String dossier = "Prompted dossier";
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(dossier)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();
        Thread.sleep(10_000);

        List<DossierBookmark> dossierBookmarks = machine.getImportDossierPage().openBookmarksAndGetBookmarks();
        for (DossierBookmark dossierBookmark : dossierBookmarks) {
            System.out.println("dossierBookmark.getBookmarkNameElem().getText() = " + dossierBookmark.getBookmarkNameElem().getDriverElement().getText());
            System.out.println("dossierBookmark.getBookmarkDate() = " + dossierBookmark.getBookmarkDate());
        }

        dossierBookmarks.get(1).getBookmarkRootElem().click();
        Thread.sleep(5_000);
        System.out.println();
    }

    @Test
    public void test4() throws InterruptedException, ParseException {
//        String dossier = "Prompted dossier";
//        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
//                .isFirstImport(true)
//                .withObjectName(dossier)
//                .build();
//        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
//        machine.getImportPromptPage().getImportBtnElem().click();
//
//        Thread.sleep(3_000);

//        By target = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup/AXPopUpButton[@AXDescription='Table of Contents']");
//        By target = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup/AXPopUpButton[@AXDescription='Bookmarks']");
//        By target = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup/AXGroup/AXPopUpButton[@AXDescription='Reset']");
//        By target = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup/AXPopUpButton[@AXDescription='Re-Prompt']");
//        WebElement targetElem = machine.waitAndFind(target);
//        targetElem.click();


        //target.getAttribute("AXDOMIdentifier") = *lK65*kK81*x1*t1583081119851

//        machine.getImportDossierPage().getDossierVisualizationElems();

//        List<DossierChapterAndPages> dossierChapterAndPagesListElems = machine.getImportDossierPage().getDossierChapterAndPagesListElems();
//        for (DossierChapterAndPages dossierChapterAndPagesListElem : dossierChapterAndPagesListElems) {
//            System.out.println("dossierChapterAndPagesListElem.getChapterElem().getDriverElement().getAttribute(\"AXDescription\") = " + dossierChapterAndPagesListElem.getChapterElem().getDriverElement().getAttribute("AXDescription"));
//            for (WebDriverElemWrapper pageElem : dossierChapterAndPagesListElem.getPageElems()) {
//                System.out.println("pageElem.getDriverElement().getAttribute(\"AXDescription\") = " + pageElem.getDriverElement().getAttribute("AXDescription"));
//            }
//        }

//        machine.getImportDossierPage().getBookmarks();

//        By selector = By.xpath("//Pane/Pane[@Name='MicroStrategy for Office']/Pane");
//        List<WebElement> elements = machine.driver.findElements(selector);
//        for (WebElement element : elements) {
//            System.out.println("element.getText() = " + element.getText());
//            System.out.println("element.getLocation() = " + element.getLocation());
//            System.out.println("element.getSize() = " + element.getSize());
//        }
        //202 t:205 r:1720 b:854

//        List<DossierVisualizationElem> dossierVisualizationElems = machine.getImportDossierPage().getDossierVisualizationElems();
//        System.out.println("dossierVisualizationElems.size() = " + dossierVisualizationElems.size());
//        for (DossierVisualizationElem dossierVisualizationElem : dossierVisualizationElems) {
//            System.out.println("dossierVisualizationElem.getTitleElem().getText() = " + dossierVisualizationElem.getTitleElem().getText());
//            dossierVisualizationElem.clickImportRadioBtnElem();
//        }


//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]");
////        By selector = By.xpath("//*[@LocalizedControlType='dialog']");
////        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')][@AriaRole='dialog']");
////        By selector = By.xpath("//*[@AriaRole='dialog']");
//        long start = System.currentTimeMillis();
//        RemoteWebElement target = machine.waitAndFind(selector);
//        System.out.println("System.currentTimeMillis() = " + (System.currentTimeMillis() - start));
//        System.out.println("target.getText() = " + target.getText());

//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]//MenuItem"); //20162
//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]//ListItem"); //20151
//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]//ListItem//MenuItem"); //18839 //20448
//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]//ListItem/MenuItem"); //19027
//        By selector = By.xpath("//*[@LocalizedControlType='dialog']//ListItem//MenuItem"); //19058
//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]//Group//List//ListItem//MenuItem"); //19542
//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]/Group/List/ListItem/MenuItem"); //21792 //20167

//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]//ListItem//MenuItem"); //17293
//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]//ListItem/MenuItem"); //17069
//        long start = System.currentTimeMillis();
//        List<WebElement> elements = machine.driver.findElements(selector);
//        System.out.println("(System.currentTimeMillis() - start) = " + (System.currentTimeMillis() - start));
//        System.out.println("elements.size() = " + elements.size());
//        System.out.println("elements.get(0).getText() = " + elements.get(0).getText());

//        By selector = By.xpath("//Button[@Name='Add New']");
//        long start = System.currentTimeMillis();
//        List<WebElement> elements = machine.driver.findElements(selector);
//        System.out.println("(System.currentTimeMillis() - start) = " + (System.currentTimeMillis() - start));
//        System.out.println("elements.size() = " + elements.size());

//        List<DossierBookmark> bookmarks = machine.getImportDossierPage().getBookmarks();
//        System.out.println("bookmarks.size() = " + bookmarks.size());
//        for (DossierBookmark bookmark : bookmarks) {
////            System.out.println("bookmark.getBookmarkRootElem().getText() = " + bookmark.getBookmarkRootElem().getText());
////            machine.printChildren((RemoteWebElemennt) bookmark.getBookmarkRootElem().getDriverElement());
//
//            System.out.println("bookmark.getBookmarkNameElem().getText() = " + bookmark.getBookmarkNameElem().getText());
//            System.out.println("bookmark.getBookmarkDate() = " + bookmark.getBookmarkDate());
//        }

//        By selector = By.xpath("//*[@LocalizedControlType='dialog'][not(starts-with(@Name, 'Bookmarks dialog'))]//ListItem/MenuItem"); //17069
//        long start = System.currentTimeMillis();
//        List<WebElement> elements = machine.driver.findElements(selector);
//        System.out.println("(System.currentTimeMillis() - start) = " + (System.currentTimeMillis() - start));
//        System.out.println("elements.size() = " + elements.size());
//        for (WebElement element : elements) {
//            System.out.println("element.getAttribute(\"Name\") = " + element.getAttribute("Name"));
//            System.out.println("element.getText() = " + element.getText());
//            System.out.println("element.getLocation() = " + element.getLocation());
//            System.out.println("element.getSize() = " + element.getSize());
//            System.out.println();
//        }

        List<DossierChapterAndPages> dossierChapterAndPages = machine.getImportDossierPage().getDossierChapterAndPagesListElems();
        for (DossierChapterAndPages dossierChapterAndPage : dossierChapterAndPages) {
            System.out.println("dossierChapterAndPage.getChapterElem().getText() = " + dossierChapterAndPage.getChapterElem().getDriverElement().getAttribute("Name"));
            for (WebDriverElemWrapper pageElem : dossierChapterAndPage.getPageElems()) {
                System.out.println("pageElem.getText() = " + pageElem.getDriverElement().getAttribute("Name"));
            }
        }
    }
}
