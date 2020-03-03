package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierChapterAndPages;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.ImportDossierPageSelectors;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public abstract class ImportDossierPage extends ImportDossierPageSelectors {
    protected Machine machine;

    public ImportDossierPage(Machine machine) {
        this.machine = machine;
    }

    public abstract void assertImportPopUpTitleIsAsExpected(String expectedObjectName);

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

    public WebElement findLoadingSpinner(){
        return machine.driver.findElement(DOSSIER_LOADING_SPINNER_ELEM);
    }
}
