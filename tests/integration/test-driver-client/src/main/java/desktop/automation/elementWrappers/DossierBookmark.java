package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.selectors.helpers.DossierBookmarkSelectors;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public abstract class DossierBookmark extends DossierBookmarkSelectors {
    protected Machine machine;
    protected WebDriverElemWrapper bookmarkRootElem;
    private static SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy HH:mm a");

    public DossierBookmark(WebDriverElemWrapper bookmarkRootElem, Machine machine) {
        this.bookmarkRootElem = bookmarkRootElem;
        this.machine = machine;
    }

    public abstract WebDriverElemWrapper getBookmarkNameElem();

    public abstract WebDriverElemWrapper getBookmarkDateElem();

    public Date getBookmarkDate() throws ParseException {
        String raw = getBookmarkDateElem().getDriverElement().getText();

        return format.parse(raw);
    }

    public WebDriverElemWrapper getBookmarkRootElem() {
        return bookmarkRootElem;
    }
}
