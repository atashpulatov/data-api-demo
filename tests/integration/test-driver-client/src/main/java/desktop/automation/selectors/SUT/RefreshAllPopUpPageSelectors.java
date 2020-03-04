package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class RefreshAllPopUpPageSelectors {
    protected static final By REFRESH_ALL_DATA_TITLE_ELEM;
    protected static final String REFRESHING_OBJECT_NAME_BASE;
    protected static final String REFRESHING_OBJECT_INDEX_AND_TOTAL_BASE;
    protected static final String REFRESHED_OBJECT_FAILURE_ICON_IMAGE;
    protected static final String REFRESHED_OBJECT_SUCCESS_ICON_IMAGE_1;
    protected static final String REFRESHED_OBJECT_SUCCESS_ICON_IMAGE_2;
    protected static final String REFRESHED_OBJECT_NAME_BASE;
    protected static final By REFRESH_COMPLETE_TITLE_ELEM;
    protected static final By CLOSE_BTN_ELEM;


    static {
        switch (DESIRED_DRIVER_TYPE){
            case MAC_DESKTOP:
                REFRESH_ALL_DATA_TITLE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[@AXDOMIdentifier='refresh-title']/AXStaticText[@AXValue='Refresh All Data']");
                REFRESHING_OBJECT_NAME_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[1]/AXHeading[@AXDOMIdentifier='refresh-report']/AXStaticText[@AXValue='%s']";
                REFRESHING_OBJECT_INDEX_AND_TOTAL_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[1]/AXHeading[@AXTitle='(%d/%d)']";
                REFRESHED_OBJECT_FAILURE_ICON_IMAGE = "refreshAllPopUpPage/failureIcon";
                REFRESHED_OBJECT_SUCCESS_ICON_IMAGE_1 = "refreshAllPopUpPage/successIcon1";
                REFRESHED_OBJECT_SUCCESS_ICON_IMAGE_2 = "refreshAllPopUpPage/successIcon2";
                REFRESHED_OBJECT_NAME_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[%d]/AXStaticText[@AXValue='%s']";
                REFRESH_COMPLETE_TITLE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[1]/AXStaticText[@AXValue='Refreshing complete!']");
                CLOSE_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXButton[@AXSubrole='AXCloseButton']");
                break;
            case WINDOWS_DESKTOP:
                REFRESH_ALL_DATA_TITLE_ELEM = null;
                REFRESHING_OBJECT_NAME_BASE = null;
                REFRESHING_OBJECT_INDEX_AND_TOTAL_BASE = null;
                REFRESHED_OBJECT_FAILURE_ICON_IMAGE = null;
                REFRESHED_OBJECT_SUCCESS_ICON_IMAGE_1 = null;
                REFRESHED_OBJECT_SUCCESS_ICON_IMAGE_2 = null;
                REFRESHED_OBJECT_NAME_BASE = null;
                REFRESH_COMPLETE_TITLE_ELEM = null;
                CLOSE_BTN_ELEM = null;
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
