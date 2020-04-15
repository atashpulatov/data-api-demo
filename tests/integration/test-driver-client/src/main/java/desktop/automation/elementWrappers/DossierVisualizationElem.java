package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.selectors.helpers.DossierVisualizationElemSelectors;

public abstract class DossierVisualizationElem extends DossierVisualizationElemSelectors {
    public WebDriverElemWrapper mainElem;
    public Machine machine;

    protected DossierVisualizationElem(WebDriverElemWrapper mainElem, Machine machine) {
        this.mainElem = mainElem;
        this.machine = machine;
    }

    public abstract void clickImportRadioBtnElem();

    //if visualization does not have a title the element is not present and will throw exception
    public WebDriverElemWrapper getTitleElem(){
        return machine.waitAndFindInElement(mainElem.getDriverElement(), VISUALIZATION_TITLE_ELEM);
    }
}
