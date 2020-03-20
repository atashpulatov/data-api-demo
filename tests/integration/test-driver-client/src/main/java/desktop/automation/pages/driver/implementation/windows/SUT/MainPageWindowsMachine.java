package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.WindowsMachine;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.Cell;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.enums.FontValue;
import desktop.automation.pages.SUT.MainPage;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.Assert.assertEquals;

public class MainPageWindowsMachine extends MainPage {
    private static final String IMPORT_DATA_BTN_IMAGE_1 = "mainPage/importDataBtn1";
    private static final String IMPORT_DATA_BTN_IMAGE_2 = "mainPage/importDataBtn2";
    private static final String ADD_DATA_BTN_IMAGE_1 = "mainPage/addDataBtn1";
    private static final String ADD_DATA_BTN_IMAGE_2 = "mainPage/addDataBtn2";
    private static final String DATA_LOADED_SUCCESSFULLY_IMAGE_1 = "mainPage/dataLoadedSuccessfully1";
    private static final String DATA_LOADED_SUCCESSFULLY_IMAGE_2 = "mainPage/dataLoadedSuccessfully2";
    private static final String REPORT_REFRESHED_IMAGE_1 = "mainPage/reportRefreshed1";
    private static final String REPORT_REFRESHED_IMAGE_2 = "mainPage/reportRefreshed2";
    private static final String DATASET_REFRESHED_IMAGE_1 = "mainPage/datasetRefreshed1";
    private static final String DATASET_REFRESHED_IMAGE_2 = "mainPage/datasetRefreshed2";
    private static final String SESSION_EXPIRED_IMAGE = "mainPage/sessionExpiredNotification";
    private static final String MORE_ITEMS_MENU_BTN_IMGAGE_1 = "mainPage/moreItemsMenuButton_1";
    private static final String MORE_ITEMS_MENU_BTN_IMGAGE_2 = "mainPage/moreItemsMenuButton_2";
    private static final String OFFICE_ADD_IN_LOGO_IMGAGE_1 = "mainPage/OfficeAddInLogoElem_1";
    private static final String OFFICE_ADD_IN_LOGO_IMGAGE_2 = "mainPage/OfficeAddInLogoElem_2";

    private static final String ERROR_OK_BTN_IMAGE = "mainPage/errorOkBtn";



    public MainPageWindowsMachine(WindowsMachine windowsMachine) {
        super(windowsMachine);
    }
    @Override
    public AnyInterfaceElement getMoreItemsMenuElem() {
        return getMoreItemsMenuImageComparisonElem();
    }

    public ImageComparisonElem getMoreItemsMenuImageComparisonElem() {
        return new ImageComparisonElem(new String[]{MORE_ITEMS_MENU_BTN_IMGAGE_1, MORE_ITEMS_MENU_BTN_IMGAGE_2},
                1580, -1, 250, 470,
                20_000);
    }

    @Override
    public AnyInterfaceElement getOfficeAddInLogoElem() {
        return new ImageComparisonElem(new String[]{OFFICE_ADD_IN_LOGO_IMGAGE_1, OFFICE_ADD_IN_LOGO_IMGAGE_2},
                1300, 1600, 260, 500,
                20_000, 1000);
    }

    @Override
    public AnyInterfaceElement getRefreshAllBtnElem() {
        return machine.waitAndFindElemWrapper(REFRESH_ALL_BTN_ELEM);
    }

    @Override
    public WebDriverElemWrapper getImportedObjectInListNameElem(String objectName, WebDriverWait wait) {
        return machine.waitAndFindElemWrapper(By.name(objectName), wait);
    }

    @Override
    public AnyInterfaceElement getSessionExpiredNotificationElem() {
        return new ImageComparisonElem(SESSION_EXPIRED_IMAGE, 1500, 1860, 600, 660);
    }

    @Override
    public void goToCell(String cell){
        WebElement input = getCellInputElem();
        input.click();
        input.clear();
        input.sendKeys(cell + Keys.ENTER);
    }

    @Override
    public String getCurrentlySelectedCellValue(String cell) {
        return getCellObj(cell).getValue();
    }

    public void assertHeaderPresent(String header) {
        assertHeaderPresentByCellPresence(header);
    }

    protected void assertHeaderPresentByCellPresence(String header){
        getHeaderSelector(header);
    }

    @Override
    protected By getHeaderSelector(String header)  {
        String selector = String.format(COLUMN_HEADER_ELEM_BASE, header.toUpperCase());
        return By.xpath(selector);
    }

    @Override
    public void hideHeader(String header){
        WebDriverElemWrapper target = machine.getMainPage().getHeaderElem(header);
        machine.contextClickElem(target.getDriverElement());

        machine.getMainPage().getHideMenuItemElem().click();
    }

    @Override
    protected WebDriverElemWrapper getHeaderSizeInputElemFromStart(String header, boolean isColumn) {
        WebDriverElemWrapper target = getHeaderElem(header);

        new Actions(machine.driver)
                .moveToElement(target.getDriverElement())
                .click()
                .pause(500)
                .contextClick()
                .perform();

        (isColumn ? getColumnWidthMenuItemElem() : getRowHeightMenuItemElem()).click();

        return getHeaderSizeInputElem();
    }

    @Override
    public boolean isConditionalFormattingAppliedToCell(String cell) {
        return getCellObj(cell).hasConditionalFormattingApplied();
    }

    @Override
    public void inputFontValue(FontValue fontValue) {
        WebElement fontEditBoxElem = getFontEditBox().getDriverElement();
        fontEditBoxElem.clear();
        fontEditBoxElem.sendKeys(fontValue.getInputValue());
        fontEditBoxElem.sendKeys(Keys.ENTER);

    }

    @Override
    public void assertExpectedFontValueSelected(FontValue fontValue) {
        WebElement fontEditBoxElem = getFontEditBox().getDriverElement();
        assertEquals(fontEditBoxElem.getText(), fontValue.getInputValue());
    }

    public WebDriverElemWrapper getFontEditBox(){
        return machine.waitAndFindElemWrapper(FONT_INPUT_ELEM);
    }

    public Cell getCellObj(String cell){
        return Cell.getCell(machine.getDriverType(), machine.waitAndFind(By.name(getCellSelectorName(cell))));
    }

    private String getCellSelectorName(String cell){
        StringBuilder res = new StringBuilder();

        cell = cell.toUpperCase();
        for (char c : cell.toCharArray()) {
            if (Character.isAlphabetic(c)) {
                res.append("\"");
                res.append(c);
                res.append("\"");
                res.append(" ");
            }
            else
                res.append(c);
        }

        res.setLength(res.length());

        return res.toString();
    }

    @Override
    public AnyInterfaceElement getImportDataBtnElem(){
        return machine.getImageComparisonElemFallBackToWebDriver(IMPORT_DATA_BTN_ELEM, IMPORT_DATA_BTN_IMAGE_1, 1520, -1, 800, 950);
    }

    @Override
    public AnyInterfaceElement getAddDataBtnElem() {
        return machine.getImageComparisonElemFallBackToWebDriver(ADD_DATA_BTN_ELEM, ADD_DATA_BTN_IMAGE_1, 1500, 1650, 455, 525);
    }

    public AnyInterfaceElement getImportDataBtnImageComparisonElem(){
        return new ImageComparisonElem(new String[]{IMPORT_DATA_BTN_IMAGE_1, IMPORT_DATA_BTN_IMAGE_2}, 1620, 1800, 800, 950,
                15_000, 20);
    }
    public AnyInterfaceElement getAddDataBtnImageComparisonElem(){
        return new ImageComparisonElem(new String[]{ADD_DATA_BTN_IMAGE_1, ADD_DATA_BTN_IMAGE_2}, 1500, 1650, 455, 525);
    }

    @Override
    public AnyInterfaceElement getDataLoadedSuccessfullyNotification(int secondsToWaitFor){
        return new ImageComparisonElem(new String[]{DATA_LOADED_SUCCESSFULLY_IMAGE_1, DATA_LOADED_SUCCESSFULLY_IMAGE_2}, 1510, 1800, 600, 670,
                secondsToWaitFor * 1000);
    }

    @Override
    public AnyInterfaceElement getReportRefreshedMessageElem(int secondsToWaitFor){
        return new ImageComparisonElem(new String[]{REPORT_REFRESHED_IMAGE_1, REPORT_REFRESHED_IMAGE_2}, 1510, 1620, 610, 660,
                secondsToWaitFor * 1000);
    }

    public AnyInterfaceElement getDatasetRefreshedMessageElem(int secondsToWaitFor) {
        return new ImageComparisonElem(new String[]{DATASET_REFRESHED_IMAGE_1, DATASET_REFRESHED_IMAGE_2}, 1510, 1620, 610, 660,
                secondsToWaitFor * 1000);
    }

    public AnyInterfaceElement getErrorMessageOKBtnElem() {
        return machine.getImageComparisonElemFallBackToWebDriver(ERROR_OK_BTN_ELEM, ERROR_OK_BTN_IMAGE, 1625, 1780, 630, 710);
    }
}
