package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.*;
import desktop.automation.elementWrappers.driver.implementations.browser.ImportedObjectInListBrowser;
import desktop.automation.elementWrappers.driver.implementations.mac.ImportedObjectInListMacMachine;
import desktop.automation.elementWrappers.driver.implementations.windows.FontControls.SplitButton;
import desktop.automation.elementWrappers.driver.implementations.windows.FormatValue;
import desktop.automation.elementWrappers.driver.implementations.windows.ImportedObjectInListWindowsMachine;
import desktop.automation.elementWrappers.enums.FontValue;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.selectors.SUT.MainPageSelectors;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.LinkedList;
import java.util.List;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;
import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

public abstract class MainPage extends MainPageSelectors {
    //TODO move none SUT panel Elements to appropriate page objects. Elements added to MainPage class iteratively in anticipation of minimal non-SUT funtionality.
    protected Machine machine;

    public MainPage(Machine machine) {
        this.machine = machine;
    }

    public WebElement findOfficeAddInLogoElem(){
        return machine.driver.findElement(OFFICE_ADD_IN_LOGO_ELEM);
    }

    public abstract AnyInterfaceElement getMoreItemsMenuElem();

    public ImageComparisonElem getMissingReportBindIdImageComparisonElem(){
        return new ImageComparisonElem("mainPage/missingReportBindId", 1500, 1750, 560, 680);
    }

    public RemoteWebElement getUsernameLblElem(String username){
        return machine.waitAndFind(By.name(username));
    }

    public RemoteWebElement getImportedDataTabElem(){
        return machine.waitAndFind(IMPORTED_DATA_TAB_ELEM);
    }

    public AnyInterfaceElement getOfficeAddInLogoElem(){
        return machine.waitAndFindElemWrapper(OFFICE_ADD_IN_LOGO_ELEM);
    }

    public abstract AnyInterfaceElement getImportDataBtnElem();

    public AnyInterfaceElement getAddDataBtnElem(){
        machine.waitForAddInFrameReadyForBrowser();
        return new WebDriverElemWrapper(machine.waitAndFind(ADD_DATA_BTN_ELEM));
    }

    public AnyInterfaceElement getImportOrAddDataBtnElem(Boolean isFirstImport){
        if (isFirstImport == null) {
            try {
                return getAddDataBtnElem();
            } catch (org.openqa.selenium.TimeoutException e) {
                return getImportDataBtnElem();
            }
        }
        else if (isFirstImport)
            return getImportDataBtnElem();
        else
            return getAddDataBtnElem();
    }

    public RemoteWebElement getAddInPaneElem(){
        return machine.waitAndFind(ADD_IN_PANE_ELEM);
    }

    public RemoteWebElement getNoImportedObjectsLblElem(){
        return machine.waitAndFind(NO_IMPORTED_OBJECTS_LBL_ELEM);
    }

    public abstract AnyInterfaceElement getRefreshAllBtnElem();

    public abstract WebDriverElemWrapper getImportedObjectInListNameElem(String objectName, WebDriverWait wait);

    protected WebDriverElemWrapper getImportObjectInListElemHelper(String objectName, WebDriverWait wait){
        List<ImportedObjectInList> importedObjectsInList = getImportedObjectsInList(wait);
        for (ImportedObjectInList importedObjectInList : importedObjectsInList) {
            if (importedObjectInList.getName().equals(objectName))
                return new WebDriverElemWrapper(importedObjectInList.getNameElem());
        }

        throw new RuntimeException(String.format("Did not find any objects in the imported list of objects that matches the name: %s, found object count: %d", objectName, importedObjectsInList.size()));

    }

    public WebDriverElemWrapper getImportedObjectInListNameElem(String objectName) {
        //retrieving the name this way instead of utilizing getImportedObjectsInList().get(index).assertNameIsAsExpected(objectName) is much faster on Windows
        return getImportedObjectInListNameElem(objectName, machine.ONE_UNIT);
    }

    public void scrollPanel(int times){
        RemoteWebElement target = getNoImportedObjectsLblElem();

        target.click();
        for (int i = 0; i < times; i++) {
            target.sendKeys(Keys.PAGE_DOWN);
        }
    }

    public RemoteWebElement getLimitsExceededErrorMessageElem(){
        return machine.waitAndFind(LIMITS_EXCEEDED_ERROR_MESSAGE_ELEM, machine.TWO_UNITS);
    }

    public RemoteWebElement getThisObjectCannotBeImportedErrorMessageElem(){
        return machine.waitAndFind(THIS_OBJECT_CANNOT_BE_IMPORTED_ERROR_MESSAGE);
    }

    public RemoteWebElement getRangeNotEmptyMessageElem(){
        machine.focusOnAddInFrameForBrowser();
        return machine.waitAndFind(RANGE_NOT_EMPTY_MESSAGE);
    }

    public WebElement getCubeNotPublishedMessageElem() {
        return machine.waitAndFind(CUBE_NOT_PUBLISHED_ERROR_MESSAGE);
    }

    public void assertCubeNotPublishedMessageElemNotPresent(){
        machine.focusOnAddInFrameForBrowser();
        machine.assertNotPresent(CUBE_NOT_PUBLISHED_ERROR_MESSAGE);
    }

    public WebElement getProjectLimitsExceededErrorMessageElem(){
        return machine.waitAndFind(PROJECTS_LIMITS_EXCEEDED_ERROR_MESSAGE);
    }

    public void assertProjectLimitsExceededErrorMessageNotPresent(){
        machine.focusOnAddInFrameForBrowser();
        machine.assertNotPresent(PROJECTS_LIMITS_EXCEEDED_ERROR_MESSAGE);
    }

    public AnyInterfaceElement getSessionExpiredNotificationElem() {
        machine.focusOnAddInFrameForBrowser();
        return machine.waitAndFindElemWrapper(SESSION_EXPIRED_NOTIFICATION);
    }

    public AnyInterfaceElement getErrorMessageOKBtnElem() {
        if (machine.isBrowser()) {
            try {
                Thread.sleep(1_000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return machine.waitAndFindElemWrapper(ERROR_OK_BTN_ELEM);
    }

    public void assertErrorMessageOKBtnElemNotPresent(){
        machine.focusOnAddInFrameForBrowser();
        machine.assertNotPresent(ERROR_OK_BTN_ELEM);
    }

    public void assertRangeNotEmptyMessageElemNotPresent(){
        machine.focusOnAddInFrameForBrowser();
        machine.assertNotPresent(RANGE_NOT_EMPTY_MESSAGE);
    }

    public void assertLimitsExceededErrorMessageElemNotPresent(){
        machine.focusOnAddInFrameForBrowser();
        machine.assertNotPresent(LIMITS_EXCEEDED_ERROR_MESSAGE_ELEM);
    }

    public void assertThisObjectCannotBeImportedErrorMessageNotPresent(){
        machine.focusOnAddInFrameForBrowser();
        machine.assertNotPresent(THIS_OBJECT_CANNOT_BE_IMPORTED_ERROR_MESSAGE);
    }

    public abstract void goToCell(String cell);

    public abstract String getCurrentlySelectedCellValue(String cell);

    public void goToCellAndAssertValue(String cell, String value) {
        if (machine.isBrowser())
            machine.focusOnExcelFrameForBrowser();
        goToCell(cell);
        String resVal = getCurrentlySelectedCellValue(cell);
        if (resVal != null)
            resVal = resVal.trim();
        assertEquals(value, resVal);
    }

    public WebElement getCellInputElem(){
        return machine.waitAndFind(CELL_TRAVERSAL_INPUT_ELEM);
    }

    public WebElement getImportedObjectListElem(){
        WebElement element = machine.waitAndFind(IMPORTED_OBJECT_LIST_ELEM, machine.TWO_UNITS);
        return element;
    }

    public List<ImportedObjectInList> getImportedObjectsInList() {
        return getImportedObjectsInList(machine.ONE_UNIT);
    }

    public List<ImportedObjectInList> getImportedObjectsInList(WebDriverWait wait) {
        List<ImportedObjectInList> res = new LinkedList<>();
        List<WebElement> items;
        try {
            machine.waitForAddInFrameReadyForBrowser();
            machine.waitAndFindInElement(getImportedObjectListElem(), IMPORTED_OBJECT_ROOT_ELEM, wait);
            items = getImportedObjectListElem().findElements(IMPORTED_OBJECT_ROOT_ELEM);
        } catch (org.openqa.selenium.TimeoutException e){
            return res;
        }
        for (WebElement item : items) {
            switch (DESIRED_DRIVER_TYPE){
                case BROWSER:
                    res.add(new ImportedObjectInListBrowser(new WebDriverElemWrapper(item), machine));
                    break;
                case MAC_DESKTOP:
                    res.add(new ImportedObjectInListMacMachine(new WebDriverElemWrapper(item), machine));
                    break;
                case WINDOWS_DESKTOP:
                    res.add(new ImportedObjectInListWindowsMachine(new WebDriverElemWrapper(item), machine));
                    break;
                default:
                    throw new NotImplementedForDriverWrapperException();
            }
        }

        return res;
    }

    public WebDriverElemWrapper getHeaderElem(String header) {
        return getHeaderElem(header, machine.ONE_UNIT);
    }

    public WebDriverElemWrapper getHeaderElem(String header, WebDriverWait wait) {
        machine.focusOnExcelFrameForBrowser();
        return machine.waitAndFindElemWrapper(getHeaderSelector(header), wait);
    }

    public void assertHeaderNotPresent(String header){
        machine.focusOnAddInFrameForBrowser();
        machine.assertNotPresent(getHeaderSelector(header));
    }

    protected abstract By getHeaderSelector(String header);

    private WebElement getMenuItemElem(String menuItemName){
        String selector = String.format(COLUMN_CONTEXT_MENU_ITEM_ELEM_BASE, menuItemName);

        return machine.waitAndFind(By.xpath(selector));
    }

    public WebDriverElemWrapper getHeaderSizeInputElem(){
        return machine.waitAndFindElemWrapper(HEADER_SIZE_INPUT_ELEM);
    }

    public WebElement getHideMenuItemElem(){
        return getMenuItemElem("Hide");
    }

    public WebElement getUnhideMenuItemElem(){
        return getMenuItemElem("Unhide");
    }

    public WebElement getColumnWidthMenuItemElem(){
        return getMenuItemElem("Column Width...");
    }

    public WebElement getRowHeightMenuItemElem(){
        return getMenuItemElem("Row Height...");
    }

    public WebElement getFormatCellsMenuItemElem() {
        return getMenuItemElem("Format Cells...");
    }

    public abstract void hideHeader(String header);

    protected void hideHeaderByCellContextMenu(String header){
        WebDriverElemWrapper target = machine.getMainPage().getHeaderElem(header);
        machine.contextClickElem(target.getDriverElement());

        machine.getMainPage().getHideMenuItemElem().click();
    }

    public void unhideHeader(String nameLeftHeader, String nameRightHeader) {
        new Actions(machine.driver)
                .moveToElement(machine.getMainPage().getHeaderElem("C").getDriverElement())
                .click()
                .pause(500)
                .clickAndHold()
                .moveToElement(machine.getMainPage().getHeaderElem("E").getDriverElement())
                .release()
                .contextClick()
                .perform();

        machine.getMainPage().getUnhideMenuItemElem().click();
    }


    private void changeHeaderSize(String header, double size, boolean isColumn){
        Dimension initialHeaderSize = machine.isBrowser() ? getHeaderElem(header).getDriverElement().getSize() : null;
        WebDriverElemWrapper input = getHeaderSizeInputElemFromStart(header, isColumn);

        if (machine.isBrowser()) {
            input.sendKeys(size + "");
            getHeaderSizePromptOKBtnElem().click();

            //after clicking OK button the headers need time to readjust
            waitForHeaderSizeToChange(initialHeaderSize, header);
        }
        else {
            input.sendKeys((int)size + "");
            input.sendKeys(Keys.ENTER);
        }
    }

    protected void waitForHeaderSizeToChange(Dimension initialHeaderSize, String header){
        //wait for size to change, in case the header is hidden, then return

        long start = System.currentTimeMillis();
        Dimension actual;
        try {
            do {
                try {
                    actual = getHeaderElem(header, machine.QUARTER_UNIT).getDriverElement().getSize();
                    try {
                        Thread.sleep(300);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                } catch (StaleElementReferenceException e) {
                    actual = getHeaderElem(header, machine.QUARTER_UNIT).getDriverElement().getSize();
                }
            } while (initialHeaderSize.equals(actual) && System.currentTimeMillis() - start < 10_000);
        } catch (org.openqa.selenium.TimeoutException ignored) {}
    }

    public WebDriverElemWrapper getHeaderSizePromptOKBtnElem(){
        return machine.waitAndFindElemWrapper(HEADER_SIZE_PROMPT_OK_BTN);
    }

    protected abstract WebDriverElemWrapper getHeaderSizeInputElemFromStart(String header, boolean isColumn);

    public double getHeaderSize(String header, boolean isColumn){
        WebDriverElemWrapper inputElem = getHeaderSizeInputElemFromStart(header, isColumn);

        String resStr = inputElem.getText().replace(",", ".");
        double res = Double.parseDouble(resStr);
        if (machine.isBrowser())
            getHeaderSizePromptOKBtnElem().click();
        else
            inputElem.sendKeys(Keys.ENTER);

        return res;
    }

    public void changeColumnWidth(String column, double width) {
        changeHeaderSize(column, width, true);
    }

    public void changeRowHeight(String row, double height) {
        changeHeaderSize(row, height, false);
    }

    public ToggleButton getBoldToggleButton(){
        machine.focusOnExcelFrameForBrowser();
        return ToggleButton.getToggleButton(machine.getDriverType(), machine.waitAndFindElemWrapper(BOLD_BUTTON_ELEM));
    }

    public void assertThatCellsAreBolded(String[] cells){
        for (String cell : cells) {
            goToCell(cell);
            if (!machine.isWindowsMachine()) {
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            assertTrue(String.format("Cell %s expected to be bold, is not", cell), getBoldToggleButton().isOn());
        }
    }

    public ToggleButton getItalicToggleButton(){
        machine.focusOnExcelFrameForBrowser();
        return ToggleButton.getToggleButton(machine.getDriverType(), machine.waitAndFindElemWrapper(ITALIC_BUTTON_ELEM));
    }

    public ToggleButton getUnderlineToggleButton(){
        machine.focusOnExcelFrameForBrowser();
        return ToggleButton.getToggleButton(machine.getDriverType(), machine.waitAndFindElemWrapper(UNDERLINE_BUTTON_ELEM));
    }

    public AnyInterfaceElement getReportRefreshedMessageElem(){
        machine.focusOnAddInFrameForBrowser();
        return getReportRefreshedMessageElem(40);
    }

    public AnyInterfaceElement getReportRefreshedMessageElem(int secondsToWaitFor){
        machine.focusOnAddInFrameForBrowser();
        WebDriverWait wait = new WebDriverWait(machine.driver, secondsToWaitFor);
        return machine.waitAndFindElemWrapper(REPORT_REFRESHED_MESSAGE_ELEM, wait);
    }

    public AnyInterfaceElement getDataLoadedSuccessfullyNotification() {
        return getDataLoadedSuccessfullyNotification(40);
    }

    public AnyInterfaceElement getDataLoadedSuccessfullyNotification(int secondsToWaitFor){
        WebDriverWait wait = new WebDriverWait(machine.driver, secondsToWaitFor);
        return getDataLoaddedSuccessfullyNotificationHelper(wait);
    }

    protected AnyInterfaceElement getDataLoaddedSuccessfullyNotificationHelper(WebDriverWait wait) {
        machine.focusOnAddInFrameForBrowser();
        return machine.waitAndFindElemWrapper(DATA_LOADED_SUCCESSFULLY_NOTIFICATION_ELEM, wait);
    }

    public AnyInterfaceElement getDatasetRefreshedMessageElem() {
        return getDatasetRefreshedMessageElem(40);
    }

    public AnyInterfaceElement getDatasetRefreshedMessageElem(int secondsToWaitFor) {
        WebDriverWait wait = new WebDriverWait(machine.driver, secondsToWaitFor);
        return getDatasetRefreshedMessageElem(wait);
    }

    public AnyInterfaceElement getDatasetRefreshedMessageElem(WebDriverWait wait){
        machine.focusOnAddInFrameForBrowser();
        return machine.waitAndFindElemWrapper(DATASET_REFRESHED_MESSAGE_ELEM, wait);
    }

    public SplitButton getFillColorSplitButton(){
        return new SplitButton(getFontGroupChildren().get(17));
    }

    public SplitButton getFontColorSplitButton(){
        return new SplitButton(getFontGroupChildren().get(20));
    }

    private WebElement getFontGroupElem(){
        return machine.waitAndFind(By.name("Font"));
    }

    private List<WebElement> getFontGroupChildren(){
        return machine.getChildren((RemoteWebElement) getFontGroupElem());
    }

    public FormatValue getCellFormatValueElem(String formatValue){
        return new FormatValue(machine.waitAndFind(By.xpath(String.format(CELL_FORMAT_VALUE_BASE, formatValue))));
    }

    public WebElement getFormatValuePaneOKBtnElem(){
        return machine.waitAndFind(FORMAT_VALUE_PANE_OK_BTN);
    }

    public WebElement getCopyContextMenuElem() {
        return machine.waitAndFind(IMPORTED_OBJECT_COPY_CONTEXT_MENU_ELEM);
    }

    public WebElement getRenameContextMenuElem() {
        return machine.waitAndFind(IMPORTED_OBJECT_RENAME_CONTEXT_MENU_ELEM);
    }

    public WebElement getReportRemovedRemovedMessageElem(){
        return machine.waitAndFind(REPORT_REMOVED_MESSAGE_ELEM);
    }

    public WebElement getDatasetRemovedRemovedMessageElem(){
        return machine.waitAndFind(DATASET_REMOVED_MESSAGE_ELEM);
    }

    public void assertObjectImportAndCellValues(String objectName, String[][] cellExpectedValues){
        getImportedObjectInListNameElem(objectName);

        assertCellValues(cellExpectedValues);
    }

    public void assertImportedObjectListNames(String[] expectedNames){
        List<ImportedObjectInList> importedObjectInLists = getImportedObjectsInList();
        assertEquals(expectedNames.length, importedObjectInLists.size());

        for (int i = 0; i < expectedNames.length; i++)
            assertEquals(expectedNames[i], importedObjectInLists.get(i).getNameElem().getText());
    }

    public void assertCellValues(String[][] cellExpectedValues) {
        for (String[] cellExpectedValue : cellExpectedValues)
            goToCellAndAssertValue(cellExpectedValue[0], cellExpectedValue[1]);
    }

    public WebElement getClearDataBtnElem() {
        return machine.waitAndFind(CLEAR_DATA_BTN_ELEM);
    }

    //TODO assert same implementation as in Mac automation suite works correctly
    public void assertDataClearedPanelElemsLoaded(){
        getDataClearedImageElem();
        getDataClearedTitleElem();
        getDataClearedMessageElem();
        getViewDataBtnElem();
    }

    public WebElement getDataClearedImageElem(){
        return machine.waitAndFind(DATA_CLEARED_IMAGE);
    }

    public WebElement getDataClearedTitleElem(){
        return machine.waitAndFind(DATA_CLEARED_TITLE);
    }

    public WebElement getDataClearedMessageElem(){
        return machine.waitAndFind(DATA_CLEARED_MESSAGE);
    }

    public WebElement getViewDataBtnElem(){
        return machine.waitAndFind(VIEW_DATA_BTN);
    }

    public WebElement getFormatCellsPromptSampleElem(){
        return machine.waitAndFind(FORMAT_CELLS_PROMPT_SAMPLE);
    }

    public WebDriverElemWrapper findDialogOpenNotificationElem(){
        return new WebDriverElemWrapper(machine.driver.findElement(DIALOG_OPEN_NOTIFICATION));
    }

    public abstract boolean isConditionalFormattingAppliedToCell(String cell);

    public abstract void inputFontValue(FontValue fontValue);

    public abstract void assertExpectedFontValueSelected(FontValue fontValue);

    protected static boolean isRowHeader(String header) {
        return Character.isAlphabetic(header.toCharArray()[0]);
    }
}
