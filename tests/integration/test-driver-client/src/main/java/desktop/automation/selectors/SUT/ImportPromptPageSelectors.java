package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class ImportPromptPageSelectors {
    protected static final By TITLE;
    protected static final By MY_LIBRARY_LBL_ELEM;
    protected static final By MY_LIBRARY_SWITCH_ELEM;
    protected static final By REFRESH_BTN_ELEM;
    protected static final By FILTERS_BTN_ELEM;
    protected static final By IMPORT_BTN_ELEM;
    protected static final By SEARCH_BAR_ELEM;
    protected static final By PREPARE_DATA_BTN_ELEM;
    protected static final By CANCEL_BTN_ELEM;
    protected static final By NAME_HEADER_ELEM;
    protected static final By OWNER_HEADER_ELEM;
    protected static final By APPLICATION_HEADER_ELEM;
    protected static final By MODIFIED_HEADER_ELEM;
    protected static final By OBJECT_TO_IMPORT_FIRST;
    protected static final String OBJECT_TO_IMPORT_BASE_BY_NAME;

    protected static final String TITLE_IMAGE;

    static {
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                TITLE = By.cssSelector(".navigation_tree__title_bar > span");
                MY_LIBRARY_LBL_ELEM = null;
                MY_LIBRARY_SWITCH_ELEM = By.cssSelector("div[aria-label='My Library']");
                REFRESH_BTN_ELEM = null;
                FILTERS_BTN_ELEM = null;
                IMPORT_BTN_ELEM = By.id("import");
                SEARCH_BAR_ELEM = By.cssSelector(".search-field__input");
                PREPARE_DATA_BTN_ELEM = By.id("prepare");
                CANCEL_BTN_ELEM = By.id("cancel");
                NAME_HEADER_ELEM = By.cssSelector("span[title='Name']");
                OWNER_HEADER_ELEM = null;
                APPLICATION_HEADER_ELEM = null;
                MODIFIED_HEADER_ELEM = null;
                OBJECT_TO_IMPORT_FIRST = null;
                OBJECT_TO_IMPORT_BASE_BY_NAME = null;

                TITLE_IMAGE = null;
                break;
            case MAC_DESKTOP:
                TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='Import data']");
                MY_LIBRARY_LBL_ELEM = By.xpath("TODO");
                MY_LIBRARY_SWITCH_ELEM = null;
                REFRESH_BTN_ELEM = By.xpath("TODO");
                FILTERS_BTN_ELEM = By.xpath("TODO");
                IMPORT_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/AXGroup[3]/AXButton[@AXTitle='Import' and @AXDOMIdentifier='import']");
                SEARCH_BAR_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/AXGroup[0]/AXGroup[3]/AXTextField[0]");
                PREPARE_DATA_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/AXGroup[3]/AXButton[@AXTitle='Prepare Data' and @AXDOMIdentifier='prepare']");
                CANCEL_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[0]/AXButton[@AXTitle='Cancel' and @AXDOMIdentifier='cancel']");
                NAME_HEADER_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/AXGroup[2]/AXTable[0]/AXRow[0]/AXCell[1]/AXGroup[0]/AXStaticText[@AXValue='Name']");
                OWNER_HEADER_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXRow[0]/AXCell[4]/AXGroup[0]/AXStaticText[@AXValue='Owner']");
                APPLICATION_HEADER_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXRow[0]/AXCell[5]/AXGroup[0]/AXStaticText[@AXValue='Application']");
                MODIFIED_HEADER_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXRow[0]/AXCell[6]/AXGroup[0]/AXStaticText[@AXValue='Modified']");
                OBJECT_TO_IMPORT_FIRST = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXList[@AXSubrole='AXContentList']/AXGroup[0]/AXGroup[2]/AXGroup[0]/AXStaticText");
                OBJECT_TO_IMPORT_BASE_BY_NAME = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXList[@AXSubrole='AXContentList']/AXGroup/AXGroup[2]/AXGroup[0]/AXStaticText[@AXValue=%s']";

                TITLE_IMAGE = "importPromptPage/title";
                break;
            case WINDOWS_DESKTOP:
                TITLE = By.xpath("//Text[@Name='Import Data']");
                MY_LIBRARY_LBL_ELEM = By.xpath("//Text[@Name='My Library']");
                MY_LIBRARY_SWITCH_ELEM = By.xpath("//Group[@Name='My Library']");
                REFRESH_BTN_ELEM = By.xpath("//Button[@Name='Refresh']");
                FILTERS_BTN_ELEM = By.xpath("//Button[@Name='Filters']");
                IMPORT_BTN_ELEM = By.name("Import");
                SEARCH_BAR_ELEM = By.name("Search...");
                PREPARE_DATA_BTN_ELEM = MobileBy.AccessibilityId("prepare");
                CANCEL_BTN_ELEM = MobileBy.AccessibilityId("cancel");
                NAME_HEADER_ELEM = By.xpath(            "//*[@LocalizedControlType='column header']/*[@Name='Name']");
                OWNER_HEADER_ELEM = By.xpath(           "//*[@LocalizedControlType='column header']/*[@Name='Owner']");
                APPLICATION_HEADER_ELEM = By.xpath(     "//*[@LocalizedControlType='column header']/*[@Name='Application']");
                MODIFIED_HEADER_ELEM = By.xpath(        "//*[@LocalizedControlType='column header']/*[@Name='Modified']");

                OBJECT_TO_IMPORT_FIRST = null;
                OBJECT_TO_IMPORT_BASE_BY_NAME = null;

                TITLE_IMAGE = null;
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
