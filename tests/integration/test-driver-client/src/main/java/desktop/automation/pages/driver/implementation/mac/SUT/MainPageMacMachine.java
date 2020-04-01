package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.MacMachine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.enums.FontValue;
import desktop.automation.pages.SUT.MainPage;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import static junit.framework.TestCase.assertEquals;

public class MainPageMacMachine extends MainPage {
    private static final By FORMAT_TAB = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Format']");
    private static final By FORMAT_TAB_CELLS = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]/AXMenuBarItem[@AXTitle='Format']/AXMenu[0]/AXMenuItem[@AXTitle='Cells...']");
    private static final By FORMAT_TAB_ROW = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[@AXIdentifier='_NS:93']/AXMenuBarItem[@AXTitle='Format']/AXMenu[0]/AXMenuItem[@AXTitle='Row']");
    private static final By FORMAT_TAB_COLUMN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[@AXIdentifier='_NS:93']/AXMenuBarItem[@AXTitle='Format']/AXMenu[0]/AXMenuItem[@AXTitle='Column']");

    private static final By FORMAT_TAB_ROW_HEIGHT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[@AXIdentifier='_NS:93']/AXMenuBarItem[@AXTitle='Format']/AXMenu[0]/AXMenuItem[@AXTitle='Row']/AXMenu[0]/AXMenuItem[@AXTitle='Height...' and @AXIdentifier='oui_performOfficeSpaceMenuAction:']");
    private static final By ROW_HEIGHT_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Row Height' and @AXIdentifier='_NS:86' and @AXSubrole='AXDialog']/AXTextField[@AXIdentifier='_NS:44']");
    private static final By FORMAT_TAB_COLUMN_WIDTH = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[@AXIdentifier='_NS:93']/AXMenuBarItem[@AXTitle='Format']/AXMenu[0]/AXMenuItem[@AXTitle='Column']/AXMenu[0]/AXMenuItem[@AXTitle='Width...' and @AXIdentifier='oui_performOfficeSpaceMenuAction:']");
    private static final By COLUMN_WIDTH_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Column Width' and @AXIdentifier='_NS:91' and @AXSubrole='AXDialog']/AXTextField[@AXIdentifier='_NS:66']");
    private static final By FORMAT_TAB_ROW_HIDE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[@AXIdentifier='_NS:93']/AXMenuBarItem[@AXTitle='Format']/AXMenu[0]/AXMenuItem[@AXTitle='Row']/AXMenu[0]/AXMenuItem[@AXTitle='Hide' and @AXIdentifier='oui_performOfficeSpaceMenuAction:']");
    private static final By FORMAT_TAB_ROW_UNHIDE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[@AXIdentifier='_NS:93']/AXMenuBarItem[@AXTitle='Format']/AXMenu[0]/AXMenuItem[@AXTitle='Row']/AXMenu[0]/AXMenuItem[@AXTitle='Unhide' and @AXIdentifier='oui_performOfficeSpaceMenuAction:']");

    private static final By FORMAT_CELLS_PROMPT_SAMPLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXSubrole='AXDialog']/AXTabGroup/AXGroup/AXStaticText");
    private static final By FORMAT_CELLS_PROMPT_CANCEL_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Format Cells' and @AXSubrole='AXDialog']/AXButton[@AXTitle='Cancel']");

    private static final By FONT_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXTabGroup[0]/AXScrollArea[0]/AXGroup[1]/AXComboBox");

    private static final String REFRESH_ALL_BTN_ELEM = "mainPage/refreshAllBtn";

    public MainPageMacMachine(MacMachine machine) {
        super(machine);
    }

    @Override
    public AnyInterfaceElement getMoreItemsMenuElem() {
        return machine.waitAndFindElemWrapper(MORE_ITEMS_MENU_BTN);
    }

    @Override
    public WebDriverElemWrapper getImportDataBtnElem(){
        return machine.waitAndFindElemWrapper(IMPORT_DATA_BTN_ELEM);
    }

    @Override
    public AnyInterfaceElement getRefreshAllBtnElem() {
        return new ImageComparisonElem(REFRESH_ALL_BTN_ELEM, 2820, 3000, 780, 880);
    }

    @Override
    public WebDriverElemWrapper getImportedObjectInListNameElem(String objectName, WebDriverWait wait) {
        return getImportObjectInListElemHelper(objectName, wait);
    }

    @Override
    public void goToCell(String cell) {
        getEditMenuElem().click();
        getEditTabFindElem().click();
        getEditTabFindGoToElem().click();

        cell = cell.toUpperCase();
        WebElement cellInput = getGotoPromptInputElem();

        int count = 0;
        do {
            cellInput.clear();
            cellInput.sendKeys(cell);
        } while (!cellInput.getText().matches(cell) && count++ < 4);

        cellInput.sendKeys(Keys.ENTER);
    }

    public WebElement getEditMenuElem() {
        return machine.waitAndFind(EDIT_MENU);
    }

    public WebElement getEditTabFindElem() {
        return machine.waitAndFind(EDIT_TAB_FIND);
    }

    public WebElement getEditTabFindGoToElem() {
        return machine.waitAndFind(EDIT_TAB_FIND_GO_TO);
    }

    public WebElement getGotoPromptInputElem() {
        return machine.waitAndFind(GO_TO_PROMPT_INPUT);
    }

    @Override
    public String getCurrentlySelectedCellValue(String cell) {
        getFormatTabElem().click();
        getFormatTabCellsElem().click();
        String res = getFormatCellsPromptSampleElem().getText().trim();

        //turning to null to synchronize with Windows
        if (res.trim().length() == 0)
            res = null;
        getFormatCellsPromptCancelBtnElem().click();

        return res;
    }

    @Override
    protected By getHeaderSelector(String header) {
        String selector = String.format(COLUMN_HEADER_ELEM_BASE, header.toUpperCase(), header.toUpperCase());
        return By.xpath(selector);
    }

    @Override
    public void hideHeader(String header) {
        if (isRowHeader(header)) {
            //use below flow for row headers. Analogical approach could be utilized for column header hiding, but utilizing same logic as Windows flow for columns

            goToCell("A" + header);
            getFormatTabElem().click();
            getFormatTabRowElem().click();
            getFormatTabRowHideElem().click();
        }
        else {
            //for columns use same flow as Windows
            hideHeaderByCellContextMenu(header);
        }
    }

    @Override
    protected WebDriverElemWrapper getHeaderSizeInputElemFromStart(String header, boolean isColumn) {
        String cell = isColumn ? header + "1" : "A" + header;
        goToCell(cell);
        getFormatTabElem().click();

        WebDriverElemWrapper res;
        if (isColumn){
            getFormatTabColumnElem().click();
            getFormatTabColumnWidthElem().click();
            res = getColumnWidthInputElem();
        }
        else {
            getFormatTabRowElem().click();
            getFormatTabRowHeightElem().click();
            res = getRowHeightInputElem();
        }

        return res;
    }

    @Override
    public boolean isConditionalFormattingAppliedToCell(String cell) {
        goToCell(cell);

        machine.getFormattingPage().getConditionalFormattingMenuElem().click();
        machine.getFormattingPage().getManageRulesMenuItemElem().click();
        boolean res = false;
        try {
            machine.getFormattingPage().getManageRulesPromptStopIfTrueCheckboxElem().getDriverElement();
            res = true;
        } catch (org.openqa.selenium.TimeoutException ignored){
        }

        machine.getFormattingPage().getManageRulesPropmtOKBtnElem().click();
        return res;
    }

    public WebElement getFormatTabElem(){
        return machine.waitAndFind(FORMAT_TAB);
    }

    public WebElement getFormatTabCellsElem(){
        return machine.waitAndFind(FORMAT_TAB_CELLS);
    }

    public WebElement getFormatCellsPromptCancelBtnElem(){
        return machine.waitAndFind(FORMAT_CELLS_PROMPT_CANCEL_BTN);
    }

    public WebDriverElemWrapper getFormatTabRowElem(){
        return machine.waitAndFindElemWrapper(FORMAT_TAB_ROW);
    }

    public WebDriverElemWrapper getFormatTabColumnElem(){
        return machine.waitAndFindElemWrapper(FORMAT_TAB_COLUMN);
    }

    public WebDriverElemWrapper getFormatTabRowHeightElem(){
        return machine.waitAndFindElemWrapper(FORMAT_TAB_ROW_HEIGHT);
    }

    public WebDriverElemWrapper getRowHeightInputElem(){
        return machine.waitAndFindElemWrapper(ROW_HEIGHT_INPUT);
    }

    public WebDriverElemWrapper getFormatTabRowHideElem(){
        return machine.waitAndFindElemWrapper(FORMAT_TAB_ROW_HIDE);
    }

    public WebDriverElemWrapper getFormatTabRowUnhideElem(){
        return machine.waitAndFindElemWrapper(FORMAT_TAB_ROW_UNHIDE);
    }

    public WebDriverElemWrapper getFormatTabColumnWidthElem(){
        return machine.waitAndFindElemWrapper(FORMAT_TAB_COLUMN_WIDTH);
    }

    public WebDriverElemWrapper getColumnWidthInputElem(){
        return machine.waitAndFindElemWrapper(COLUMN_WIDTH_INPUT);
    }

    public WebDriverElemWrapper getFontInput(){
        return machine.waitAndFindElemWrapper(FONT_INPUT);
    }

    public void inputFontValue(FontValue fontValue){
        getFormatTabElem().click();
        getFormatTabCellsElem().click();
        machine.getFormatCellsPromptPage().getFormatCellsFontTabElem().click();
        machine.getFormatCellsPromptPage().getFormatCellsFontInputElem().sendKeys(fontValue.getInputValue() + Keys.ENTER + Keys.ENTER);
    }

    public void assertExpectedFontValueSelected(FontValue fontValue) {
        WebDriverElemWrapper formatCellsFontInputElem = getFontInput();
        assertEquals(fontValue.getInputValue(), formatCellsFontInputElem.getDriverElement().getText().trim());
    }
}
