package desktop.automation.selectors.helper;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class DossierVisualizationElemSelectors {
    protected static final By IMPORT_RADIO_BTN_ELEM;
    //if visualization does not have a title the element is not present in browser
    protected static final By VISUALIZATION_TITLE_ELEM;

    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                IMPORT_RADIO_BTN_ELEM = By.className("mstrmojo-VizBox-selector");
                VISUALIZATION_TITLE_ELEM = By.cssSelector(".title-text > div");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
