package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class MainPageSelectors {
    protected static final By CLEAR_DATA_BTN_ELEM;
    protected static final By MORE_ITEMS_MENU_BTN;
    protected static final By RANGE_NOT_EMPTY_MESSAGE;
    protected static final By IMPORTED_DATA_TAB_ELEM;
    protected static final By OFFICE_ADD_IN_LOGO_ELEM;
    //Windows: Import data button element must be searched on the imported object container element
    protected static final By IMPORT_DATA_BTN_ELEM;
    protected static final By ADD_DATA_BTN_ELEM;
    protected static final By ADD_IN_PANE_ELEM;
    protected static final By NO_IMPORTED_OBJECTS_LBL_ELEM;
    protected static final By CROSS_TAB_TOTAL_SUBTOTAL_ERROR_MESSAGE_ELEM;
    protected static final By LIMITS_EXCEEDED_ERROR_MESSAGE_ELEM;
    protected static final By THIS_OBJECT_CANNOT_BE_IMPORTED_ERROR_MESSAGE;
    protected static final By CUBE_NOT_PUBLISHED_ERROR_MESSAGE;
    protected static final By PROJECTS_LIMITS_EXCEEDED_ERROR_MESSAGE;
    protected static final By REFRESH_ALL_BTN_ELEM;
    protected static final By ERROR_OK_BTN_ELEM;
    protected static final By CELL_TRAVERSAL_INPUT_ELEM;
    protected static final By IMPORTED_OBJECT_LIST_ELEM;
    protected static final By IMPORTED_OBJECT_ROOT_ELEM;
    protected static final String IMPORTED_OBJECT_LIST_ELEM_NAME;
    protected static final By HEADER_SIZE_INPUT_ELEM;
    protected static final By FONT_INPUT_ELEM;
    protected static final By FONT_SIZE_INPUT_ELEM;
    protected static final By BOLD_BUTTON_ELEM;
    protected static final By ITALIC_BUTTON_ELEM;
    protected static final By UNDERLINE_BUTTON_ELEM;
    protected static final By DATASET_REFRESHED_MESSAGE_ELEM;
    protected static final By REPORT_REFRESHED_MESSAGE_ELEM;
    protected static final By DATA_LOADED_SUCCESSFULLY_NOTIFICATION_ELEM;
    protected static final By DIALOG_OPEN_NOTIFICATION_ELEM;
    protected static final By REPORT_REMOVED_MESSAGE_ELEM;
    protected static final By DATASET_REMOVED_MESSAGE_ELEM;
    protected static final By IMPORTED_OBJECT_COPY_CONTEXT_MENU_ELEM;
    protected static final By IMPORTED_OBJECT_RENAME_CONTEXT_MENU_ELEM;
    protected static final By DATA_CLEARED_IMAGE;
    protected static final By DATA_CLEARED_TITLE;
    protected static final By DATA_CLEARED_MESSAGE;
    protected static final By VIEW_DATA_BTN;
    protected static final By DIALOG_OPEN_NOTIFICATION;
    protected static final String COLUMN_HEADER_ELEM_BASE;
    protected static final String COLUMN_CONTEXT_MENU_ITEM_ELEM_BASE;
    protected static final String CELL_FORMAT_VALUE_BASE;
    protected static final By FORMAT_VALUE_PANE_OK_BTN;

    protected static final By HEADER_SIZE_PROMPT_OK_BTN = By.id("WACDialogActionButton");
    protected static final By SESSION_EXPIRED_NOTIFICATION;

    //Mac
    protected static final By EDIT_MENU;
    protected static final By EDIT_TAB_FIND;
    protected static final By EDIT_TAB_FIND_GO_TO;
    protected static final By GO_TO_PROMPT_INPUT;
    protected static final By FORMAT_TAB;
    protected static final By FORMAT_TAB_CELLS;
    protected static final By FORMAT_CELLS_PROMPT_SAMPLE;
    protected static final By FORMAT_CELLS_PROMPT_CANCEL_BTN;
    static {
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                CLEAR_DATA_BTN_ELEM = null;
                MORE_ITEMS_MENU_BTN = By.cssSelector("#app-header > .header-buttons > button");
                RANGE_NOT_EMPTY_MESSAGE = By.xpath("//header[text()[contains(.,'The required data range in the worksheet is not empty')]]");
                IMPORTED_DATA_TAB_ELEM = null;
                OFFICE_ADD_IN_LOGO_ELEM = By.cssSelector("#profileImage > img");
                IMPORT_DATA_BTN_ELEM = By.id("import-data-placeholder");
                ADD_DATA_BTN_ELEM = By.id("add-data-btn-container");
                ADD_IN_PANE_ELEM = null;
                NO_IMPORTED_OBJECTS_LBL_ELEM = null;
                CROSS_TAB_TOTAL_SUBTOTAL_ERROR_MESSAGE_ELEM = null;
                LIMITS_EXCEEDED_ERROR_MESSAGE_ELEM = By.xpath("//header[text()[contains(.,'The table you try to import exceeds the worksheet limits.')]]");
                THIS_OBJECT_CANNOT_BE_IMPORTED_ERROR_MESSAGE = By.xpath("//header[text()[contains(.,'This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty.')]]");
                CUBE_NOT_PUBLISHED_ERROR_MESSAGE = null;
                PROJECTS_LIMITS_EXCEEDED_ERROR_MESSAGE = By.xpath("//header[text()[contains(.,'The object exceeds project rows limitation')]]");
                REFRESH_ALL_BTN_ELEM = By.cssSelector("#refresh-all-btn");
                ERROR_OK_BTN_ELEM = By.cssSelector(".ant-notification-notice-btn");
                CELL_TRAVERSAL_INPUT_ELEM = By.id("m_excelWebRenderer_ewaCtl_NameBox");
                IMPORTED_OBJECT_LIST_ELEM = By.cssSelector(".tabpane");
                IMPORTED_OBJECT_ROOT_ELEM = By.cssSelector("div[role='listitem']");
                IMPORTED_OBJECT_LIST_ELEM_NAME = null;
                HEADER_SIZE_INPUT_ELEM = By.id("resizeInput");
                FONT_INPUT_ELEM = null;
                FONT_SIZE_INPUT_ELEM = null;
                BOLD_BUTTON_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_Font\\.Bold-Small");
                ITALIC_BUTTON_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_Font\\.Italic-Small");
                UNDERLINE_BUTTON_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_Font\\.Underline-Small");
                DATASET_REFRESHED_MESSAGE_ELEM = By.xpath("//header[text()[contains(.,'Dataset refreshed')]]");
                REPORT_REFRESHED_MESSAGE_ELEM = By.xpath("//header[text()[contains(.,'Report refreshed')]]");
                DATA_LOADED_SUCCESSFULLY_NOTIFICATION_ELEM = By.xpath("//header[text()[contains(.,'Data loaded successfully')]]");
                DIALOG_OPEN_NOTIFICATION_ELEM = null;
                REPORT_REMOVED_MESSAGE_ELEM = null;
                DATASET_REMOVED_MESSAGE_ELEM = null;
                IMPORTED_OBJECT_COPY_CONTEXT_MENU_ELEM = null;
                IMPORTED_OBJECT_RENAME_CONTEXT_MENU_ELEM = null;
                DATA_CLEARED_IMAGE = null;
                DATA_CLEARED_TITLE = null;
                DATA_CLEARED_MESSAGE = null;
                VIEW_DATA_BTN = null;
                COLUMN_HEADER_ELEM_BASE = "//div[text()[.='%s']]/parent::div";
                COLUMN_CONTEXT_MENU_ITEM_ELEM_BASE = null;
                CELL_FORMAT_VALUE_BASE = null;
                FORMAT_VALUE_PANE_OK_BTN = null;

                SESSION_EXPIRED_NOTIFICATION = By.xpath("//header[text()[contains(.,'Your session has expired. Please log in.')]]");

                //Mac
                EDIT_MENU = null;
                EDIT_TAB_FIND = null;
                EDIT_TAB_FIND_GO_TO = null;
                GO_TO_PROMPT_INPUT = null;
                FORMAT_TAB = null;
                FORMAT_TAB_CELLS = null;
                FORMAT_CELLS_PROMPT_SAMPLE = By.id("sample");
                FORMAT_CELLS_PROMPT_CANCEL_BTN = null;
                DIALOG_OPEN_NOTIFICATION = By.xpath("//span[text()='A MicroStrategy for Office Add-in dialog is open']");;
                break;
            case MAC_DESKTOP:
                CLEAR_DATA_BTN_ELEM = null;
                MORE_ITEMS_MENU_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[1]/AXButton[@AXDOMIdentifier='settings-button']");
                RANGE_NOT_EMPTY_MESSAGE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup/AXStaticText[@AXValue='The required data range in the worksheet is not empty']");
                IMPORTED_DATA_TAB_ELEM = null;
                OFFICE_ADD_IN_LOGO_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='app-header' and @AXSubrole='AXLandmarkBanner']/AXGroup[0]/AXImage[0]");
                IMPORT_DATA_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXButton[@AXTitle='Import Data' and @AXDOMIdentifier='import-data-placeholder']");
                ADD_DATA_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXButton[@AXTitle='Add Data' and @AXDOMIdentifier='add-data-btn-container']");
                ADD_IN_PANE_ELEM = null;
                NO_IMPORTED_OBJECTS_LBL_ELEM = null;
                CROSS_TAB_TOTAL_SUBTOTAL_ERROR_MESSAGE_ELEM = null;
                LIMITS_EXCEEDED_ERROR_MESSAGE_ELEM = By.xpath(
                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup/AXStaticText[@AXValue='The table you try to import exceeds the worksheet limits.']"
                );
                THIS_OBJECT_CANNOT_BE_IMPORTED_ERROR_MESSAGE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXStaticText[@AXValue='This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty.']");
                CUBE_NOT_PUBLISHED_ERROR_MESSAGE = null;
                PROJECTS_LIMITS_EXCEEDED_ERROR_MESSAGE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXStaticText[@AXValue='The object exceeds project rows limitation']");
                REFRESH_ALL_BTN_ELEM = By.xpath(
                        "/AXApplication[@AXTitle='MicroStrategy Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXButton[@AXDOMIdentifier='refresh-all-btn']");
                ERROR_OK_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup/AXButton[@AXTitle='OK']");
                CELL_TRAVERSAL_INPUT_ELEM = null;
                IMPORTED_OBJECT_LIST_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXList[@AXSubrole='AXContentList']");
                IMPORTED_OBJECT_ROOT_ELEM = By.xpath(".//AXGroup");
                IMPORTED_OBJECT_LIST_ELEM_NAME =
//              "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXList[@AXSubrole='AXContentList']/AXGroup[%d]/AXGroup[2]/AXGroup[]/AXStaticText"
                "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXList[@AXSubrole='AXContentList']/AXGroup[%d]/AXGroup[2]/AXGroup[0]/AXStaticText"
                ;
                HEADER_SIZE_INPUT_ELEM = null;
                FONT_INPUT_ELEM = null;
                FONT_SIZE_INPUT_ELEM = null;
                BOLD_BUTTON_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[1]/AXCheckBox[@AXTitle='Bold' and @AXSubrole='AXToggle']");
                ITALIC_BUTTON_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[1]/AXCheckBox[@AXTitle='Italic' and @AXSubrole='AXToggle']");
                UNDERLINE_BUTTON_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[1]/AXMenuButton[@AXTitle='Underline']");
                DATASET_REFRESHED_MESSAGE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXStaticText[@AXValue='Dataset refreshed']");
                REPORT_REFRESHED_MESSAGE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXStaticText[@AXValue='Report refreshed']");
                DATA_LOADED_SUCCESSFULLY_NOTIFICATION_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXStaticText[@AXValue='Data loaded successfully']");
                DIALOG_OPEN_NOTIFICATION_ELEM = null;
                REPORT_REMOVED_MESSAGE_ELEM = null;
                IMPORTED_OBJECT_RENAME_CONTEXT_MENU_ELEM = null;
                IMPORTED_OBJECT_COPY_CONTEXT_MENU_ELEM = null;
                DATASET_REMOVED_MESSAGE_ELEM = null;
                DATA_CLEARED_IMAGE = null;
                DATA_CLEARED_TITLE = null;
                DATA_CLEARED_MESSAGE = null;
                VIEW_DATA_BTN = null;

                SESSION_EXPIRED_NOTIFICATION = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXGroup[1]/AXStaticText[@AXValue='Your session has expired. Please log in.']");

                //Mac
                EDIT_MENU = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Edit']");
                EDIT_TAB_FIND = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Edit']/AXMenu[0]/AXMenuItem[@AXTitle='Find']");
                EDIT_TAB_FIND_GO_TO = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Edit']/AXMenu[0]/AXMenuItem[@AXTitle='Find']/AXMenu[0]/AXMenuItem[@AXTitle='Go to...']");
                GO_TO_PROMPT_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Go to' and @AXIdentifier='_NS:117' and @AXSubrole='AXDialog']/AXTextField[@AXIdentifier='_NS:31']");
                FORMAT_TAB = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Format']");
                FORMAT_TAB_CELLS = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Format']/AXMenu[0]/AXMenuItem[@AXTitle='Cells...']");
                FORMAT_CELLS_PROMPT_SAMPLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXSubrole='AXDialog']/AXTabGroup/AXGroup/AXStaticText");
                FORMAT_CELLS_PROMPT_CANCEL_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXSubrole='AXDialog']/AXButton[@AXTitle='Cancel']");
                DIALOG_OPEN_NOTIFICATION = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXStaticText[@AXValue='A MicroStrategy for Office Add-in dialog is open']");

                //"/AXApplication[@AXTitle='Excel']/AXWindow[@AXTitle='Book1' and @AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXLayoutArea[@AXTitle='Content Area']/AXLayoutArea[0]/AXTable[0]/AXRow[@AXSubrole='AXTableRow']/AXCell[4]/AXCell[0]"
                //"/AXApplication[@AXTitle='Excel']/AXWindow[@AXTitle='Book1' and @AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXLayoutArea[@AXTitle='Content Area']/AXLayoutArea[0]/AXTable[0]/AXRow[@AXSubrole='AXTableRow']/AXCell[5]/AXCell[0]"
                COLUMN_HEADER_ELEM_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXLayoutArea[@AXTitle='Content Area']/AXLayoutArea[0]/AXTable[0]/AXRow[@AXSubrole='AXTableRow']/AXCell/AXCell[@AXDescription='%s ' or @AXDescription='%s , Adjacent to hidden cells']";
                COLUMN_CONTEXT_MENU_ITEM_ELEM_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXLayoutArea[@AXTitle='Content Area']/AXMenu[0]/AXMenuItem[@AXTitle='%s' and @AXIdentifier='oui_performOfficeSpaceMenuAction:']";
                CELL_FORMAT_VALUE_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXTabGroup[@AXIdentifier='_NS:18']/AXScrollArea[@AXIdentifier='_NS:48']/AXTable[@AXIdentifier='_NS:52']/AXRow[@AXSubrole='AXTableRow']/AXStaticText[@AXValue='%s']";
                FORMAT_VALUE_PANE_OK_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXIdentifier='_NS:9' and @AXSubrole='AXDialog']/AXButton[@AXTitle='OK' and @AXIdentifier='_NS:1606']");
                break;
            case WINDOWS_DESKTOP:
                CLEAR_DATA_BTN_ELEM = By.xpath("//*[@Name=\"MicroStrategy for Office\"]/*[@LocalizedControlType='button'][1]");
                MORE_ITEMS_MENU_BTN = By.xpath("//*[@ClassName=\"Internet Explorer_Server\"]/*[@Name=\"MicroStrategy for Office\"]/*[@LocalizedControlType='button']");
                RANGE_NOT_EMPTY_MESSAGE = By.name("The required data range in the worksheet is not empty");
                IMPORTED_DATA_TAB_ELEM = MobileBy.name("Imported Data");
                OFFICE_ADD_IN_LOGO_ELEM = By.xpath("//*[@LocalizedControlType='image'][0]");//By.name("Office Add-in logo");
                //Windows: Import data button element must be searched on the imported object container element
                IMPORT_DATA_BTN_ELEM = By.xpath("//Button[@Name='Import Data']");
                ADD_DATA_BTN_ELEM = MobileBy.AccessibilityId("add-data-btn-container");
                ADD_IN_PANE_ELEM = By.name("MicroStrategy for Office");
                NO_IMPORTED_OBJECTS_LBL_ELEM = By.name("You haven't imported any report or dataset yet. Let's import data to start!");
                CROSS_TAB_TOTAL_SUBTOTAL_ERROR_MESSAGE_ELEM = By.name("This object cannot be imported. Objects with cross tabs, totals, or subtotals are not supported in this version of MicroStrategy for Office");
                LIMITS_EXCEEDED_ERROR_MESSAGE_ELEM = By.name("The table you try to import exceeds the worksheet limits.");
                THIS_OBJECT_CANNOT_BE_IMPORTED_ERROR_MESSAGE = By.name("This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty.");
                CUBE_NOT_PUBLISHED_ERROR_MESSAGE = By.name("This object cannot be imported. The Intelligent Cube is not published.");
                PROJECTS_LIMITS_EXCEEDED_ERROR_MESSAGE = By.name("The object exceeds project rows limitation");
                REFRESH_ALL_BTN_ELEM = MobileBy.AccessibilityId("refresh-all-btn");
                ERROR_OK_BTN_ELEM = By.name("OK");
                CELL_TRAVERSAL_INPUT_ELEM = MobileBy.AccessibilityId("1001");
                IMPORTED_OBJECT_LIST_ELEM = By.tagName("List");
                IMPORTED_OBJECT_ROOT_ELEM = By.xpath(".//*[@LocalizedControlType='item']");
                IMPORTED_OBJECT_LIST_ELEM_NAME = null;
                HEADER_SIZE_INPUT_ELEM = MobileBy.AccessibilityId("19");
                FONT_INPUT_ELEM = By.xpath("//*[@LocalizedControlType='Edit Box'][@Name='Font']");
                FONT_SIZE_INPUT_ELEM = By.xpath("//*[@LocalizedControlType='Edit Box'][@Name='Font Size']");
                BOLD_BUTTON_ELEM = By.xpath("//*[@LocalizedControlType='Button'][@Name='Bold']");
                ITALIC_BUTTON_ELEM = By.xpath("//*[@LocalizedControlType='Button'][@Name='Italic']");
                UNDERLINE_BUTTON_ELEM = By.xpath("//*[@LocalizedControlType='Button'][@Name='Underline']");
                DATASET_REFRESHED_MESSAGE_ELEM = By.name("Dataset refreshed");
                REPORT_REFRESHED_MESSAGE_ELEM = By.name("Report refreshed");
                DATA_LOADED_SUCCESSFULLY_NOTIFICATION_ELEM = null;
                DIALOG_OPEN_NOTIFICATION_ELEM = By.name("A MicroStrategy for Office Add-in dialog is open");
                REPORT_REMOVED_MESSAGE_ELEM = By.name("Report removed");
                DATASET_REMOVED_MESSAGE_ELEM = By.name("Dataset removed");
                IMPORTED_OBJECT_RENAME_CONTEXT_MENU_ELEM = By.name("Rename");
                DATA_CLEARED_IMAGE = By.xpath("//*[@Name='Refresh'][@LocalizedControlType='image']");
                DATA_CLEARED_TITLE = By.xpath("//*[@Name='Data Cleared!']");
                DATA_CLEARED_MESSAGE = By.xpath("//*[@Name='MicroStrategy data has been removed from the workbook. Click 'View Data' to import it again.']");
                VIEW_DATA_BTN = By.xpath("//*[@Name='View Data'][@LocalizedControlType='button']");
                COLUMN_HEADER_ELEM_BASE = "//*[@LocalizedControlType='header item'][@Name='%s']";
                COLUMN_CONTEXT_MENU_ITEM_ELEM_BASE = "//*[@LocalizedControlType='Menu Item'][@Name='%s']";
                CELL_FORMAT_VALUE_BASE = "//*[@LocalizedControlType='list item'][@Name='%s']";
                FORMAT_VALUE_PANE_OK_BTN = By.name("OK");
                IMPORTED_OBJECT_COPY_CONTEXT_MENU_ELEM = null;

                SESSION_EXPIRED_NOTIFICATION = null;

                //Mac
                EDIT_MENU = null;
                EDIT_TAB_FIND = null;
                EDIT_TAB_FIND_GO_TO = null;
                GO_TO_PROMPT_INPUT = null;
                FORMAT_TAB = null;
                FORMAT_TAB_CELLS = null;
                FORMAT_CELLS_PROMPT_SAMPLE = null;
                FORMAT_CELLS_PROMPT_CANCEL_BTN = null;
                DIALOG_OPEN_NOTIFICATION = null;
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
