package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierBookmark;
import desktop.automation.elementWrappers.DossierChapterAndPages;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.ImportDossierPageSelectors;
import org.openqa.selenium.WebElement;

import java.util.List;

public abstract class ImportDossierPage extends ImportDossierPageSelectors {
    protected Machine machine;

    public ImportDossierPage(Machine machine) {
        this.machine = machine;
    }

    public abstract void assertImportPopUpTitleIsAsExpected(String expectedDossierName);

    public WebDriverElemWrapper getTableOfContentsBtnElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(NAV_BAR_TABLE_OF_CONTENTS_BTN_ELEM);
    }

    public WebDriverElemWrapper getBookmarksBtnElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(NAV_BAR_BOOKMARKS_BTN_ELEM);
    }

    public WebDriverElemWrapper getResetBtnElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(NAV_BAR_RESET_BTN_ELEM);
    }

    public WebDriverElemWrapper getRepromptBtnElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(NAV_BAR_REPROMPT_BTN_ELEM);
    }

    public WebDriverElemWrapper getDossierViewTitleElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(DOSSIER_VIEW_TITLE_ELEM);
    }

    public WebDriverElemWrapper getFiltersBtnElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(NAV_BAR_FILTERS_BTN_ELEM);
    }

    public WebDriverElemWrapper getAddToLibraryBtnElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFindElemWrapper(ADD_TO_LIBRARY_BTN_ELEM);
    }

    public abstract List<DossierVisualizationElem> getDossierVisualizationElems();

    public List<DossierChapterAndPages> openTableOfContentsAndGetDossierChapterAndPagesListElems(){
        getTableOfContentsBtnElem().click();
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return getDossierChapterAndPagesListElems();
    }

    public abstract List<DossierChapterAndPages> getDossierChapterAndPagesListElems();

    public WebElement findLoadingSpinner(){
        return machine.driver.findElement(DOSSIER_LOADING_SPINNER_ELEM);
    }

    public WebDriverElemWrapper getAddNewBookMarkBtnWithBookmarksElem(){
        return machine.waitAndFindElemWrapper(ADD_NEW_BOOKMARK_BTN_WITH_BOOKMARKS);
    }

    public WebDriverElemWrapper getAddNewBookMarkBtnNoBookmarksElem(){
        return machine.waitAndFindElemWrapper(ADD_NEW_BOOKMARK_BTN_NO_BOOKMARKS);
    }

    public List<DossierBookmark> openBookmarksAndGetBookmarks(){
        getBookmarksBtnElem().click();
        return getBookmarks();
    }

    public abstract List<DossierBookmark> getBookmarks();
}
