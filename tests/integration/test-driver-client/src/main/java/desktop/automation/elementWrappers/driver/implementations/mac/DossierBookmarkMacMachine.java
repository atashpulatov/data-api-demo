package desktop.automation.elementWrappers.driver.implementations.mac;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierBookmark;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import org.openqa.selenium.By;

public class DossierBookmarkMacMachine extends DossierBookmark {
    private String bookmarkRootSelector;

    private static final String NAME_ELEM_SUFFIX = "/AXGroup[0]/AXGroup[0]/AXStaticText";
    private static final String DATE_ELEM_SUFFIX = "/AXGroup[1]/AXStaticText";


    public DossierBookmarkMacMachine(WebDriverElemWrapper bookmarkRootElem, Machine machine, String bookmarkRootSelector) {
        super(bookmarkRootElem, machine);
        this.bookmarkRootSelector = bookmarkRootSelector;
    }

    @Override
    public WebDriverElemWrapper getBookmarkNameElem(){
        String selector = bookmarkRootSelector + NAME_ELEM_SUFFIX;
        return machine.waitAndFindElemWrapper(By.xpath(selector));
    }

    @Override
    public WebDriverElemWrapper getBookmarkDateElem(){
        String selector = bookmarkRootSelector + DATE_ELEM_SUFFIX;
        return machine.waitAndFindElemWrapper(By.xpath(selector));
    }

}
