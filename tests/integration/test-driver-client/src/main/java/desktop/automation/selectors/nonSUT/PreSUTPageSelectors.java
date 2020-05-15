package desktop.automation.selectors.nonSUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.*;

public class PreSUTPageSelectors {
    protected static final By ADDIN;
    protected static final By MY_ADD_INS_ELEM;
    protected static final By ADD_IN_TO_LOAD_ELEM;
    protected static final By ADD_ADD_IN_BTN_ELEM;
    protected static final By ADDIN_TO_IMPORT;

    protected static final By BLANK_SHEET_ELEM;
    protected static final By HOME_TAB_ELEM;
    protected static final By INSERT_TAB_ELEM;
    protected static final By SHARED_FOLDER_ELEM;
    protected static final By FILE_TAB_ELEM;
    protected static final By NEW_TAB_ELEM;
    protected static final By OPEN_TAB_ELEM;
    protected static final By CLOSE_BTN_ELEM;
    protected static final By DONT_SAVE_BTN_ELEM;
    protected static final By OPEN_EXCEL_ELEM;
    protected static final By CONNECTION_ELEM;
    protected static final By DISCONNECT_BTN_ELEM;
    protected static final By ADD_SHEET_BTN_ELEM;
    protected static final By DELETE_CONTEXT_MENU_ELEM;
    protected static final By DELETE_SHEET_PROMPT_DELETE_BTN_ELEM;
    protected static final By PASTE_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[0]/AXMenuButton[@AXTitle='Paste']");
    protected static final By EXCEL_IN_DOCK;
    protected static final By CONTEXT_MENU_QUIT_BTN;
    protected static final By ADDIN_DROP_DOWN;
    protected static final By EDIT_MENU;
    protected static final String SHEET_BTN_BASE_BY_INDEX;

    protected static final String BLANK_SHEET_IMAGE;
    protected static final String EXCEL_START_IMAGE_BASE;
    protected static final String ADD_IN_START_IMAGE;
    protected static final String CLOSE_BTN_IMAGE;
    protected static final String DONT_SAVE_BTN_IMAGE;

    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                ADDIN = By.xpath(String.format("//span[translate(string(),' ','')=translate('%s',' ','')]", EXCEL_ADD_IN_NAME_IN_HOME_TAB_BROWSER));
                BLANK_SHEET_ELEM = By.cssSelector("[title^='New blank workbook']");
                HOME_TAB_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_Ribbon\\.Home-title");
                INSERT_TAB_ELEM = null;
                MY_ADD_INS_ELEM = null;
                SHARED_FOLDER_ELEM = null;
                ADD_IN_TO_LOAD_ELEM = null;
                ADD_ADD_IN_BTN_ELEM = null;
                FILE_TAB_ELEM = null;
                NEW_TAB_ELEM = null;
                OPEN_TAB_ELEM = null;
                CLOSE_BTN_ELEM = null;
                DONT_SAVE_BTN_ELEM = null;
                OPEN_EXCEL_ELEM = null;
                CONNECTION_ELEM = null;
                DISCONNECT_BTN_ELEM = null;
                ADD_SHEET_BTN_ELEM = By.xpath("//a[@title='New sheet']");
                DELETE_CONTEXT_MENU_ELEM = By.cssSelector("#ContextMenu\\.DeleteSheet-Menu16");
                DELETE_SHEET_PROMPT_DELETE_BTN_ELEM = By.xpath("//div[@id='errorewaDialogInner']//div[@class='ewa-dlg-button-div'][text()[.='OK']]");
                BLANK_SHEET_IMAGE = null;
                EXCEL_START_IMAGE_BASE = null;
                ADD_IN_START_IMAGE = null;
                CLOSE_BTN_IMAGE = null;
                DONT_SAVE_BTN_IMAGE = null;
                SHEET_BTN_BASE_BY_INDEX = "span[sheet-title=\"Sheet%d\"]";

                CONTEXT_MENU_QUIT_BTN = null;
                EXCEL_IN_DOCK = null;
                ADDIN_DROP_DOWN = null;
                ADDIN_TO_IMPORT = null;
                EDIT_MENU = null;
                break;
            case MAC_DESKTOP:
                ADDIN = By.xpath(String.format("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup/AXButton[@AXTitle='%s']", EXCEL_ADD_IN_NAME_IN_HOME_TAB_MAC_DESKTOP));
                BLANK_SHEET_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Open new and recent files' and @AXIdentifier='DocStage' and @AXSubrole='AXStandardWindow']/AXScrollArea[0]/AXList[@AXSubrole='AXCollectionList']/AXList[@AXSubrole='AXSectionList']/AXGroup[@AXIdentifier='DocsUITemplate']/AXButton[@AXTitle='Blank Workbook']");
                HOME_TAB_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXRadioButton[@AXTitle='Home']");
                INSERT_TAB_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXRadioButton[@AXTitle='Insert']");
                MY_ADD_INS_ELEM = By.xpath("TODO");
                SHARED_FOLDER_ELEM = By.xpath("TODO");
                ADDIN_DROP_DOWN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[2]/AXMenuButton[@AXTitle='My Add-ins']");
                ADDIN_TO_IMPORT = By.xpath(
                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='My Add-ins' and @AXSubrole='AXUnknown']/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXRadioButton[@AXIdentifier='popover_gallery_OfficeExtensionsGallery2_Control_0_0']"
//                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='My Add-ins' and @AXSubrole='AXUnknown']/AXGroup[0]/AXGroup[0]/AXRadioButton[@AXIdentifier='popover_gallery_OfficeExtensionsGallery2_Control_0_0']"
                );
                FILE_TAB_ELEM = By.xpath("TODO");
                NEW_TAB_ELEM = By.xpath("TODO");
                OPEN_TAB_ELEM = By.xpath("TODO");
                CLOSE_BTN_ELEM = By.xpath("TODO");
                DONT_SAVE_BTN_ELEM = By.xpath(
                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXDialog']/AXButton[@AXTitle='Don't Save']"
//                        "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:86' and @AXSubrole='AXDialog']/AXButton[@AXTitle='Don't Save' and @AXIdentifier='_NS:97']"
                );
                OPEN_EXCEL_ELEM = By.xpath("TODO");
                CONNECTION_ELEM = By.xpath("TODO");
                DISCONNECT_BTN_ELEM = By.xpath("TODO");
                ADD_SHEET_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXLayoutArea[@AXTitle='Content Area']/AXButton[@AXIdentifier='addSheetTabButton']");
                DELETE_CONTEXT_MENU_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXLayoutArea[@AXTitle='Content Area']/AXMenu[0]/AXMenuItem[@AXTitle='Delete']");
                DELETE_SHEET_PROMPT_DELETE_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXDialog']/AXButton[@AXTitle='Delete' and @AXIdentifier='_NS:9']");
                BLANK_SHEET_IMAGE = "TODO";
                EXCEL_START_IMAGE_BASE = "TODO";
                ADD_IN_START_IMAGE = "TODO";
                CLOSE_BTN_IMAGE = "TODO";
                DONT_SAVE_BTN_IMAGE = "TODO";

                CONTEXT_MENU_QUIT_BTN = By.xpath("/AXApplication[@AXTitle='Dock']/AXList[0]/AXDockItem/AXMenu[0]/AXMenuItem[@AXTitle='Quit']");
                EXCEL_IN_DOCK = By.xpath("/AXApplication[@AXTitle='Dock']/AXList[0]/AXDockItem[@AXTitle='Microsoft Excel' and @AXSubrole='AXApplicationDockItem']");
                ADD_IN_TO_LOAD_ELEM = null;
                ADD_ADD_IN_BTN_ELEM = null;

                SHEET_BTN_BASE_BY_INDEX = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXLayoutArea[@AXTitle='Content Area']/AXButton[@AXIdentifier='sheetTab%d']";
                EDIT_MENU = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Edit']");
                break;
            case WINDOWS_DESKTOP:
                ADDIN = By.xpath("//Button[@Name=\"" + EXCEL_ADD_IN_NAME_IN_HOME_TAB_WINDOWS_DESKTOP + "\"]");
                BLANK_SHEET_ELEM = MobileBy.xpath("//ListItem[@Name=\"Blank workbook\"]");
                HOME_TAB_ELEM = By.name("Home");
                INSERT_TAB_ELEM = By.name("Insert");
                MY_ADD_INS_ELEM = By.xpath("//Button[@Name=\"My Add-ins\"]");
                SHARED_FOLDER_ELEM = MobileBy.AccessibilityId("SHARED FOLDER");
                ADD_IN_TO_LOAD_ELEM = By.xpath("//Group[@Name=\"New plugin to insert data from MicroStrategy into Microsoft Office products.\"]");
                ADD_ADD_IN_BTN_ELEM = MobileBy.AccessibilityId("BtnAction");
                FILE_TAB_ELEM = MobileBy.AccessibilityId("FileTabButton");
                NEW_TAB_ELEM = By.name("New");
                OPEN_TAB_ELEM = By.name("Open");
                CLOSE_BTN_ELEM = By.name("Close");
                DONT_SAVE_BTN_ELEM = By.name("Don't Save");
                OPEN_EXCEL_ELEM = By.className("XLMAIN");
                CONNECTION_ELEM = MobileBy.AccessibilityId("{7820AE74-23E3-4229-82C1-E41CB67D5B9C}");
                DISCONNECT_BTN_ELEM = By.name("Disconnect");
                ADD_SHEET_BTN_ELEM = By.name("Sheet Tab Add Sheet");
                DELETE_CONTEXT_MENU_ELEM = By.name("Delete");
                DELETE_SHEET_PROMPT_DELETE_BTN_ELEM = By.name("Delete");
                BLANK_SHEET_IMAGE = "preSUTPage/blankSheet";
                EXCEL_START_IMAGE_BASE = "preSUTPage/excelStartElem_%d_Windows";
                ADD_IN_START_IMAGE = "preSUTPage/addInStart";
                CLOSE_BTN_IMAGE = "preSUTPage/closeBtn";
                DONT_SAVE_BTN_IMAGE = "preSUTPage/dontSaveBtn";
                SHEET_BTN_BASE_BY_INDEX = "Sheet Tab %d";

                CONTEXT_MENU_QUIT_BTN = null;
                EXCEL_IN_DOCK = null;
                ADDIN_DROP_DOWN = null;
                ADDIN_TO_IMPORT = null;
                EDIT_MENU = null;
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
