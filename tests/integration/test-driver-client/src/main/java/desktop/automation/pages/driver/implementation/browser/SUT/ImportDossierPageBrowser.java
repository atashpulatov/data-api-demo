package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.DossierBookmark;
import desktop.automation.elementWrappers.DossierChapterAndPages;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.driver.implementations.browser.DossierBookmarkBrowser;
import desktop.automation.elementWrappers.driver.implementations.browser.DossierVisualizationElemBrowser;
import desktop.automation.pages.SUT.ImportDossierPage;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

import static junit.framework.TestCase.assertEquals;

public class ImportDossierPageBrowser extends ImportDossierPage {
    private static final By TABLE_OF_CONTENTS_MENU_ITEM_ELEM = By.cssSelector(".mstr-ArrowNavigableList li");

    public ImportDossierPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    public void assertImportPopUpTitleIsAsExpected(String expectedDossierName) {
        WebDriverElemWrapper popUpTitleElem = getPopUpTitleElem();

        assertEquals(expectedDossierName, popUpTitleElem.getText());
    }

    public WebDriverElemWrapper getPopUpTitleElem(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(POP_UP_TITLE_ELEM);
    }

    @Override
    public List<DossierChapterAndPages> getDossierChapterAndPagesListElems() {
        List<DossierChapterAndPages> res = new ArrayList<>();

        ListIterator<WebElement> chaptersPagesRaw = getAllTableOfContentsMenuItemElems().listIterator();

        //This is written with the implication that 1)a dossier has at least one chapter 2)and the first menu item is a chapter. However this may not be the case.
        WebElement currChapter = chaptersPagesRaw.next();
        List<WebElement> currPages = new ArrayList<>();

        while (chaptersPagesRaw.hasNext()){
            WebElement curr = chaptersPagesRaw.next();
            String currClass = curr.getAttribute("class").trim();

            if (currClass.contains("mstrd-ToCDropdownMenuContainer-menuLevel1")) {
                DossierChapterAndPages tmp = new DossierChapterAndPages(currChapter, currPages);
                res.add(tmp);

                currChapter = curr;
                currPages = new ArrayList<>();
            }
            else if (currClass.contains("mstrd-ToCDropdownMenuContainer-menuLevel2")) {
                currPages.add(curr);
            }
            else
                throw new RuntimeException("unrecognized and unexpected class of table of contents menu item: " + currClass);
        }

        res.add(new DossierChapterAndPages(currChapter, currPages));

        return res;
    }

    @Override
    public List<DossierBookmark> getBookmarks() {
        machine.waitAndFind(BOOKMARK_ROOT_ELEM);
        List<DossierBookmark> res = new ArrayList<>();

        for (WebElement rawBookmark : machine.driver.findElements(BOOKMARK_ROOT_ELEM)) {
            res.add(new DossierBookmarkBrowser(new WebDriverElemWrapper(rawBookmark), machine));
        }

        return res;
    }

    @Override
    public List<DossierVisualizationElem> getDossierVisualizationElems(){
        machine.focusOnPromptPopUpFrameForBrowser();
        List<WebElement> elements = machine.driver.findElements(VISUALIZATION_ROOT_ELEM);

        List<DossierVisualizationElem> res = new ArrayList<>();
        for (WebElement element : elements)
            res.add(new DossierVisualizationElemBrowser(new WebDriverElemWrapper(element), machine));

        return res;
    }

    private List<WebElement> getAllTableOfContentsMenuItemElems(){
        return machine.driver.findElements(TABLE_OF_CONTENTS_MENU_ITEM_ELEM);
    }

    public void waitForDossierFrameToBeReady() {
        waitForDossierFrameToBeReady(machine.TWO_UNITS);
    }

    public void waitForDossierFrameToBeReady(WebDriverWait wait){
        wait.until(getDossierFrameReadyExpectedCondition());
    }

    private ExpectedCondition<Boolean> getDossierFrameReadyExpectedCondition(){
        return new ExpectedCondition<Boolean>() {
            @NullableDecl
            @Override
            public Boolean apply(@NullableDecl WebDriver driver) {
                //condition implies that at least one visualization is present in view
                if (getDossierVisualizationElems().isEmpty())
                    return false;

                try {
                    findLoadingSpinner();
                    return false;
                } catch (org.openqa.selenium.NoSuchElementException e){
                    return true;
                }
            }
        };
    }
}
