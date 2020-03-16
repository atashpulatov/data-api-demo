package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.driver.implementations.windows.WebElementWithGetValue;
import desktop.automation.pages.SUT.ImportPromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ImportPromptPageWindowsMachine extends ImportPromptPage {
    protected static final String NAME_HEADER_IMAGE_1 = "importPromptPage/nameHeader1";
    protected static final String NAME_HEADER_IMAGE_2 = "importPromptPage/nameHeader2";

    protected static final String IMPORT_BTN_IMAGE = "importPromptPage/importBtn";

    public ImportPromptPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    protected WebDriverElemWrapper getMyLibrarySwitchElement() {
        return machine.waitAndFindElemWrapper(MY_LIBRARY_SWITCH_ELEM);
    }

    @Override
    public AnyInterfaceElement getSearchBarElem() {
        return machine.getImageComparisonElemFallBackToWebDriver(SEARCH_BAR_ELEM, SEARCH_BAR_IMAGE_1, 1465, 1725, 125, 190);
    }

    private WebDriverElemWrapper getObjectToImportNameCellElem(String nameOfObject) {
        return machine.waitAndFindElemWrapper(By.name(nameOfObject));
    }

    @Override
    public String getSearchBarInputText(WebElement searchBarElem) {
        return new WebElementWithGetValue(searchBarElem).getValue();
    }

    @Override
    public void clickFirstObjectToImport() {
        AnyInterfaceElement nameHeaderElem = machine.getImageComparisonElemFallBackToWebDriver(NAME_HEADER_ELEM, NAME_HEADER_IMAGE_1, 260, 370, 230, 280);
        if (nameHeaderElem instanceof ImageComparisonElem)
            ((ImageComparisonElem)nameHeaderElem).moveTo();
        else
            machine.actions.moveToElement(((WebDriverElemWrapper)nameHeaderElem).getDriverElement());
        
        machine.actions
                .moveByOffset(100, 50 + 60 * 0)
                .click()
                .perform();
    }

    @Override
    public AnyInterfaceElement getImportBtnElem() {
        return new ImageComparisonElem(IMPORT_BTN_IMAGE, 1250, 1410, 830, 930);
    }

    @Override
    public WebDriverElemWrapper getPrepareDataBtnElem() {
        return machine.waitAndFindElemWrapper(PREPARE_DATA_BTN_ELEM);
    }

    @Override
    public AnyInterfaceElement getNameHeaderElem() {
        return new ImageComparisonElem(new String[]{NAME_HEADER_IMAGE_1, NAME_HEADER_IMAGE_2},
                260, 370, 230, 280, 10_000, 1000);
    }
}
