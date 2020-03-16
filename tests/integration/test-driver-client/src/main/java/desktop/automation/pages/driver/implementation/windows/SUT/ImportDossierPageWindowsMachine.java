package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierBookmark;
import desktop.automation.elementWrappers.DossierChapterAndPages;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.driver.implementations.windows.DossierBookmarkWindowsMachine;
import desktop.automation.elementWrappers.driver.implementations.windows.DossierVisualizationElemWindowsMachine;
import desktop.automation.pages.SUT.ImportDossierPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class ImportDossierPageWindowsMachine extends ImportDossierPage {
    private static final By DOSSIER_PANE_ELEM = By.xpath("//Pane/Pane[@Name='MicroStrategy for Office']/Pane");
    private static final By TABLE_OF_CONTENTS_MENU_ITEM_ELEM = By.xpath("//*[@LocalizedControlType='dialog'][not(starts-with(@Name, 'Bookmarks dialog'))]//ListItem/MenuItem");

    public ImportDossierPageWindowsMachine(Machine machine) {
        super(machine);
    }

    public WebDriverElemWrapper getDossierPaneElem(){
        return machine.waitAndFindElemWrapper(DOSSIER_PANE_ELEM);
    }

    @Override
    public void assertImportPopUpTitleIsAsExpected(String expectedDossierName) {
        getPopUpTitleElem(expectedDossierName);
    }

    public WebDriverElemWrapper getPopUpTitleElem(String dossierName){
        By selector = By.xpath(String.format(POP_UP_TITLE_ELEM_BASE, dossierName));
        return machine.waitAndFindElemWrapper(selector);
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
            String currName = curr.getAttribute("Name");

            if (currName.endsWith("chapter")) {
                DossierChapterAndPages tmp = new DossierChapterAndPages(currChapter, currPages);
                res.add(tmp);

                currChapter = curr;
                currPages = new ArrayList<>();
            }
            else if (currName.endsWith("page")) {
                currPages.add(curr);
            }
            else
                throw new RuntimeException("unrecognized and unexpected Name of table of contents menu item: " + currName);
        }

        res.add(new DossierChapterAndPages(currChapter, currPages));

        return res;
    }

    @Override
    public List<DossierBookmark> getBookmarks() {
        machine.waitAndFind(BOOKMARK_ROOT_ELEM);
        List<DossierBookmark> res = new ArrayList<>();

        for (WebElement rawBookmark : machine.driver.findElements(BOOKMARK_ROOT_ELEM)) {
            res.add(new DossierBookmarkWindowsMachine(new WebDriverElemWrapper(rawBookmark), machine));
        }

        return res;
    }

    @Override
    public List<DossierVisualizationElem> getDossierVisualizationElems(){
        machine.focusOnPromptPopUpFrameForBrowser();
        List<WebElement> elements = machine.driver.findElements(VISUALIZATION_ROOT_ELEM);

        List<DossierVisualizationElem> res = new ArrayList<>();
        for (WebElement element : elements)
            res.add(new DossierVisualizationElemWindowsMachine(new WebDriverElemWrapper(element), machine));

        return res;
    }

    private List<WebElement> getAllTableOfContentsMenuItemElems(){
        return machine.driver.findElements(TABLE_OF_CONTENTS_MENU_ITEM_ELEM);
    }
}
