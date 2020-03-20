package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class MoreItemsMenuPageSelectors {
    protected static final By VERSION_ELEM;
    protected static final By CLEAR_DATA_BTN_ELEM;
    protected static final By MANAGE_APPLICATIONS_BTN_ELEM;
    protected static final By LOGOUT_BTN_ELEM;
    protected static final By CONTACT_US_BTN_ELEM;
    protected static final By TERMS_OF_USE_BTN_ELEM;
    protected static final By PRIVACY_POLICY_BTN_ELEM;
    protected static final By HELP_BTN_ELEM;
    protected static final By USER_DETAIL_LIST_ITEM_ELEM;
    protected static final By USER_INITIAL_TEXT_ELEM;
    protected static final By USER_NAME_TEXT_ELEM;
    protected static final By EMAIL_POP_UP_TITLE_ELEM;
    protected static final By CLEAR_DATA_ICON;
    protected static final By CLEAR_DATA_TITLE_PART_ONE;
    protected static final By CLEAR_DATA_TITLE_PART_TWO;
    protected static final By CLEAR_DATA_TITLE_PART_THREE;
    protected static final By CLEAR_DATA_MESSAGE_PART_ONE;
    protected static final By CLEAR_DATA_MESSAGE_PART_TWO;
    protected static final By CLEAR_DATA_MESSAGE_PART_THREE;
    protected static final By CLEAR_DATA_MESSAGE_PART_FOUR;
    protected static final By CLEAR_DATA_OK_BTN;
    protected static final By CLEAR_DATA_CANCEL_BTN;
    protected static final By EMAIL_CLIENT_CONFIRMATION_ELEM;

    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                VERSION_ELEM = null;
                CLEAR_DATA_BTN_ELEM = null;
                MANAGE_APPLICATIONS_BTN_ELEM = null;
                LOGOUT_BTN_ELEM = By.id("logOut");
                CONTACT_US_BTN_ELEM = null;
                TERMS_OF_USE_BTN_ELEM = null;
                PRIVACY_POLICY_BTN_ELEM = null;
                HELP_BTN_ELEM = null;
                USER_DETAIL_LIST_ITEM_ELEM = null;
                USER_INITIAL_TEXT_ELEM = By.id("initials");
                USER_NAME_TEXT_ELEM = By.id("userName");
                EMAIL_POP_UP_TITLE_ELEM = null;
                CLEAR_DATA_ICON = null;
                CLEAR_DATA_TITLE_PART_ONE = null;
                CLEAR_DATA_TITLE_PART_TWO = null;
                CLEAR_DATA_TITLE_PART_THREE = null;
                CLEAR_DATA_MESSAGE_PART_ONE = null;
                CLEAR_DATA_MESSAGE_PART_TWO = null;
                CLEAR_DATA_MESSAGE_PART_THREE = null;
                CLEAR_DATA_MESSAGE_PART_FOUR = null;
                CLEAR_DATA_OK_BTN = null;
                CLEAR_DATA_CANCEL_BTN = null;
                EMAIL_CLIENT_CONFIRMATION_ELEM = null;
                break;
            case MAC_DESKTOP:
                VERSION_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[8]/AXStaticText");
                CLEAR_DATA_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[1]/AXStaticText[@AXValue='Clear Data']");
                MANAGE_APPLICATIONS_BTN_ELEM = null;
                LOGOUT_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[7]/AXGroup[@AXDOMIdentifier='logOut']/AXStaticText[@AXValue='Log Out']");
                CONTACT_US_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[6]/AXLink[@AXTitle='Contact Us']/AXStaticText[@AXValue='Contact Us']");
                TERMS_OF_USE_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[4]/AXLink[@AXTitle='Terms of Use']/AXStaticText[@AXValue='Terms of Use']");
                PRIVACY_POLICY_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[3]/AXLink[@AXTitle='Privacy Policy']/AXStaticText[@AXValue='Privacy Policy']");
                HELP_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[5]/AXLink[@AXTitle='Help']/AXStaticText[@AXValue='Help']");
                USER_DETAIL_LIST_ITEM_ELEM = By.xpath("TODO");
                USER_INITIAL_TEXT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[@AXDOMIdentifier='testid']/AXGroup[@AXDOMIdentifier='initials']/AXStaticText");
                USER_NAME_TEXT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXGroup[@AXSubrole='AXContentList']/AXGroup[@AXDOMIdentifier='testid']/AXStaticText");
                EMAIL_POP_UP_TITLE_ELEM = By.xpath("TODO");
                CLEAR_DATA_ICON = By.xpath("TODO");
                CLEAR_DATA_TITLE_PART_ONE = By.xpath("TODO");
                CLEAR_DATA_TITLE_PART_TWO = By.xpath("TODO");
                CLEAR_DATA_TITLE_PART_THREE = By.xpath("TODO");
                CLEAR_DATA_MESSAGE_PART_ONE = By.xpath("TODO");
                CLEAR_DATA_MESSAGE_PART_TWO = By.xpath("TODO");
                CLEAR_DATA_MESSAGE_PART_THREE = By.xpath("TODO");
                CLEAR_DATA_MESSAGE_PART_FOUR = By.xpath("TODO");
                CLEAR_DATA_OK_BTN = By.xpath("TODO");
                CLEAR_DATA_CANCEL_BTN = By.xpath("TODO");
                EMAIL_CLIENT_CONFIRMATION_ELEM = By.xpath("TODO");
                break;
            case WINDOWS_DESKTOP:
                VERSION_ELEM = By.xpath("//*[contains(@Name, 'Version')]");
                CLEAR_DATA_BTN_ELEM = By.xpath("//*[@LocalizedControlType='text'][@Name='Clear Data']");
                MANAGE_APPLICATIONS_BTN_ELEM = null;
                LOGOUT_BTN_ELEM = MobileBy.AccessibilityId("logOut");
                CONTACT_US_BTN_ELEM = By.xpath("//*[@LocalizedControlType='link'][@Name='Contact Us']");
                TERMS_OF_USE_BTN_ELEM = By.xpath("//*[@LocalizedControlType='link'][@Name='Terms of Use']");
                PRIVACY_POLICY_BTN_ELEM = By.xpath("//*[@LocalizedControlType='link'][@Name='Privacy Policy']");
                HELP_BTN_ELEM = By.xpath("//*[@LocalizedControlType='link'][@Name='Help']");
                USER_DETAIL_LIST_ITEM_ELEM = By.xpath("//*[@AutomationId='testid']");
                USER_INITIAL_TEXT_ELEM = By.xpath("//*[@AutomationId='testid']/Text");
                USER_NAME_TEXT_ELEM = By.xpath("//*[@AutomationId='testid']/Text[2]");
                EMAIL_POP_UP_TITLE_ELEM = MobileBy.AccessibilityId("HeadText");
                CLEAR_DATA_ICON = By.xpath("//*[@Name='MicroStrategy for Office'][@Name='Refresh failed icon']");
                CLEAR_DATA_TITLE_PART_ONE = By.xpath("//*[@Name='Are you sure you want to ']");
                CLEAR_DATA_TITLE_PART_TWO = By.xpath("//*[@Name='Clear Data']");
                CLEAR_DATA_TITLE_PART_THREE = By.xpath("//*[@Name='?']");
                CLEAR_DATA_MESSAGE_PART_ONE = By.xpath("//*[@Name='This removes all MicroStrategy data from the workbook.']");
                CLEAR_DATA_MESSAGE_PART_TWO = By.xpath("//*[@Name='In order to re-import the data, you will have to click the']");
                CLEAR_DATA_MESSAGE_PART_THREE = By.xpath("//*[@Name='View Data']");
                CLEAR_DATA_MESSAGE_PART_FOUR = By.xpath("//*[@Name='button, which will appear in the add-in panel.']");
                CLEAR_DATA_OK_BTN = MobileBy.AccessibilityId("confirm-btn");
                CLEAR_DATA_CANCEL_BTN = MobileBy.AccessibilityId("cancel-btn");
                EMAIL_CLIENT_CONFIRMATION_ELEM = By.name("How do you want to open this?");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
