package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.pages.SUT.ImportPromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ImportPromptPageMacMachine extends ImportPromptPage {
    private static final By NAME_HEADER_ELEM_1 = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[2]/AXTable[0]/AXRow[0]/AXCell[1]/AXGroup[0]/AXStaticText[@AXValue='Name']");
    private static final By IMPORT_BTN_ELEM_1 = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXButton[@AXTitle='Import' and @AXDOMIdentifier='import']");
    private static final By SEARCH_BAR_ELEM_1 = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXGroup[3]/AXTextField[0]");
    private static final By PREPARE_DATA_BTN_ELEM_1 = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXButton[@AXTitle='Prepare Data' and @AXDOMIdentifier='prepare']");
    private static final By MY_LIBRARY_SWITCH_ELEM_1 = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/AXGroup[0]/AXGroup[0]/AXCheckBox[@AXSubrole='AXSwitch']");
    private static final By MY_LIBRARY_SWITCH_ELEM_2 = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXGroup[0]/AXCheckBox[@AXSubrole='AXSwitch']");

    public ImportPromptPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    public AnyInterfaceElement getSearchBarElem() {
        return machine.waitAndFindElemWrapper(new By[]{SEARCH_BAR_ELEM, SEARCH_BAR_ELEM_1}, machine.getUnitIntValue() * 2);
    }

    @Override
    public String getSearchBarInputText(WebElement searchBarElem) {
        return searchBarElem.getText();
    }

    @Override
    public void clickFirstObjectToImport() {
        try {
            Thread.sleep(2_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        WebDriverElemWrapper nameHeaderElem = (WebDriverElemWrapper)machine.getImportPromptPage().getNameHeaderElem();
        machine.actions
                .moveToElement(nameHeaderElem.getDriverElement(), 100, 50 + 60 * 0)
                .click()
                .perform();
    }

    @Override
    public AnyInterfaceElement getImportBtnElem() {
        return machine.waitAndFindElemWrapper(new By[]{IMPORT_BTN_ELEM, IMPORT_BTN_ELEM_1});
    }

    @Override
    public WebDriverElemWrapper getPrepareDataBtnElem() {
        return machine.waitAndFindElemWrapper(new By[]{PREPARE_DATA_BTN_ELEM, PREPARE_DATA_BTN_ELEM_1});
    }

    @Override
    public AnyInterfaceElement getNameHeaderElem() {
        return machine.waitAndFindElemWrapper(new By[]{NAME_HEADER_ELEM, NAME_HEADER_ELEM_1});
    }

    @Override
    public AnyInterfaceElement getTitleElem() {
        return new ImageComparisonElem(TITLE_IMAGE, 340, 600, 150, 250);
    }

    @Override
    protected WebDriverElemWrapper getMyLibrarySwitchElement() {
        return machine.waitAndFindElemWrapper(new By[]{MY_LIBRARY_SWITCH_ELEM_1, MY_LIBRARY_SWITCH_ELEM_2});
    }
}
