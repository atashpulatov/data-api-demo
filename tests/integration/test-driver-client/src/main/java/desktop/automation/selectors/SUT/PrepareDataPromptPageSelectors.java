package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class PrepareDataPromptPageSelectors {
    //Shared
    protected static final By FILTER_EXCLUDES_ALL_DATA_ERROR_MESSAGE;
    protected static final By DISPLAY_ATTRIBUTE_FORM_NAMES_LINK_ELEM;
    protected static final By CROSSTAB_NOTIFICATION;

    //Windows
    protected static final By PANE;
    protected static final By COLUMNS_AND_FILTERS_SELECTION_TITLE_ELEM;
    protected static final By ATTRIBUTE_METRIC_GRIDS;
    protected static final By ALL_CHECKBOX_ELEMS;
    protected static final By FILTER_TREE_ELEM;
    protected static final By COLUMN_ELEM_CHECKBOX;
    protected static final By VIEW_SELECTED_BTN_ELEM;
    protected static final By DATA_PREVIEW_BTN_ELEM;
    protected static final By CANCEL_BTN_ELEM;
    protected static final By BACK_BTN_ELEM;

    protected static final String COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_1;
    protected static final String COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_2;
    protected static final String IMPORT_BTN_IMAGE;

    //Mac
    protected static final String TITLE_BASE;
    protected static final By TITLE_START_REPORT;
    protected static final By TITLE_START_DATASET;
    protected static final String TITLE_NAME_BASE;
    protected static final By ATTRIBUTES_TITLE_START;
    protected static final By ATTRIBUTE_TITLE_OPEN_PARENTHESES;
    protected static final By ATTRIBUTE_TITLE_SELECTED_COUNT;
    protected static final By ATTRIBUTE_TITLE_COUNT_SEPARATOR;
    protected static final By ATTRIBUTE_TITLE_TOTAL_COUNT;
    protected static final By ATTRIBUTE_TITLE_CLOSE_PARENTHESES;
    protected static final String ATTRIBUTE_BASE;
    protected static final String ATTRIBUTE_CHECKBOX_BASE;
    protected static final By FIRST_ATTRIBUTE;
    protected static final By METRIC_TITLE_START;
    protected static final By METRIC_TITLE_OPEN_PARENTHESES;
    protected static final By METRIC_TITLE_SELECTED_COUNT;
    protected static final By METRIC_TITLE_COUNT_SEPARATOR;
    protected static final By METRIC_TITLE_TOTAL_COUNT;
    protected static final By METRIC_TITLE_CLOSE_PARENTHESES;
    protected static final String METRIC_BASE;
    protected static final String METRIC_CHECKBOX_BASE;
    protected static final By FIRST_METRIC;
    protected static final By FILTERS_TITLE_START;
    protected static final By FILTERS_TITLE_OPEN_PARENTHESES;
    protected static final By FILTERS_TITLE_SELECTED_COUNT;
    protected static final By FILTERS_TITLE_COUNT_SEPARATOR;
    protected static final By FILTERS_TITLE_TOTAL_COUNT;
    protected static final By FILTERS_TITLE_CLOSE_PARENTHESES;
    protected static final String FILTER_BASE;
    protected static final By FIRST_FILTER;
    protected static final String FILTER_VALUE_BASE;
    protected static final By FIRST_FILTER_VALUE;
    protected static final By ATTRIBUTE_ALL_CHECKBOX;
    protected static final By METRIC_ALL_CHECKBOX;
    protected static final By FILTER_VALUE_ALL_CHECKBOX;
    protected static final String FILTER_VALUE_CHECKBOX_BASE;
    protected static final By ATTRIBUTE_COLUMN_NO_DATA_TITLE;
    protected static final By METRIC_COLUMN_NO_DATA_TITLE;
    protected static final By FILTER_COLUMN_NO_DATA_TITLE;
    protected static final By FILTER_VALUE_COLUMN_NO_DATA_TITLE;
    protected static final By SUBTOTALS_AND_TOTALS_SWITCH;
    protected static final By IMPORT_BTN;
    protected static final By IMPORT_BTN_DISABLED;
    protected static final By FILTER_VALUE_PANE;

    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                CROSSTAB_NOTIFICATION = null;
                PANE = null;
                COLUMNS_AND_FILTERS_SELECTION_TITLE_ELEM = null;
                DISPLAY_ATTRIBUTE_FORM_NAMES_LINK_ELEM = null;
                ATTRIBUTE_METRIC_GRIDS = null;
                ALL_CHECKBOX_ELEMS = null;
                FILTER_TREE_ELEM = null;
                COLUMN_ELEM_CHECKBOX = null;
                VIEW_SELECTED_BTN_ELEM = null;
                DATA_PREVIEW_BTN_ELEM = null;
                CANCEL_BTN_ELEM = By.cssSelector(".popup-buttons.popup-footer > #cancel");
                BACK_BTN_ELEM = By.id("back");
                FILTER_EXCLUDES_ALL_DATA_ERROR_MESSAGE = null;
                COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_1 = null;
                COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_2 = null;
                IMPORT_BTN_IMAGE = null;

                //Mac
                TITLE_BASE = null;
                TITLE_START_REPORT = null;
                TITLE_START_DATASET = null;
                TITLE_NAME_BASE = null;
                ATTRIBUTES_TITLE_START = null;
                ATTRIBUTE_TITLE_OPEN_PARENTHESES = null;
                ATTRIBUTE_TITLE_SELECTED_COUNT = null;
                ATTRIBUTE_TITLE_COUNT_SEPARATOR = null;
                ATTRIBUTE_TITLE_TOTAL_COUNT = null;
                ATTRIBUTE_TITLE_CLOSE_PARENTHESES = null;
                ATTRIBUTE_BASE = null;
                ATTRIBUTE_CHECKBOX_BASE = null;
                FIRST_ATTRIBUTE = null;
                METRIC_TITLE_START = null;
                METRIC_TITLE_OPEN_PARENTHESES = null;
                METRIC_TITLE_SELECTED_COUNT = null;
                METRIC_TITLE_COUNT_SEPARATOR = null;
                METRIC_TITLE_TOTAL_COUNT = null;
                METRIC_TITLE_CLOSE_PARENTHESES = null;
                METRIC_BASE = null;
                METRIC_CHECKBOX_BASE = null;
                FIRST_METRIC = null;
                FILTERS_TITLE_START = null;
                FILTERS_TITLE_OPEN_PARENTHESES = null;
                FILTERS_TITLE_SELECTED_COUNT = null;
                FILTERS_TITLE_COUNT_SEPARATOR = null;
                FILTERS_TITLE_TOTAL_COUNT = null;
                FILTERS_TITLE_CLOSE_PARENTHESES = null;
                FILTER_BASE = null;
                FIRST_FILTER = null;
                FILTER_VALUE_BASE = null;
                FIRST_FILTER_VALUE = null;
                ATTRIBUTE_ALL_CHECKBOX = null;
                METRIC_ALL_CHECKBOX = null;
                FILTER_VALUE_ALL_CHECKBOX = null;
                FILTER_VALUE_CHECKBOX_BASE = null;
                ATTRIBUTE_COLUMN_NO_DATA_TITLE = null;
                METRIC_COLUMN_NO_DATA_TITLE = null;
                FILTER_COLUMN_NO_DATA_TITLE = null;
                FILTER_VALUE_COLUMN_NO_DATA_TITLE = null;
                SUBTOTALS_AND_TOTALS_SWITCH = null;
                IMPORT_BTN = By.id("import");
                IMPORT_BTN_DISABLED = null;
                FILTER_VALUE_PANE = null;
                break;
            case MAC_DESKTOP:
                CROSSTAB_NOTIFICATION = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='To preserve this crosstab report, select all objects without changing their forms.']");                TITLE_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='%s > %s']";
                TITLE_START_REPORT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='Import Report > ']");
                TITLE_START_DATASET = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='Import Dataset > ']");
                TITLE_NAME_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[0]/AXStaticText[@AXValue='%s']";
                ATTRIBUTES_TITLE_START = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[0]");
                ATTRIBUTE_TITLE_OPEN_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[1]");
                ATTRIBUTE_TITLE_SELECTED_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[2]");
                ATTRIBUTE_TITLE_COUNT_SEPARATOR = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[3]");
                ATTRIBUTE_TITLE_TOTAL_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[4]");
                ATTRIBUTE_TITLE_CLOSE_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[3]/AXStaticText[5]");
                ATTRIBUTE_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]";
                ATTRIBUTE_CHECKBOX_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";
                FIRST_ATTRIBUTE = By.xpath(String.format(ATTRIBUTE_BASE, 0));
                METRIC_TITLE_START = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[0]");
                METRIC_TITLE_OPEN_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[1]");
                METRIC_TITLE_SELECTED_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[2]");
                METRIC_TITLE_COUNT_SEPARATOR = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[3]");
                METRIC_TITLE_TOTAL_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[4]");
                METRIC_TITLE_CLOSE_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[5]");
                METRIC_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[1]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]";
                METRIC_CHECKBOX_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[1]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";
                FIRST_METRIC = By.xpath(String.format(METRIC_BASE, 0));
                FILTERS_TITLE_START = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[0]");
                FILTERS_TITLE_OPEN_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[1]");
                FILTERS_TITLE_SELECTED_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[2]");
                FILTERS_TITLE_COUNT_SEPARATOR = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[3]");
                FILTERS_TITLE_TOTAL_COUNT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[4]");
                FILTERS_TITLE_CLOSE_PARENTHESES = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[7]/AXStaticText[5]");
                FILTER_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[%d]";
                FIRST_FILTER = By.xpath(String.format(FILTER_BASE, 0));
                FILTER_VALUE_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[2]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]";
                FIRST_FILTER_VALUE = By.xpath(String.format(FILTER_VALUE_BASE, 0));
                ATTRIBUTE_ALL_CHECKBOX = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[4]/AXGroup[0]/AXCheckBox[0]");
                METRIC_ALL_CHECKBOX = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[6]/AXGroup[0]/AXCheckBox[0]");
                FILTER_VALUE_ALL_CHECKBOX = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[9]/AXGroup[0]/AXCheckBox[0]");
                FILTER_VALUE_CHECKBOX_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[2]/AXUnknown[0]/AXGroup[%d]/AXGroup[0]/AXCheckBox[0]";
                ATTRIBUTE_COLUMN_NO_DATA_TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[5]/AXStaticText[@AXValue='No data']");
                METRIC_COLUMN_NO_DATA_TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[8]/AXStaticText[@AXValue='No data']");
                FILTER_COLUMN_NO_DATA_TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[11]/AXStaticText[@AXValue='No data']");
                FILTER_VALUE_COLUMN_NO_DATA_TITLE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[14]/AXStaticText[@AXValue='No data']");
                SUBTOTALS_AND_TOTALS_SWITCH = By.xpath(     "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[0]/AXCheckBox[@AXDOMIdentifier='view-selected-switch' and @AXSubrole='AXSwitch']");
                IMPORT_BTN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXButton[@AXTitle='Import' and @AXDOMIdentifier='import']");
                IMPORT_BTN_DISABLED = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[12]/AXGroup[1]/AXButton");
                FILTER_VALUE_PANE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[2]");
                FILTER_EXCLUDES_ALL_DATA_ERROR_MESSAGE = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[14]/AXGroup[0]/AXGroup[0]/AXStaticText[@AXValue='The selected filter excludes all data']");
                BACK_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[13]/AXButton[@AXTitle='Back' and @AXDOMIdentifier='back']");

                //Windows
                PANE = null;
                COLUMNS_AND_FILTERS_SELECTION_TITLE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXStaticText[@AXValue='Columns & Filters Selection']");
                DISPLAY_ATTRIBUTE_FORM_NAMES_LINK_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXLink[@AXTitle='Display attribute form names' and @AXDOMIdentifier='form_names_label']/AXStaticText[@AXValue='Display attribute form names']");
                ATTRIBUTE_METRIC_GRIDS = null;
                ALL_CHECKBOX_ELEMS = null;
                FILTER_TREE_ELEM = null;
                COLUMN_ELEM_CHECKBOX = null;
                VIEW_SELECTED_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXCheckBox[@AXDOMIdentifier='view-selected-switch' and @AXSubrole='AXSwitch']");
                DATA_PREVIEW_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[12]/AXButton[@AXTitle='Data Preview' and @AXDOMIdentifier='data-preview']");
                CANCEL_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[13]/AXButton[@AXTitle='Cancel' and @AXDOMIdentifier='cancel']");

                COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_1 = "TODO";
                COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_2 = null;
                IMPORT_BTN_IMAGE = "TODO";
                break;
            case WINDOWS_DESKTOP:
                CROSSTAB_NOTIFICATION = By.xpath("//Text[@Name='To preserve this crosstab report, select all objects without changing their forms.']");
                PANE = By.name("MicroStrategy for Office");
                COLUMNS_AND_FILTERS_SELECTION_TITLE_ELEM = By.name("Columns & Filters Selection");
                DISPLAY_ATTRIBUTE_FORM_NAMES_LINK_ELEM = null;
                ATTRIBUTE_METRIC_GRIDS = By.name("grid");
                ALL_CHECKBOX_ELEMS = By.name("(All)");
                FILTER_TREE_ELEM = By.tagName("Tree");
                COLUMN_ELEM_CHECKBOX = By.tagName("CheckBox");
                VIEW_SELECTED_BTN_ELEM = By.xpath("//Button[@Name=\"View selected\"]");
                DATA_PREVIEW_BTN_ELEM = MobileBy.AccessibilityId("data-preview");
                CANCEL_BTN_ELEM = MobileBy.AccessibilityId("cancel");
                BACK_BTN_ELEM = MobileBy.AccessibilityId("back");
                FILTER_EXCLUDES_ALL_DATA_ERROR_MESSAGE = By.name("The selected filter excludes all data");

                COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_1 = "prepareData/columnsAndFiltersSelectionTitle1";
                COLUMNS_AND_FILTERS_SELECTION_TITLE_IMAGE_2 = "prepareData/columnsAndFiltersSelectionTitle2";
                IMPORT_BTN_IMAGE = "prepareData/importBtn";

                //Mac
                TITLE_BASE = null;
                TITLE_START_REPORT = null;
                TITLE_START_DATASET = null;
                TITLE_NAME_BASE = null;
                ATTRIBUTES_TITLE_START = null;
                ATTRIBUTE_TITLE_OPEN_PARENTHESES = null;
                ATTRIBUTE_TITLE_SELECTED_COUNT = null;
                ATTRIBUTE_TITLE_COUNT_SEPARATOR = null;
                ATTRIBUTE_TITLE_TOTAL_COUNT = null;
                ATTRIBUTE_TITLE_CLOSE_PARENTHESES = null;
                ATTRIBUTE_BASE = null;
                ATTRIBUTE_CHECKBOX_BASE = null;
                FIRST_ATTRIBUTE = null;
                METRIC_TITLE_START = null;
                METRIC_TITLE_OPEN_PARENTHESES = null;
                METRIC_TITLE_SELECTED_COUNT = null;
                METRIC_TITLE_COUNT_SEPARATOR = null;
                METRIC_TITLE_TOTAL_COUNT = null;
                METRIC_TITLE_CLOSE_PARENTHESES = null;
                METRIC_BASE = null;
                METRIC_CHECKBOX_BASE = null;
                FIRST_METRIC = null;
                FILTERS_TITLE_START = null;
                FILTERS_TITLE_OPEN_PARENTHESES = null;
                FILTERS_TITLE_SELECTED_COUNT = null;
                FILTERS_TITLE_COUNT_SEPARATOR = null;
                FILTERS_TITLE_TOTAL_COUNT = null;
                FILTERS_TITLE_CLOSE_PARENTHESES = null;
                FILTER_BASE = null;
                FIRST_FILTER = null;
                FILTER_VALUE_BASE = null;
                FIRST_FILTER_VALUE = null;
                ATTRIBUTE_ALL_CHECKBOX = null;
                METRIC_ALL_CHECKBOX = null;
                FILTER_VALUE_ALL_CHECKBOX = null;
                FILTER_VALUE_CHECKBOX_BASE = null;
                ATTRIBUTE_COLUMN_NO_DATA_TITLE = null;
                METRIC_COLUMN_NO_DATA_TITLE = null;
                FILTER_COLUMN_NO_DATA_TITLE = null;
                FILTER_VALUE_COLUMN_NO_DATA_TITLE = null;
                SUBTOTALS_AND_TOTALS_SWITCH = null;
                IMPORT_BTN = By.name("Import");
                IMPORT_BTN_DISABLED = null;
                FILTER_VALUE_PANE = null;
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
