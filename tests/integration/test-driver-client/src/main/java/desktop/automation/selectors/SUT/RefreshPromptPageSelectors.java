package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class RefreshPromptPageSelectors {
    protected static final By LOADING_SPINNER_ELEM;
    protected static final By REFRESH_ALL_TITLE_ELEM;
    protected static final By REFRESH_SINGLE_TITLE_ELEM;
    protected static final By REFRESH_SINGLE_MESSAGE_ELEM;
    protected static final By REFRESH_COMPLETE_MESSAGE_ELEM;
    protected static final By REFRESH_PROMPT_CONTAINER_ELEM;
    protected static final By REFRESH_SUCCESS_ICON_ELEM;
    protected static final By REFRESH_FAILURE_ICON_ELEM;
    protected static final By TOOL_TIP_ELEM;
    protected static final By TOOL_TIP_BINDING_ERROR_MESSAGE_ELEM;
    protected static final By CLOSE_BTN_ELEM;

    static {
        switch (DESIRED_DRIVER_TYPE) {
            case MAC_DESKTOP:
                LOADING_SPINNER_ELEM = null;
                REFRESH_ALL_TITLE_ELEM = null;
                REFRESH_SINGLE_TITLE_ELEM = null;
                REFRESH_SINGLE_MESSAGE_ELEM = null;
                REFRESH_COMPLETE_MESSAGE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXApplicationDialog']/AXGroup[1]/AXStaticText[@AXValue='Refreshing complete!']");
                REFRESH_PROMPT_CONTAINER_ELEM = null;
                REFRESH_SUCCESS_ICON_ELEM = null;
                REFRESH_FAILURE_ICON_ELEM = null;
                TOOL_TIP_ELEM = null;
                TOOL_TIP_BINDING_ERROR_MESSAGE_ELEM = null;
                CLOSE_BTN_ELEM = null;
                break;
            case WINDOWS_DESKTOP:
                LOADING_SPINNER_ELEM = By.name("Spinner");
                REFRESH_ALL_TITLE_ELEM = By.name("Refresh All Data");
                REFRESH_SINGLE_TITLE_ELEM = By.name("Importing data");
                REFRESH_SINGLE_MESSAGE_ELEM = By.name("Please wait until the import is complete.");
                REFRESH_COMPLETE_MESSAGE_ELEM = By.name("Refreshing complete!");
                REFRESH_PROMPT_CONTAINER_ELEM = By.xpath("//*[contains(@Name, 'Refresh All Data')][@LocalizedControlType='dialog']");
                REFRESH_SUCCESS_ICON_ELEM = MobileBy.AccessibilityId("icon_offline_success");
                REFRESH_FAILURE_ICON_ELEM = MobileBy.AccessibilityId("icon_offline_conflict");
                TOOL_TIP_ELEM = By.xpath("//*[contains(@Name, 'popupType=refresh-all-page')]/*[@Name='MicroStrategy for Office'][@LocalizedControlType='pane']/*[@LocalizedControlType='tool tip']");
                TOOL_TIP_BINDING_ERROR_MESSAGE_ELEM = By.name("Excel returned error:  This object binding is no longer valid due to previous updates.");
                CLOSE_BTN_ELEM = By.xpath("//*[@ClassName='NUIDialog']//*[@AutomationId='Close']");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
