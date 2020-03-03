package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.DossierChapterAndPages;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.ImportDossierPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

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
    public void assertImportPopUpTitleIsAsExpected(String expectedObjectName) {
        WebDriverElemWrapper popUpTitleElem = getPopUpTitleElem();

        assertEquals(expectedObjectName, popUpTitleElem.getText());
    }

    public WebDriverElemWrapper getPopUpTitleElem(){
        machine.focusOnImportDataPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(POP_UP_TITLE_ELEM);
    }

    @Override
    public List<DossierVisualizationElem> getDossierVisualizationElems() {
        machine.focusOnPromptPopUpFrameForBrowser();
        List<WebElement> elements = machine.driver.findElements(VISUALIZATION_ROOT_ELEM);

        List<DossierVisualizationElem> res = new ArrayList<>();
        for (WebElement element : elements)
            res.add(new DossierVisualizationElem(new WebDriverElemWrapper(element), machine));

        return res;
    }

    @Override
    public List<DossierChapterAndPages> getDossierChapterAndPagesListElems() {
        List<DossierChapterAndPages> res = new ArrayList<>();

        ListIterator<WebElement> iter = getAllTableOfContentsMenuItemElems().listIterator();

        //This is written with the implication that 1)a dossier has at least one chapter 2)and the first menu item is a chapter. However this may not be the case.
        WebElement currChapter = iter.next();
        List<WebElement> currPages = new ArrayList<>();

        while (iter.hasNext()){
            WebElement curr = iter.next();
            String currClass = curr.getAttribute("class").trim();

            switch (currClass){
                case "mstrd-ToCDropdownMenuContainer-menuLevel1":
                    DossierChapterAndPages tmp = new DossierChapterAndPages(currChapter, currPages);
                    res.add(tmp);

                    currChapter = curr;
                    currPages = new ArrayList<>();
                    break;
                case "mstrd-ToCDropdownMenuContainer-menuLevel2":
                    currPages.add(curr);
                    break;
                default:
                    throw new IllegalArgumentException("unrecognized and unexpected class of table of contents menu item: " + currClass);
            }
        }

        res.add(new DossierChapterAndPages(currChapter, currPages));

        return res;
    }

    private List<WebElement> getAllTableOfContentsMenuItemElems(){
        return machine.driver.findElements(TABLE_OF_CONTENTS_MENU_ITEM_ELEM);
    }
}
