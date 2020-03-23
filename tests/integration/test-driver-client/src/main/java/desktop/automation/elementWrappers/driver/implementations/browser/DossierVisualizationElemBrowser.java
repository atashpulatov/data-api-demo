package desktop.automation.elementWrappers.driver.implementations.browser;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;

public class DossierVisualizationElemBrowser extends DossierVisualizationElem {

    public DossierVisualizationElemBrowser(WebDriverElemWrapper mainElem, Machine machine) {
        super(mainElem, machine);
    }

    @Override
    public void clickImportRadioBtnElem() {
        getImportRadioBtnElem().click();
    }

    public WebDriverElemWrapper getImportRadioBtnElem(){
        return machine.waitAndFindInElement(mainElem.getDriverElement(), IMPORT_RADIO_BTN_ELEM);
    }
}
