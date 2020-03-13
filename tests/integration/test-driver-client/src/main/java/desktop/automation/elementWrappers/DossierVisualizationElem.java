package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.selectors.helper.DossierVisualizationElemSelectors;

public class DossierVisualizationElem extends DossierVisualizationElemSelectors {
    public WebDriverElemWrapper mainElem;
    public Machine machine;

    public DossierVisualizationElem(WebDriverElemWrapper mainElem, Machine machine) {
        this.mainElem = mainElem;
        this.machine = machine;
    }

    public WebDriverElemWrapper getImportRadioBtnElem(){
        return machine.waitAndFindInElement(mainElem.getDriverElement(), IMPORT_RADIO_BTN_ELEM);
    }

    public WebDriverElemWrapper getTitleElem(){
        return machine.waitAndFindInElement(mainElem.getDriverElement(), VISUALIZATION_TITLE_ELEM);
    }
}
