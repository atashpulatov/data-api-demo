package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierBookmark;
import desktop.automation.elementWrappers.DossierChapterAndPages;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.driver.implementations.mac.DossierBookmarkMacMachine;
import desktop.automation.elementWrappers.driver.implementations.mac.DossierVisualizationElemMacMachine;
import desktop.automation.exceptions.ElementNotFoundWhenIteratingOverBase;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.ImportDossierPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ImportDossierPageMacMachine extends ImportDossierPage {
    private static final String VISUALIZATION_PANE_LOCATOR_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[%d]";
    private static final String VISUALIZATION_CONTROL_CONTAINER_SUFFIX = "/AXGroup[1]/AXGroup[%d]/AXGroup[1]";
    private static final String CHAPTER_PAGES_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup[0]/AXList[0]/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[@AXSubrole='AXContentList']/AXGroup[%d]/AXMenuItem[0]";
    private static final String BOOKMARKS_ROOT_ELEM_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup[1]/AXGroup[0]/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[3]/AXGroup[@AXSubrole='AXContentList']/AXGroup[%d]/AXMenuItem[0]";

    public ImportDossierPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public void assertImportPopUpTitleIsAsExpected(String expectedDossierName) {
        throw new NotImplementedForDriverWrapperException();
    }

    @Override
    public List<DossierVisualizationElem> getDossierVisualizationElems() {
        String visualizationPaneLocator = getVisualizationPaneLocatorString();
        String visualizationNodeBase = visualizationPaneLocator + VISUALIZATION_CONTROL_CONTAINER_SUFFIX;

        List<WebElement> visualizationElemRaw = machine.iterateOverBaseUntilExceptionEncountered(visualizationNodeBase);

        List<DossierVisualizationElem> res = new ArrayList<>();
        int i = 0;
        for (WebElement element : visualizationElemRaw) {
            res.add(new DossierVisualizationElemMacMachine(new WebDriverElemWrapper(element), String.format(visualizationNodeBase, i++), machine));
        }

        return res;
    }

    private String getVisualizationPaneLocatorString(){
        String paneLocatorPatternString = "\\*l\\w\\d*\\*kK\\d*\\*x\\d*\\*t\\d*"; //matches *lKn*kKn*xn*tn, where n - integer value (optional) e.g. *lK65*kK81*x1*t1583081119851
        Pattern paneLocatorPattern = Pattern.compile(paneLocatorPatternString);

        for (int i = 6; i < 20; i++) {
            String resultCandidate = String.format(VISUALIZATION_PANE_LOCATOR_BASE, i);
            WebElement target = machine.waitAndFind(By.xpath(resultCandidate));

            String axdomIdentifierAttribute = target.getAttribute("AXDOMIdentifier");
            Matcher elementTargetAttributeMatcher = paneLocatorPattern.matcher(axdomIdentifierAttribute);

            if (elementTargetAttributeMatcher.matches()) {
                String formattedResultLocator = String.format("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='%s']", axdomIdentifierAttribute);
                return formattedResultLocator;
            }
        }
        throw new ElementNotFoundWhenIteratingOverBase("Failed to find Dossier visualization pane element, where the 'AXDOMIdentifier' attribute matches regex: " + paneLocatorPatternString);
    }

    @Override
    public List<DossierChapterAndPages> getDossierChapterAndPagesListElems() {
        List<DossierChapterAndPages> res = new ArrayList<>();

        ListIterator<WebElement> chaptersPagesRaw = machine.iterateOverBaseUntilExceptionEncountered(CHAPTER_PAGES_BASE).listIterator();

        //This is written with the implication that 1)a dossier has at least one chapter 2)and the first menu item is a chapter. However this may not be the case.
        WebElement currChapter = chaptersPagesRaw.next();
        List<WebElement> currPages = new ArrayList<>();

        while (chaptersPagesRaw.hasNext()){
            WebElement curr = chaptersPagesRaw.next();
            String currAxDescription = curr.getAttribute("AXDescription");

            if (currAxDescription.endsWith("chapter")) {
                DossierChapterAndPages tmp = new DossierChapterAndPages(currChapter, currPages);
                res.add(tmp);

                currChapter = curr;
                currPages = new ArrayList<>();
            }
            else if (currAxDescription.endsWith("page")) {
                currPages.add(curr);
            }
            else
                throw new RuntimeException("unrecognized and unexpected AXDescription of table of contents menu item: " + currAxDescription);
        }

        res.add(new DossierChapterAndPages(currChapter, currPages));

        return res;
    }

    @Override
    public List<DossierBookmark> getBookmarks() {
        List<DossierBookmark> res = new ArrayList<>();

        int i = 0;
        for (WebElement rawBookmark : machine.iterateOverBaseUntilExceptionEncountered(BOOKMARKS_ROOT_ELEM_BASE)) {
            res.add(new DossierBookmarkMacMachine(new WebDriverElemWrapper(rawBookmark), machine, String.format(BOOKMARKS_ROOT_ELEM_BASE, i++)));
        }

        return res;
    }
}
