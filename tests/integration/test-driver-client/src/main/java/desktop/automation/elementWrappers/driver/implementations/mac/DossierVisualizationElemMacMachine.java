package desktop.automation.elementWrappers.driver.implementations.mac;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.DossierVisualizationElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import org.openqa.selenium.By;

public class DossierVisualizationElemMacMachine extends DossierVisualizationElem {
    private String visualizationPaneSelector;

    private static final String VISUALIZATION_TITLE_ELEM_SUFFIX = "/AXStaticText";

    public DossierVisualizationElemMacMachine(WebDriverElemWrapper mainElem, String visualizationPaneSelector, Machine machine) {
        super(mainElem, machine);
        this.visualizationPaneSelector = visualizationPaneSelector;
    }

    @Override
    public void clickImportRadioBtnElem() {
        machine.clickObjectWithOffset(mainElem.getDriverElement(), 5, 5);
    }

    @Override
    public WebDriverElemWrapper getTitleElem() {
        String selector = visualizationPaneSelector + VISUALIZATION_TITLE_ELEM_SUFFIX;
        return machine.waitAndFindElemWrapper(By.xpath(selector));
    }
}
