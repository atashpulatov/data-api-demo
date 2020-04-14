package desktop.automation.elementWrappers.driver.implementations.windows;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierBookmark;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

import java.util.List;

public class DossierBookmarkWindowsMachine extends DossierBookmark {

    public DossierBookmarkWindowsMachine(WebDriverElemWrapper bookmarkRootElem, Machine machine) {
        super(bookmarkRootElem, machine);
    }

    @Override
    public WebDriverElemWrapper getBookmarkNameElem(){
        return new WebDriverElemWrapper(getBookmarkChildrenElems().get(0));
    }

    @Override
    public WebDriverElemWrapper getBookmarkDateElem(){
        return new WebDriverElemWrapper(getBookmarkChildrenElems().get(1));
    }

    private List<WebElement> getBookmarkChildrenElems(){
        List<WebElement> res = machine.getChildren((RemoteWebElement) bookmarkRootElem.getDriverElement());
        res.remove(0);

        return res;
    }
}
