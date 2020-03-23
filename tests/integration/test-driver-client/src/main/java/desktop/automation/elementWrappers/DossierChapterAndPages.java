package desktop.automation.elementWrappers;

import desktop.automation.selectors.helpers.DossierChapterAndPagesSelectors;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.stream.Collectors;

public class DossierChapterAndPages extends DossierChapterAndPagesSelectors {
    private WebDriverElemWrapper chapterElem;
    private List<WebDriverElemWrapper> pageElems;

    public DossierChapterAndPages(WebElement chapterElem, List<WebElement> pageElems) {
        this.chapterElem = new WebDriverElemWrapper(chapterElem);
        this.pageElems = pageElems.stream().map(WebDriverElemWrapper::new).collect(Collectors.toList());
    }

    public WebDriverElemWrapper getPageByTitle(String targetTitle){
        for (WebDriverElemWrapper pageElem : pageElems)
            if (pageElem.getText().equals(targetTitle))
                return pageElem;

        return null;
    }

    public WebDriverElemWrapper getChapterElem() {
        return chapterElem;
    }

    public List<WebDriverElemWrapper> getPageElems() {
        return pageElems;
    }
}
