package desktop.automation.elementWrappers.driver.implementations.windows;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;

public class DossierVisualizationElemWindowsMachine extends DossierVisualizationElem {

    public DossierVisualizationElemWindowsMachine(WebDriverElemWrapper mainElem, Machine machine) {
        super(mainElem, machine);
    }

    @Override
    public void clickImportRadioBtnElem() {
        machine.clickObjectWithOffset(mainElem.getDriverElement(), 10, 10);
    }
}
