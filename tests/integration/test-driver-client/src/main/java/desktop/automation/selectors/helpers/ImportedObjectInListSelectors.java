package desktop.automation.selectors.helpers;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class ImportedObjectInListSelectors {
    protected static final By IMPORTED_OBJECT_DATE_ELEM;
    protected static final By IMPORTED_REPORT_ICON_ELEM;
    protected static final By IMPORTED_DATASET_ICON_ELEM;
    protected static final By IMPORTED_OBJECT_NAME_ELEM;
    protected static final By IMPORTED_OBJECT_EDIT_NAME_ELEM;
    protected static final By IMPORTED_OBJECT_DUPLICATE_ELEM;
    protected static final By IMPORTED_OBJECT_EDIT_ELEM;
    protected static final By IMPORTED_OBJECT_REFRESH_ELEM;
    protected static final By IMPORTED_OBJECT_DELETE_ELEM;

    protected static final By CONTEXT_MENU_COPY_NAME_BTN;

    static{
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                IMPORTED_OBJECT_DATE_ELEM = null;
                IMPORTED_REPORT_ICON_ELEM = null;
                IMPORTED_DATASET_ICON_ELEM = null;
                IMPORTED_OBJECT_NAME_ELEM = By.cssSelector(".rename-container");
                IMPORTED_OBJECT_EDIT_NAME_ELEM = By.xpath("//input");
                IMPORTED_OBJECT_DUPLICATE_ELEM = null;
                IMPORTED_OBJECT_EDIT_ELEM = By.cssSelector("span[aria-label=\"Edit button\"]");
                IMPORTED_OBJECT_REFRESH_ELEM = By.cssSelector("span[aria-label=\"Refresh button\"]");
                IMPORTED_OBJECT_DELETE_ELEM = By.cssSelector("span[aria-label=\"Delete button\"]");
                CONTEXT_MENU_COPY_NAME_BTN = By.xpath("//ul[@role=\"menu\"]/li[text()=\"Copy Name\"]");
                break;
            case MAC_DESKTOP:
                IMPORTED_OBJECT_DATE_ELEM = By.xpath(".//AXGroup[0]/AXStaticText");
                IMPORTED_REPORT_ICON_ELEM = null;
                IMPORTED_DATASET_ICON_ELEM = null;
                IMPORTED_OBJECT_NAME_ELEM = null;
                IMPORTED_OBJECT_EDIT_NAME_ELEM = By.xpath(".//AXTextField");
                IMPORTED_OBJECT_DUPLICATE_ELEM = By.xpath(".//AXButton[0]");
                IMPORTED_OBJECT_EDIT_ELEM = By.xpath(".//AXButton[1]");
                IMPORTED_OBJECT_REFRESH_ELEM = By.xpath(".//AXButton[2]");
                IMPORTED_OBJECT_DELETE_ELEM = By.xpath(".//AXButton[3]");
                CONTEXT_MENU_COPY_NAME_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXMenu[0]/AXMenuItem[@AXTitle='Copy Name']");
                break;
            case WINDOWS_DESKTOP:
                IMPORTED_OBJECT_DATE_ELEM = null;
                IMPORTED_REPORT_ICON_ELEM = By.xpath(".//*[@AutomationId='icon_Report']");
                IMPORTED_DATASET_ICON_ELEM = By.xpath(".//*[@AutomationId='icon_Dataset']");
                IMPORTED_OBJECT_NAME_ELEM = By.xpath(".//*[@LocalizedControlType='text'][2]");
                IMPORTED_OBJECT_EDIT_NAME_ELEM = By.tagName("Edit");
                IMPORTED_OBJECT_DUPLICATE_ELEM = By.xpath(".//*[@AutomationId='duplicate']");//TODO implied selector confirm functionality
                IMPORTED_OBJECT_EDIT_ELEM = By.xpath(".//*[@AutomationId='icon_edit_pencil']");
                IMPORTED_OBJECT_REFRESH_ELEM = By.xpath(".//*[@AutomationId='refresh']");
                IMPORTED_OBJECT_DELETE_ELEM = By.xpath(".//*[@AutomationId='trash']");
                CONTEXT_MENU_COPY_NAME_BTN = By.name("Copy Name");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }

}
