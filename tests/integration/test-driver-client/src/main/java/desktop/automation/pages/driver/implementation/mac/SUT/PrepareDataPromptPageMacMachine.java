package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.MacMachine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.driver.implementations.mac.WebElementWithBooleanAXValue;
import desktop.automation.pages.SUT.PrepareDataPromptPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class PrepareDataPromptPageMacMachine extends PrepareDataPromptPage {

    private static final String TITLE_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='%s > %s']";
    private static final By TITLE_START_REPORT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='Import Report > ']");
    private static final By TITLE_START_REPORT_CROSSTAB = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXStaticText[@AXValue='Import Report > ']");
    private static final By TITLE_START_DATASET = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='Import Dataset > ']");
    private static final By TITLE_START_DATASET_CROSSTAB = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXStaticText[@AXValue='Import Dataset > ']");
    private static final String TITLE_NAME_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='%s']";
    private static final String TITLE_NAME_BASE_CROSSTAB = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXStaticText[@AXValue='%s']";
    private static final By ATTRIBUTES_TITLE_START = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[0]");
    private static final By ATTRIBUTE_TITLE_OPEN_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[1]");
    private static final By ATTRIBUTE_TITLE_SELECTED_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[2]");
    private static final By ATTRIBUTE_TITLE_COUNT_SEPARATOR = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[3]");
    private static final By ATTRIBUTE_TITLE_TOTAL_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[4]");
    private static final By ATTRIBUTE_TITLE_CLOSE_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[5]");
    private static final String ATTRIBUTE_BASE_REPORT ="/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[%d]";
    private static final String ATTRIBUTE_BASE_DATASET = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";

    private static final String ATTRIBUTE_CHECKBOX_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";
    private static final By FIRST_ATTRIBUTE = By.xpath(String.format(ATTRIBUTE_BASE, 0));

    private static final By METRIC_TITLE_START = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[0]");
    private static final By METRIC_TITLE_OPEN_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[1]");
    private static final By METRIC_TITLE_SELECTED_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[2]");
    private static final By METRIC_TITLE_COUNT_SEPARATOR = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[3]");
    private static final By METRIC_TITLE_TOTAL_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[4]");
    private static final By METRIC_TITLE_CLOSE_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[5]");
    private static final String METRIC_BASE_DATASET = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[1]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox";
    private static final String METRIC_BASE_REPORT ="/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox";

    private static final String METRIC_CHECKBOX_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[1]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";

    private static final By FILTERS_TITLE_START = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[0]");
    private static final By FILTERS_TITLE_OPEN_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[1]");
    private static final By FILTERS_TITLE_SELECTED_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[2]");
    private static final By FILTERS_TITLE_COUNT_SEPARATOR = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[3]");
    private static final By FILTERS_TITLE_TOTAL_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[4]");
    private static final By FILTERS_TITLE_CLOSE_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[5]");
    private static final String FILTER_BASE_DATASET = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[%d]";
    private static final String FILTER_BASE_REPORT = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[1]/AXRow[%d]";

    private static final String FILTER_VALUE_BASE_DATASET = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[2]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]";
    private static final String FILTER_VALUE_BASE_REPORT = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[1]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]";

    private static final By ATTRIBUTE_ALL_CHECKBOX_DATASET = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[4]/AXGroup[0]/AXCheckBox[0]");
    private static final String ATTRIBUTE_ALL_CHECKBOX_BASE_REPORT = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";

    private static final By METRIC_ALL_CHECKBOX_DATASET = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[6]/AXGroup[0]/AXCheckBox[0]");
    private static final String METRIC_ALL_CHECKBOX_BASE_REPORT = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";
    private static final By FILTER_VALUE_ALL_CHECKBOX_DATASET = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[9]/AXGroup[0]/AXCheckBox[0]");
    private static final String FILTER_VALUE_ALL_CHECKBOX_BASE_REPORT = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";

    private static final String FILTER_VALUE_CHECKBOX_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[2]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";

    //TODO images have no uniquely identifying attributes apart from coordinates and size, better use image recognition
    private static final By ATTRIBUTE_COLUMN_NO_DATA_TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[@AXValue='No data']");
    private static final By METRIC_COLUMN_NO_DATA_TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[8]/AXStaticText[@AXValue='No data']");
    private static final By FILTER_COLUMN_NO_DATA_TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[11]/AXStaticText[@AXValue='No data']");
    private static final By FILTER_VALUE_COLUMN_NO_DATA_TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[14]/AXStaticText[@AXValue='No data']");

    private static final By SUBTOTALS_AND_TOTALS_SWITCH = By.xpath(     "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[0]/AXCheckBox[@AXDOMIdentifier='view-selected-switch' and @AXSubrole='AXSwitch']");
    private static final By VIEW_SELECTED_SWITCH = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXCheckBox[@AXDOMIdentifier='view-selected-switch' and @AXSubrole='AXSwitch']");

    private static final By BACK_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[12]/AXButton[@AXTitle='Back' and @AXDOMIdentifier='back']");
    private static final By DATA_PREVIEW_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[12]/AXButton[@AXTitle='Data Preview' and @AXDOMIdentifier='data-preview']");
    private static final By IMPORT_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXButton[@AXTitle='Import' and @AXDOMIdentifier='import']");
    private static final By IMPORT_BTN_DISABLED = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[12]/AXGroup[1]/AXButton");
    private static final By CANCEL_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[12]/AXButton[@AXTitle='Cancel' and @AXDOMIdentifier='cancel']");

    private static final By FILTER_VALUE_PANE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[2]");

    private static final By FILTER_EXCLUDES_ALL_DATA_ERROR_MESSAGE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[14]/AXGroup[0]/AXGroup[0]/AXStaticText[@AXValue='The selected filter excludes all data']");

    public PrepareDataPromptPageMacMachine(MacMachine machine) {
        super(machine);
    }

    public WebElement getTitleStartElem(boolean isDataset){
        if (isCrosstabReport()){
            return machine.waitAndFind(isDataset ? TITLE_START_DATASET_CROSSTAB : TITLE_START_REPORT_CROSSTAB);
        } else {
            return machine.waitAndFind(isDataset ? TITLE_START_DATASET : TITLE_START_REPORT);
        }
    }

    public WebElement getTitleNameElem(String objectName){
        if (isCrosstabReport()){
            return machine.waitAndFind(By.xpath(String.format(TITLE_NAME_BASE_CROSSTAB, objectName)));
        } else {
            return machine.waitAndFind(By.xpath(String.format(TITLE_NAME_BASE, objectName)));
        }
    }

    public void assertAttributeTitleLoadedCorrectly(int countSelected, int totalCount){
        //TODO verify method works
        String expected = String.format("ATTRIBUTES(%d/%d)", countSelected, totalCount);

        String actual = new StringBuilder()
                .append(getAttributesTitleStartElem().getText())
                .append(getAttributeTitleOpenParenthesesElem().getText())
                .append(getAttributeSelectedCountElem().getText())
                .append(getAttributeTitleCountSeperatorElem().getText())
                .append(getAttributeTotalCountElem().getText())
                .append(getAttributeTotalCountElem().getText())
                .append(getAttributeTitleCloseParnethesesElem().getText())
                .toString();

        assertEquals(expected, actual);
    }

    public WebElement getAttributesTitleStartElem(){
        return machine.waitAndFind(ATTRIBUTES_TITLE_START);
    }

    public WebElement getAttributeTitleOpenParenthesesElem(){
        return machine.waitAndFind(ATTRIBUTE_TITLE_OPEN_PARENTHESES);
    }

    public WebElement getAttributeSelectedCountElem(){
        return machine.waitAndFind(ATTRIBUTE_TITLE_SELECTED_COUNT);
    }

    public WebElement getAttributeTitleCountSeperatorElem(){
        return machine.waitAndFind(ATTRIBUTE_TITLE_COUNT_SEPARATOR);
    }

    public WebElement getAttributeTotalCountElem(){
        return machine.waitAndFind(ATTRIBUTE_TITLE_TOTAL_COUNT);
    }

    public WebElement getAttributeTitleCloseParnethesesElem(){
        return machine.waitAndFind(ATTRIBUTE_TITLE_CLOSE_PARENTHESES);
    }

    public WebElement getAttributeElemFirst(){
        return machine.waitAndFind(FIRST_ATTRIBUTE);
    }

    @Override
    public void assertPrepareDataPromptTitlePresent(boolean isDataset, String objectName) {
        getTitleStartElem(isDataset);
        getTitleNameElem(objectName);
    }

    @Override
    public WebDriverElemWrapper[] getAttributes(int[] attributes){
        WebDriverElemWrapper[] res = new WebDriverElemWrapper[attributes.length];

        for (int i = 0; i < attributes.length; i++) {
            int index = attributes[i];
            res[i] = getAttributeElemByIndex(index);
        }

        return res;
    }

    @Override
    public WebDriverElemWrapper[] getMetrics(int[] metrics) {
        WebDriverElemWrapper[] res = new WebDriverElemWrapper[metrics.length];

        for (int i = 0; i < metrics.length; i++) {
            int index = metrics[i];
            res[i] = getMetricElemByIndex(index);
        }

        return res;
    }

    @Override
    public WebDriverElemWrapper[] getFilters(int[] filter) {
        WebDriverElemWrapper[] res = new WebDriverElemWrapper[filter.length];

        for (int i = 0; i < filter.length; i++) {
            int index = filter[i];
            res[i] = getFilterElemByIndex(index);
        }

        return res;
    }

    @Override
    public WebDriverElemWrapper[] getFilterValues(int[] filterValues) {
        WebDriverElemWrapper[] res = new WebDriverElemWrapper[filterValues.length];

        for (int i = 0; i < filterValues.length; i++) {
            int index = filterValues[i];
            res[i] = getFilterValueByIndex(index);
        }

        return res;
    }

    public WebDriverElemWrapper getAttributeElemByIndex(int index){
        if (index == -1)
            return getAttributeAllCheckboxElem();
        else
            return machine.waitAndFindElemWrapper(By.xpath(String.format(isDataset ? ATTRIBUTE_BASE_DATASET : ATTRIBUTE_BASE_REPORT, index)));
    }

    public void assertMetricTitleLoadedCorrectly(int selected, int total){
        //TODO verify method works
        String expected = String.format("METRICS(%d/%d)", selected, total);

        String actual = new StringBuilder()
                .append(getMetricTitleStartElem().getText())
                .append(getMetricTitleOpenParenthesesElem().getText())
                .append(getMetricTitleSelectedCountElem().getText())
                .append(getMetricTitleCountSeparatorElem().getText())
                .append(getMetricTitleTotalCountElem().getText())
                .append(getMetricTitleCloseParenthesesElem().getText())
                .toString();

        assertEquals(expected, actual);
    }

    public WebElement getMetricTitleStartElem(){
        return machine.waitAndFind(METRIC_TITLE_START);
    }

    public WebElement getMetricTitleOpenParenthesesElem(){
        return machine.waitAndFind(METRIC_TITLE_OPEN_PARENTHESES);
    }

    public WebElement getMetricTitleSelectedCountElem(){
        return machine.waitAndFind(METRIC_TITLE_SELECTED_COUNT);
    }

    public WebElement getMetricTitleCountSeparatorElem(){
        return machine.waitAndFind(METRIC_TITLE_COUNT_SEPARATOR);
    }

    public WebElement getMetricTitleTotalCountElem(){
        return machine.waitAndFind(METRIC_TITLE_TOTAL_COUNT);
    }

    public WebElement getMetricTitleCloseParenthesesElem(){
        return machine.waitAndFind(METRIC_TITLE_CLOSE_PARENTHESES);
    }

    public WebDriverElemWrapper getMetricElemByIndex(int index){
        if (index == -1)
            return getMetricAllCheckboxElem();
        else
            return machine.waitAndFindElemWrapper(By.xpath(String.format(isDataset ? METRIC_BASE_DATASET : METRIC_BASE_REPORT, index)));
    }

    public void assertFiltersTitleLoadedCorrectly(int selected, int total){
        //TODO verify method works
        String expected = String.format("FILTERS(%d/%d)", selected, total);

        String actual = new StringBuilder()
                .append(getFiltersTitleStartElem().getText())
                .append(getFiltersTitleOpenParenthesesElem().getText())
                .append(getFiltersTitleSelectedCountElem().getText())
                .append(getFiltersTitleCountSeparatorElem().getText())
                .append(getFiltersTitleTotalCountElem().getText())
                .append(getFiltersTitleCloseParenthesesElem().getText())
                .toString();

        assertEquals(expected, actual);
    }

    public WebElement getFiltersTitleStartElem(){
        return machine.waitAndFind(FILTERS_TITLE_START);
    }

    public WebElement getFiltersTitleOpenParenthesesElem(){
        return machine.waitAndFind(FILTERS_TITLE_OPEN_PARENTHESES);
    }

    public WebElement getFiltersTitleSelectedCountElem(){
        return machine.waitAndFind(FILTERS_TITLE_SELECTED_COUNT);
    }

    public WebElement getFiltersTitleCountSeparatorElem(){
        return machine.waitAndFind(FILTERS_TITLE_COUNT_SEPARATOR);
    }

    public WebElement getFiltersTitleTotalCountElem(){
        return machine.waitAndFind(FILTERS_TITLE_TOTAL_COUNT);
    }

    public WebElement getFiltersTitleCloseParenthesesElem(){
        return machine.waitAndFind(FILTERS_TITLE_CLOSE_PARENTHESES);
    }

    public WebDriverElemWrapper getFilterElemByIndex(int index){
        String selector = String.format(isDataset ? FILTER_BASE_DATASET : FILTER_BASE_REPORT, index);

        return machine.waitAndFindElemWrapper(By.xpath(selector));
    }

    private int getElemIncrement(){
        int res = 1;

        if (isCrosstabReport())
            res++;

        return res;
    }

    public WebDriverElemWrapper getAttributeAllCheckboxElem(){
        return isDataset ? getAttributeAllCheckboxElemDataset() : getAttributeAllCheckboxElemReport();
    }

    private WebDriverElemWrapper getAttributeAllCheckboxElemDataset(){
        return machine.waitAndFindElemWrapper(ATTRIBUTE_ALL_CHECKBOX_DATASET);
    }

    private WebDriverElemWrapper getAttributeAllCheckboxElemReport(){
        By selector = By.xpath(String.format(ATTRIBUTE_ALL_CHECKBOX_BASE_REPORT, 4 + getElemIncrement()));
        return machine.waitAndFindElemWrapper(selector);
    }

    public WebElement getFilterValueElemFirst(){
        return machine.waitAndFind(FIRST_FILTER_VALUE);
    }

    public int getFilterValueSelectedCountByIndex(int index){
        String rawFilterText = getFilterValueTextByIndex(index);
        rawFilterText = rawFilterText.substring(rawFilterText.lastIndexOf('(') + 1, rawFilterText.lastIndexOf('/')).trim();

        return Integer.parseInt(rawFilterText);
    }

    public int getFilterValueTotalCountByIndex(int index){
        //TODO verify method works
        String rawFilterText = getFilterValueTextByIndex(index);
        rawFilterText = rawFilterText.substring(rawFilterText.lastIndexOf('/') + 1, rawFilterText.lastIndexOf(')')).trim();

        return Integer.parseInt(rawFilterText);
    }

    private String getFilterValueTextByIndex(int index){
        return getFilterElemByIndex(index).getDriverElement().getAttribute("AXDescription");
    }

    public WebDriverElemWrapper getFilterValueByIndex(int index){
        if (index == -1)
            return getFilterValueAllCheckboxElem();
        else
            return machine.waitAndFindElemWrapper(By.xpath(String.format(isDataset ? FILTER_VALUE_BASE_DATASET : FILTER_VALUE_BASE_REPORT, index)));
    }

    public WebDriverElemWrapper getMetricAllCheckboxElem(){
        By selector = isDataset ? METRIC_ALL_CHECKBOX_DATASET : By.xpath(String.format(METRIC_ALL_CHECKBOX_BASE_REPORT, 6 + getElemIncrement()));
        return machine.waitAndFindElemWrapper(selector);
    }

    public WebDriverElemWrapper getFilterValueAllCheckboxElem(){
        By selector = isDataset ? FILTER_VALUE_ALL_CHECKBOX_DATASET : By.xpath(String.format(FILTER_VALUE_ALL_CHECKBOX_BASE_REPORT, 9 + getElemIncrement()));
        return machine.waitAndFindElemWrapper(selector);
    }

    public WebElementWithBooleanAXValue getViewSelectedSwitchElem(){
        return new WebElementWithBooleanAXValue(machine.waitAndFind(VIEW_SELECTED_SWITCH));
    }

    public WebElement getBackBtnElem(){
        return machine.waitAndFind(BACK_BTN);
    }

    public WebElement getDataPreviewBtnElem(){
        return machine.waitAndFind(DATA_PREVIEW_BTN);
    }


    public WebElement getImportBtnDisabledElem(){
        return machine.waitAndFind(IMPORT_BTN_DISABLED);
    }

    public WebElement getCancelBtnElem(){
        return machine.waitAndFind(CANCEL_BTN);
    }

    public WebElement getFilterValuePaneElem(){
        return machine.waitAndFind(FILTER_VALUE_PANE);
    }

    public WebElement getFilterExcludesAllDataErrorMessageElem(){
        return machine.waitAndFind(FILTER_EXCLUDES_ALL_DATA_ERROR_MESSAGE);
    }

    public void assertFilterValuePaneNotPresent(){
        machine.assertNotPresent(FILTER_VALUE_PANE);
    }

    public List<WebElementWithBooleanAXValue> getAllAttributeCheckboxes(){
        return getAllCheckboxes(ATTRIBUTE_CHECKBOX_BASE);
    }

    public List<WebElementWithBooleanAXValue> getAllMetricCheckboxes() {
        return getAllCheckboxes(METRIC_CHECKBOX_BASE);
    }

    public List<WebElementWithBooleanAXValue> getAllFilterValeCheckboxes(){
        return getAllCheckboxes(FILTER_VALUE_CHECKBOX_BASE);
    }

    public WebElement getAttributeColumnNoDataTitleElem(){
        return machine.waitAndFind(ATTRIBUTE_COLUMN_NO_DATA_TITLE);
    }

    public WebElement getMetricColumnNoDataTitleElem(){
        return machine.waitAndFind(METRIC_COLUMN_NO_DATA_TITLE);
    }

    public WebElement getFilterColumnNoDataTitleElem(){
        return machine.waitAndFind(FILTER_COLUMN_NO_DATA_TITLE);
    }

    public WebElement getFilterValueColumnNoDataTitleElem(){
        return machine.waitAndFind(FILTER_VALUE_COLUMN_NO_DATA_TITLE);
    }

    private List<WebElementWithBooleanAXValue> getAllCheckboxes(String selectorBase){
        List<WebElementWithBooleanAXValue> res = new LinkedList<>();

        int i = 0;
        try {
            while (true) {
                res.add(new WebElementWithBooleanAXValue(machine.waitAndFind(By.xpath(String.format(selectorBase, i++)))));
            }
        } catch (Exception ignored) {}

        return res;
    }

    public void assertAttributeSelectedCountIsAsExpected(int expected){
        assertSelectedCountIsAsExpected(ATTRIBUTE_TITLE_SELECTED_COUNT, expected);
    }

    public void assertMetricSelectedCountIsAsExpected(int expected){
        assertSelectedCountIsAsExpected(METRIC_TITLE_SELECTED_COUNT, expected);
    }

    public void assertFilterSelectedCountIsAsExpected(int expected){
        assertSelectedCountIsAsExpected(FILTERS_TITLE_SELECTED_COUNT, expected);
    }

    public void assertFilterValueSelectedCountIsAsExpected(int index, int expected){
        int actual = getFilterValueSelectedCountByIndex(index);
        assertEquals(expected, actual);
    }

    public void assertFilterValueTotalCountIsAsExpected(int index, int totalExpected){
        int actual = getFilterValueTotalCountByIndex(index);
        assertEquals(totalExpected, actual);
    }

    private void assertSelectedCountIsAsExpected(By selector, int expected){
        WebElement selectedCountElem = machine.waitAndFind(selector);
        int actual = Integer.parseInt(selectedCountElem.getText());

        assertEquals(expected, actual);
    }

    public void assertCancelBtnNotPresent(){
        machine.assertNotPresent(CANCEL_BTN);
    }
}
