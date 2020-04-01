package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class ImportDossierPageSelectors {
    protected static final By POP_UP_TITLE_ELEM;
    protected static final String POP_UP_TITLE_ELEM_BASE;
    protected static final By NAV_BAR_TABLE_OF_CONTENTS_BTN_ELEM;
    protected static final By NAV_BAR_BOOKMARKS_BTN_ELEM;
    protected static final By NAV_BAR_RESET_BTN_ELEM;
    protected static final By NAV_BAR_REPROMPT_BTN_ELEM;
    protected static final By DOSSIER_VIEW_TITLE_ELEM;
    protected static final By NAV_BAR_FILTERS_BTN_ELEM;
    protected static final By ADD_TO_LIBRARY_BTN_ELEM;
    protected static final By VISUALIZATION_ROOT_ELEM;
    protected static final By BACK_BTN_ELEM;
    protected static final By IMPORT_BTN_ELEM;
    protected static final By CANCEL_BTN_ELEM;
    protected static final By DOSSIER_LOADING_SPINNER_ELEM;
    protected static final By ADD_NEW_BOOKMARK_BTN_WITH_BOOKMARKS;
    protected static final By ADD_NEW_BOOKMARK_BTN_NO_BOOKMARKS;
    protected static final By BOOKMARK_ROOT_ELEM;

    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                POP_UP_TITLE_ELEM = By.cssSelector("#root .folder-browser-title");
                POP_UP_TITLE_ELEM_BASE = null;
                NAV_BAR_TABLE_OF_CONTENTS_BTN_ELEM = By.className("mstrd-ToCNavItemContainer");
                NAV_BAR_BOOKMARKS_BTN_ELEM = By.className("mstrd-BookmarkNavItem");
                NAV_BAR_RESET_BTN_ELEM = By.className("mstrd-ResetNavItem");
                NAV_BAR_REPROMPT_BTN_ELEM = By.className("mstrd-PromptNavItem");
                DOSSIER_VIEW_TITLE_ELEM = By.cssSelector(".mstrd-NavBarTitle-item:nth-child(2)");
                NAV_BAR_FILTERS_BTN_ELEM = By.className("mstrd-FilterNavItemContainer");
                ADD_TO_LIBRARY_BTN_ELEM = By.xpath("//span[@id='publish-msg']/following-sibling::div/button");
                VISUALIZATION_ROOT_ELEM = By.cssSelector(".mstrmojo-UnitContainer.mstrmojo-VIBox.mstrd-vizSelection-enabled");
                BACK_BTN_ELEM = By.id("back");
                IMPORT_BTN_ELEM = By.id("import");
                CANCEL_BTN_ELEM = By.id("cancel");
                DOSSIER_LOADING_SPINNER_ELEM = By.className("mstrd-LoadingIcon-content");
                ADD_NEW_BOOKMARK_BTN_WITH_BOOKMARKS = By.className("mstrd-BookmarkDropdownMenuContainer-addNewBookmark");
                ADD_NEW_BOOKMARK_BTN_NO_BOOKMARKS = By.className("mstrd-BookmarkDropdownMenuContainer-addBtn");
                BOOKMARK_ROOT_ELEM = By.cssSelector(".mstrd-BookmarkItem-swipeOut");
                break;
            case MAC_DESKTOP:
                String leftSideBtnBase = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup";
                POP_UP_TITLE_ELEM = null;
                POP_UP_TITLE_ELEM_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXHeading/AXStaticText[@AXValue='Import Dossier > %s']";
                NAV_BAR_TABLE_OF_CONTENTS_BTN_ELEM = By.xpath(leftSideBtnBase + "/AXPopUpButton[@AXDescription='Table of Contents']");
                NAV_BAR_BOOKMARKS_BTN_ELEM = By.xpath(leftSideBtnBase + "/AXPopUpButton[@AXDescription='Bookmarks']");
                NAV_BAR_RESET_BTN_ELEM = By.xpath(leftSideBtnBase + "/AXGroup/AXPopUpButton[@AXDescription='Reset']");
                NAV_BAR_REPROMPT_BTN_ELEM = By.xpath(leftSideBtnBase + "/AXPopUpButton[@AXDescription='Re-Prompt']");
                DOSSIER_VIEW_TITLE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup[@AXSubrole='AXContentList']/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXStaticText");
                NAV_BAR_FILTERS_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXSubrole='AXLandmarkNavigation']/AXGroup[@AXSubrole='AXContentList']/AXGroup[0]/AXPopUpButton[@AXDescription='Filter']");
                ADD_TO_LIBRARY_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXButton[@AXDescription='Add to library: Use this option to add this dossier to your library']");
                VISUALIZATION_ROOT_ELEM = null;
                BACK_BTN_ELEM = null;
                IMPORT_BTN_ELEM = null;
                CANCEL_BTN_ELEM = null;
                DOSSIER_LOADING_SPINNER_ELEM = By.xpath("/AXApplication[@AXTitle='Excel']/AXWindow[@AXTitle='Office Add-ins - env-182059.customer.cloud.microstrategy.com' and @AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='*lK65*kK81*x1*t1583092470420']/AXGroup[1]/AXGroup[@AXDOMIdentifier='mstr112']");
                ADD_NEW_BOOKMARK_BTN_WITH_BOOKMARKS = null;
                ADD_NEW_BOOKMARK_BTN_NO_BOOKMARKS = null;
                BOOKMARK_ROOT_ELEM = null;
                break;
            case WINDOWS_DESKTOP:
                POP_UP_TITLE_ELEM = null;
                POP_UP_TITLE_ELEM_BASE = "//Text[@Name='Import Dossier > %s']";
                NAV_BAR_TABLE_OF_CONTENTS_BTN_ELEM = By.xpath("//Button[@Name='Table of Contents']");
                NAV_BAR_BOOKMARKS_BTN_ELEM = By.xpath("//Button[@Name='Bookmarks']");
                NAV_BAR_RESET_BTN_ELEM = By.xpath("//Button[@Name='Reset']");
                NAV_BAR_REPROMPT_BTN_ELEM = By.xpath("//Button[@Name='Re-Prompt']");
                DOSSIER_VIEW_TITLE_ELEM = By.xpath("//ListItem/Text");
                NAV_BAR_FILTERS_BTN_ELEM = By.xpath("//Button[@Name='Filter']");
                ADD_TO_LIBRARY_BTN_ELEM = By.xpath("//Button[@Name='Add to library: Use this option to add this dossier to your library']");
                VISUALIZATION_ROOT_ELEM = By.xpath("//Pane[@Name='MicroStrategy for Office']/Pane//Button[starts-with(@Name, 'Menu for ')]/..");
                BACK_BTN_ELEM = By.id("back");
                IMPORT_BTN_ELEM = By.id("import");
                CANCEL_BTN_ELEM = By.id("cancel");
                DOSSIER_LOADING_SPINNER_ELEM = null;
                ADD_NEW_BOOKMARK_BTN_WITH_BOOKMARKS = By.xpath("//Button[@Name='Add New']");
                ADD_NEW_BOOKMARK_BTN_NO_BOOKMARKS = By.xpath("//Button[@Name='Add New']");
                BOOKMARK_ROOT_ELEM = By.xpath("//*[@LocalizedControlType='dialog'][starts-with(@Name, 'Bookmarks dialog')]//ListItem/MenuItem");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
