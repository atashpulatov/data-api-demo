package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class ImportDossierPageSelectors {
    protected static final By POP_UP_TITLE_ELEM;
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

    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                POP_UP_TITLE_ELEM = By.cssSelector("#root .folder-browser-title");
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
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
