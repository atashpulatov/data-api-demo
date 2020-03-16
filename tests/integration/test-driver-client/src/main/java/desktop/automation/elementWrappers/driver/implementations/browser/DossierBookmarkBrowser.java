package desktop.automation.elementWrappers.driver.implementations.browser;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierBookmark;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import org.openqa.selenium.By;

public class DossierBookmarkBrowser extends DossierBookmark {
    private static final By NAME_ELEM = By.cssSelector(".mstrd-BookmarkItem-name");
    private static final By DATE_ELEM = By.cssSelector(".mstrd-BookmarkItem-time");

    public DossierBookmarkBrowser(WebDriverElemWrapper bookmarkRootElem, Machine machine) {
        super(bookmarkRootElem, machine);
    }

    @Override
    public WebDriverElemWrapper getBookmarkNameElem(){
        return new WebDriverElemWrapper(bookmarkRootElem.getDriverElement().findElement(NAME_ELEM));
    }

    @Override
    public WebDriverElemWrapper getBookmarkDateElem(){
        return new WebDriverElemWrapper(bookmarkRootElem.getDriverElement().findElement(DATE_ELEM));
    }
}
