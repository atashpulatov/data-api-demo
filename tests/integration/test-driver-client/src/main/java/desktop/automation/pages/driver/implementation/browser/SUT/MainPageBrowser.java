package desktop.automation.pages.driver.implementation.browser.SUT;

import desktop.automation.driver.wrappers.Browser;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.enums.FontValue;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.MainPage;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

import static junit.framework.TestCase.assertEquals;

public class MainPageBrowser extends MainPage {
    private static final By FORMAT_CELLS_PROMPT_BTN_ELEMS = By.cssSelector("#buttonarea > .ewa-dlg-button");
    private static final By MENU_ELEM = By.cssSelector("m_excelWebRenderer_ewaCtl_gridMenuId");
    private static final By HIDE_ROWS_MENU_ITEM_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_gridMenuId #ContextMenu\\.HideRows-Menu16");
    private static final By HIDE_COLUMNS_MENU_ITEM_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_gridMenuId #ContextMenu\\.HideColumns-Menu16");
    private static final By COLUMN_WIDTH_MENU_ITEM_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_gridMenuId #ContextMenu\\.ColumnWidth-Menu16");
    private static final By ROWS_HEIGHT_MENU_ITEM_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_gridMenuId #ContextMenu\\.RowHeight-Menu16");
    private static final By FONT_INPUT_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_Font\\.FontName");
    private static final By FONT_INPUT_DROP_DOWN_ELEM = By.cssSelector("#m_excelWebRenderer_ewaCtl_Font\\.FontName-Medium > a");
    private static final By CELL_FORMATTING_MENU_DROP_DOWN_ELEM = By.xpath("//span[contains(@id,'m_excelWebRenderer_ewaCtl_Number')]/a");
    private static final By CELL_FORMATTING_MENU_MORE_NUMBER_FORMATS_OPTION_ELEM = By.id("m_excelWebRenderer_ewaCtl_Number.NumberFormatDialog-Menu32");

    public MainPageBrowser(Browser browser) {
        super(browser);
    }

    @Override
    public AnyInterfaceElement getMoreItemsMenuElem() {
        machine.waitForAddInFrameReadyForBrowser();
        return machine.waitAndFindElemWrapper(MORE_ITEMS_MENU_BTN);
    }

    @Override
    public WebDriverElemWrapper getImportDataBtnElem() {
        machine.waitForAddInFrameReadyForBrowser();
        return machine.waitAndFindElemWrapper(IMPORT_DATA_BTN_ELEM);
    }

    @Override
    public AnyInterfaceElement getRefreshAllBtnElem() {
        machine.waitForAddInFrameReadyForBrowser();
        return machine.waitAndFindElemWrapper(REFRESH_ALL_BTN_ELEM);
    }

    @Override
    public WebDriverElemWrapper getImportedObjectInListNameElem(String objectName, WebDriverWait wait) {
        return getImportObjectInListElemHelper(objectName, wait);
    }

    @Override
    public void goToCell(String cell) {
        cell = cell.toUpperCase();

        String cellInputValue;
        int i = 0;
        do {
            machine.focusOnExcelFrameForBrowser();
            WebDriverElemWrapper cellInput = machine.waitAndFindElemWrapper(CELL_TRAVERSAL_INPUT_ELEM);
            machine.actions
                    .click(cellInput.getDriverElement())
                    .sendKeys(cell)
                    .sendKeys(Keys.ENTER)
                    .perform();
            cellInputValue = cellInput.getText();
        } while (!cellInputValue.equals(cell) && i++ < 3);
    }

    @Override
    public String getCurrentlySelectedCellValue(String cell) {
        machine.clickObject(getCellFormattingDropDownElem());
        getCellFormattingMenuMoreNumberFormatsOptionElem().click();

        WebElement sampleInputElem = getFormatCellsPromptSampleElem();

        String res = sampleInputElem.getAttribute("value");
        //TODO tmp solution for formatting ans since the browser account has different number delimiter settings
        res = formatRes(res);

        getFormatCellsPromptBtnElems().get(1).click();
        return res.equals("") ? null : res;
    }

    public List<WebElement> getFormatCellsPromptBtnElems(){
        return machine.driver.findElements(FORMAT_CELLS_PROMPT_BTN_ELEMS);
    }

    public WebElement getCellFormattingMenuMoreNumberFormatsOptionElem(){
        return machine.waitAndFind(CELL_FORMATTING_MENU_MORE_NUMBER_FORMATS_OPTION_ELEM);
    }

    public WebElement getCellFormattingDropDownElem(){
        machine.ONE_UNIT.until(ExpectedConditions.elementToBeClickable(CELL_FORMATTING_MENU_DROP_DOWN_ELEM));
        return machine.waitAndFind(CELL_FORMATTING_MENU_DROP_DOWN_ELEM);
    }

    private String formatRes(String original){
        if (original == null || original.length() < 2)
            return original;

        char[] tmp = original.toCharArray();
        char prev = tmp[0];
        char target = tmp[1];
        for (int i = 1; i < tmp.length - 1; i++) {
            char next = tmp[i + 1];

            if (Character.isDigit(prev) && Character.isDigit(next)) {
                switch (target){
                    case ',':
                        tmp[i] = ' ';
                        break;
                    case '.':
                        tmp[i] = ',';
                        break;
                }
            }
            prev = target;
            target = next;
        }

        return new String(tmp);
    }

    @Override
    protected By getHeaderSelector(String header)  {
        String selector = String.format(COLUMN_HEADER_ELEM_BASE, header.toUpperCase());
        return By.xpath(selector);
    }
    @Override
    public void hideHeader(String header) {
        Dimension initialHeaderSize = getHeaderElem(header).getDriverElement().getSize();
        openHeaderContextMenu(header);

        (isRowHeader(header) ? getHideRowsMenuItemElem() : getHideColumnsMenuItemElem()).click();

        waitForHeaderSizeToChange(initialHeaderSize, header);
    }

    public void openHeaderContextMenu(String header){
        machine.contextClickElem(getHeaderElem(header).getDriverElement());

        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        try {
            findMenuElem();
        } catch (NoSuchElementException e){
            machine.contextClickElem(getHeaderElem(header).getDriverElement());
        }
    }

    public WebDriverElemWrapper findMenuElem(){
        return new WebDriverElemWrapper(machine.driver.findElement(MENU_ELEM));
    }

    public WebDriverElemWrapper getHideRowsMenuItemElem(){
        return machine.waitAndFindElemWrapper(HIDE_ROWS_MENU_ITEM_ELEM);
    }

    public WebDriverElemWrapper getHideColumnsMenuItemElem(){
        return machine.waitAndFindElemWrapper(HIDE_COLUMNS_MENU_ITEM_ELEM);
    }

    public WebElement getColumnWidthMenuItemElem(){
        return machine.waitAndFind(COLUMN_WIDTH_MENU_ITEM_ELEM);
    }

    public WebElement getRowHeightMenuItemElem(){
        return machine.waitAndFind(ROWS_HEIGHT_MENU_ITEM_ELEM);
    }

    @Override
    protected WebDriverElemWrapper getHeaderSizeInputElemFromStart(String header, boolean isColumn) {
        openHeaderContextMenu(header);

        (isColumn ? getColumnWidthMenuItemElem() : getRowHeightMenuItemElem()).click();

        return getHeaderSizeInputElem();
    }

    @Override
    public boolean isConditionalFormattingAppliedToCell(String cell) {
        throw new NotImplementedForDriverWrapperException();
    }

    @Override
    public void inputFontValue(FontValue fontValue) {
        machine.focusOnExcelFrameForBrowser();
        getFontInputDropDownBtnElem().click();
        machine.waitAndFindElemWrapper(fontValue.getBrowserDropDownSelector()).click();
    }

    public WebDriverElemWrapper getFontInputElem(){
        return machine.waitAndFindElemWrapper(FONT_INPUT_ELEM);
    }

    public WebDriverElemWrapper getFontInputDropDownBtnElem(){
        return machine.waitAndFindElemWrapper(FONT_INPUT_DROP_DOWN_ELEM);
    }

    @Override
    public void assertExpectedFontValueSelected(FontValue fontValue) {
        assertEquals(fontValue.getInputValue(), getFontInputElem().getText());
    }
}
