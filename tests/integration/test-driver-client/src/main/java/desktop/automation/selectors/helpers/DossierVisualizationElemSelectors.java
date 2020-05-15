package desktop.automation.selectors.helpers;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class DossierVisualizationElemSelectors {
    protected static final By IMPORT_RADIO_BTN_ELEM;
    protected static final By VISUALIZATION_TITLE_ELEM;

    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                IMPORT_RADIO_BTN_ELEM = By.className("mstrmojo-VizBox-selector");
                VISUALIZATION_TITLE_ELEM = By.cssSelector(".title-text > div");
                break;
            case MAC_DESKTOP:
                IMPORT_RADIO_BTN_ELEM = null;
                VISUALIZATION_TITLE_ELEM = null;
                break;
            case WINDOWS_DESKTOP:
                IMPORT_RADIO_BTN_ELEM = null;
                VISUALIZATION_TITLE_ELEM = By.xpath("//Text");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
