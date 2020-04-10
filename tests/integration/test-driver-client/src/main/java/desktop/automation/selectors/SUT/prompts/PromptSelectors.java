package desktop.automation.selectors.SUT.prompts;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class PromptSelectors {
    //BasePromptPage
    protected static final By RUN_BTN_ELEM;
    protected static final By CANCEL_BTN_ELEM;
    protected static final By BACK_BTN_ELEM;
    protected static final By NUMERIC_OUT_OF_RANGE_MESSAGE_ELEM;
    protected static final By PROMPT_REQUIRES_ANS_MESSAGE_ELEM;

    //BasePromptWithSelectionListPage
    protected static final By ADD_BTN_ELEM;
    protected static final By ADD_ALL_BTN_ELEM;
    protected static final By REMOVE_BTN_ELEM;
    protected static final By REMOVE_ALL_BTN_ELEM;

    //Prompt type specific
    //AttributeElementPromptPage
    protected static final By ATTRIBUTE_SEARCH_ELEM;

    //AttributeQualificationPromptPage
    protected static final By ATTRIBUTE_SELECTION_DROP_DOWN;
    protected static final By ATTRIBUTE_SELECTION_OPTIONS;
    protected static final By OPERATOR_SELECTION_DROP_DOWN;
    protected static final By OPERATOR_SELECTION_OPTIONS;
    protected static final By ATTRIBUTE_QUALIFICATION_PROMPT_VALUE_INPUT;

    //Big Decimal
    protected static final By BIG_DECIMAL_PROMPT_ANSWER_INPUT;

    //DatePromptPage
    protected static final By DATE_PROMPT_TIME_EDIT_ELEMS;
    protected static final String DATE_PROMPT_EDIT_BASE;
    protected static final By DATE_PROMPT_DATE_INPUT;

    //HierarchyPromptPage
    protected static final By HIERARCHY_PROMPT_IMPORT_OBJECT_ELEMS;
    protected static final String HIERARCHY_PROMPT_IMPORT_OBJECT_ELEM_BASE;

    //HierarchyQualificationPromptPage
    protected static final String HIERARCHY_BASE = "//Group[@Name='%s']";
    protected static final String ATTRIBUTE_BASE = "//Group[@Name='%s']";

    //MetricQualificationPromptPage
    //METRIC_QUALIFICATION_PROMPT_
    protected static final By METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_INPUT_DROP_DOWN;
    protected static final By METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTIONS;
    protected static final String METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTION_BASE;
    protected static final By METRIC_QUALIFICATION_PROMPT_VALUE_INPUT;

    //MultiplePrompt
    protected static final By MULTIPLE_PROMPT_DATE_INPUT_ELEM;
    protected static final By MULTIPLE_PROMPT_TEXT_INPUT_ELEM;

    //NumericPromptPage
    protected static final By NUMERIC_PROMPT_NUMBER_INPUT;

    //ObjectPromptPage
    protected static final By OBJECT_PROMPT_IMPORT_OBJECT_ELEMS;
    protected static final String OBJECT_PROMPT_IMPORT_OBJECT_ELEM_BASE;

    //StandardPromptPage
    protected static final By STANDARD_PROMPT_ANSWER_INPUT_ELEM;

    //Images
    protected static final String[] ADD_BTN_IMAGES = {"prompts/addBtn1", "prompts/addBtn2"};
    protected static final String[] ADD_ALL_BTN_IMAGES = {"prompts/addAllBtn1", "prompts/addAllBtn2"};
    protected static final String[] REMOVE_BTN_IMAGES = {"prompts/removeBtn1", "prompts/removeBtn2"};
    protected static final String[] REMOVE_ALL_BTN_IMAGES = {"prompts/removeAllBtn1", "prompts/removeAllBtn2"};

    static {
        switch (DESIRED_DRIVER_TYPE) {
            case BROWSER:
                RUN_BTN_ELEM = By.id("run");
                CANCEL_BTN_ELEM = By.id("cancel");
                BACK_BTN_ELEM = By.id("back");
                NUMERIC_OUT_OF_RANGE_MESSAGE_ELEM = null;
                PROMPT_REQUIRES_ANS_MESSAGE_ELEM = null;
                ADD_BTN_ELEM = By.cssSelector(".mstrListCartCellAddRemoveButtons > div:nth-child(1)");
                ADD_ALL_BTN_ELEM = By.cssSelector(".mstrListCartCellAddRemoveButtons > div:nth-child(2)");
                REMOVE_BTN_ELEM = By.cssSelector(".mstrListCartCellAddRemoveButtons > div:nth-child(4)");
                REMOVE_ALL_BTN_ELEM = By.cssSelector(".mstrListCartCellAddRemoveButtons > div:nth-child(5)");
                ATTRIBUTE_SEARCH_ELEM = By.id("id_mstr40_txt");
                ATTRIBUTE_SELECTION_DROP_DOWN = null;
                ATTRIBUTE_SELECTION_OPTIONS = null;
                OPERATOR_SELECTION_DROP_DOWN = By.cssSelector(".mstrQualifierContainerFunctionView .mstrListPulldownCellButton");
                OPERATOR_SELECTION_OPTIONS = By.cssSelector(".mstrListBlockListContainer .mstrListBlockItemName");
                ATTRIBUTE_QUALIFICATION_PROMPT_VALUE_INPUT = By.cssSelector(".mstrQualifierContainerConstant1View input");
                BIG_DECIMAL_PROMPT_ANSWER_INPUT = By.id("id_mstr20_txt");
                DATE_PROMPT_TIME_EDIT_ELEMS = By.cssSelector("#id_mstr22  input");
                DATE_PROMPT_EDIT_BASE = null;
                DATE_PROMPT_DATE_INPUT = By.id("id_mstr20_txt");
                HIERARCHY_PROMPT_IMPORT_OBJECT_ELEMS = By.cssSelector(".mstrListCartCellAvailableView .mstrListBlockItemName");
                HIERARCHY_PROMPT_IMPORT_OBJECT_ELEM_BASE = null;
                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_INPUT_DROP_DOWN = By.cssSelector(".mstrQualifierContainerTargetView .mstrListPulldownCellButton");
                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTIONS = By.cssSelector(".mstrListBlockListContainer .mstrListBlockItemName");
                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTION_BASE = null;
                METRIC_QUALIFICATION_PROMPT_VALUE_INPUT = By.cssSelector(".mstrQualifierContainerConstant1View input");
                MULTIPLE_PROMPT_DATE_INPUT_ELEM = By.id("id_mstr24_txt");
                MULTIPLE_PROMPT_TEXT_INPUT_ELEM = By.id("id_mstr30_txt");
                NUMERIC_PROMPT_NUMBER_INPUT = By.id("id_mstr20_txt");
                STANDARD_PROMPT_ANSWER_INPUT_ELEM = By.id("id_mstr20_txt");
                OBJECT_PROMPT_IMPORT_OBJECT_ELEMS = By.cssSelector("#id_mstr37ListContainer > div");
                OBJECT_PROMPT_IMPORT_OBJECT_ELEM_BASE = null;
                break;
            case MAC_DESKTOP:
                RUN_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[2]/AXGroup[0]/AXButton[@AXTitle='Run' and @AXDOMIdentifier='run']");
                CANCEL_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[2]/AXGroup[0]/AXButton[@AXTitle='Cancel' and @AXDOMIdentifier='cancel']");
                BACK_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[2]/AXGroup[0]/AXButton[@AXTitle='Back' and @AXDOMIdentifier='back']");
                NUMERIC_OUT_OF_RANGE_MESSAGE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXGroup[7]/AXStaticText[@AXValue='You have entered a value that is greater than the one allowed for this prompt. Please enter a lesser value.']");
                PROMPT_REQUIRES_ANS_MESSAGE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXGroup[7]/AXStaticText[@AXValue='This prompt requires an answer.']");

                ADD_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr23']/AXRow/AXGroup[0]/AXGroup[@AXDOMIdentifier='id_mstr39']/AXGroup[0]");
                ADD_ALL_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr23']/AXRow/AXGroup[0]/AXGroup[@AXDOMIdentifier='id_mstr40']/AXGroup[0]");
                REMOVE_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr23']/AXRow/AXGroup[0]/AXGroup[@AXDOMIdentifier='id_mstr41']/AXGroup[0]");
                REMOVE_ALL_BTN_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr23']/AXRow/AXGroup[0]/AXGroup[@AXDOMIdentifier='id_mstr42']/AXGroup[0]");

                ATTRIBUTE_SEARCH_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr23']/AXRow[1]/AXCell[0]/AXGroup[0]/AXTextField[@AXDOMIdentifier='id_mstr40_txt']");

                ATTRIBUTE_SELECTION_DROP_DOWN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr42']/AXRow[0]/AXCell[1]/AXGroup[0]");
                //TODO currently not utilized, requires base
                ATTRIBUTE_SELECTION_OPTIONS = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXGroup[@AXDOMIdentifier='ListBlockContents_id_mstr64']/AXGroup[0]/AXGroup[0]/AXStaticText");
                OPERATOR_SELECTION_DROP_DOWN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr49']/AXRow[0]/AXCell[1]/AXGroup[0]");
                OPERATOR_SELECTION_OPTIONS = null;
                ATTRIBUTE_QUALIFICATION_PROMPT_VALUE_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[@AXDOMIdentifier='id_mstr51_txt']");

                BIG_DECIMAL_PROMPT_ANSWER_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[@AXDOMIdentifier='id_mstr20_txt']");

                DATE_PROMPT_TIME_EDIT_ELEMS = null;
                DATE_PROMPT_EDIT_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[%d]";
                DATE_PROMPT_DATE_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[@AXDOMIdentifier='id_mstr20_txt']");

                HIERARCHY_PROMPT_IMPORT_OBJECT_ELEMS = null;
                HIERARCHY_PROMPT_IMPORT_OBJECT_ELEM_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr23']/AXRow/AXCell[0]/AXGroup[@AXDOMIdentifier='ListBlockContents_id_mstr37']/AXGroup[%d]/AXGroup[0]/AXStaticText";

                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_INPUT_DROP_DOWN = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr35']/AXRow[0]/AXCell[1]/AXGroup[0]");
                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTIONS = null;
                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTION_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXGroup[@AXDOMIdentifier='ListBlockContents_id_mstr50']/AXGroup[%d]/AXGroup[0]/AXStaticText";
                METRIC_QUALIFICATION_PROMPT_VALUE_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[@AXDOMIdentifier='id_mstr38_txt']");

                MULTIPLE_PROMPT_DATE_INPUT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[@AXDOMIdentifier='id_mstr24_txt']");
                MULTIPLE_PROMPT_TEXT_INPUT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[@AXDOMIdentifier='id_mstr30_txt']");

                NUMERIC_PROMPT_NUMBER_INPUT = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[@AXDOMIdentifier='id_mstr20_txt']");

                STANDARD_PROMPT_ANSWER_INPUT_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTextField[@AXDOMIdentifier='id_mstr20_txt']");

                OBJECT_PROMPT_IMPORT_OBJECT_ELEMS = null;
                OBJECT_PROMPT_IMPORT_OBJECT_ELEM_BASE = "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[1]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='mstrdossierPromptEditor']/AXTable[@AXDOMIdentifier='id_mstr23']/AXRow/AXCell[0]/AXGroup[@AXDOMIdentifier='ListBlockContents_id_mstr37']/AXGroup[%d]/AXGroup[0]/AXStaticText";
                break;
            case WINDOWS_DESKTOP:
                RUN_BTN_ELEM = MobileBy.AccessibilityId("run");
                CANCEL_BTN_ELEM = MobileBy.AccessibilityId("cancel");
                BACK_BTN_ELEM = MobileBy.AccessibilityId("back");
                NUMERIC_OUT_OF_RANGE_MESSAGE_ELEM = By.xpath("//*[@LocalizedControlType='text'][contains(@Name,'You have entered a value that is greater than the one allowed for this prompt. Please enter a lesser value.')]");
                PROMPT_REQUIRES_ANS_MESSAGE_ELEM = By.xpath("//*[@LocalizedControlType='text'][contains(@Name,'This prompt requires an answer.')]");

                ADD_BTN_ELEM = By.xpath("//*[@LocalizedControlType='item']/*[@LocalizedControlType='group'][@Name='Add']");
                ADD_ALL_BTN_ELEM = By.xpath("//*[@LocalizedControlType='item']/*[@LocalizedControlType='group'][@Name='Add All']");
                REMOVE_BTN_ELEM = By.xpath("//*[@LocalizedControlType='item']/*[@LocalizedControlType='group'][@Name='Remove']");
                REMOVE_ALL_BTN_ELEM = By.xpath("//*[@LocalizedControlType='item']/*[@LocalizedControlType='group'][@Name='Remove All']");

                ATTRIBUTE_SEARCH_ELEM = MobileBy.AccessibilityId("id_mstr40_txt");

                ATTRIBUTE_SELECTION_DROP_DOWN = By.xpath("//*[@AutomationId='id_mstr42'][1]");
                ATTRIBUTE_SELECTION_OPTIONS = By.xpath("//*[@AutomationId='ListBlockContents_id_mstr64']");
                OPERATOR_SELECTION_DROP_DOWN = By.xpath("//*[@AutomationId='id_mstr49'][1]");
                OPERATOR_SELECTION_OPTIONS = By.xpath("//*[@AutomationId='id_mstr49']/following-sibling::*/*/*/*[@LocalizedControlType='group']");
                ATTRIBUTE_QUALIFICATION_PROMPT_VALUE_INPUT = MobileBy.AccessibilityId("id_mstr51_txt");

                BIG_DECIMAL_PROMPT_ANSWER_INPUT = MobileBy.AccessibilityId("id_mstr20_txt");

                DATE_PROMPT_TIME_EDIT_ELEMS = By.xpath("//*[@AutomationId='mstrdossierPromptEditor']//*[@LocalizedControlType='table']/*[@LocalizedControlType='item']/*[@LocalizedControlType='edit']");
                DATE_PROMPT_EDIT_BASE = null;
                DATE_PROMPT_DATE_INPUT = MobileBy.AccessibilityId("id_mstr20_txt");

                HIERARCHY_PROMPT_IMPORT_OBJECT_ELEMS = By.xpath("//*[@AutomationId='ListBlockContents_id_mstr37']/*");
                HIERARCHY_PROMPT_IMPORT_OBJECT_ELEM_BASE = null;

                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_INPUT_DROP_DOWN = By.xpath("//*[@AutomationId='id_mstr35'][1]");
                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTIONS = By.xpath("//*[@AutomationId='ListBlockContents_id_mstr50']/*[@LocalizedControlType='group']");
                METRIC_QUALIFICATION_PROMPT_METRIC_SELECTION_OPTION_BASE = null;
                METRIC_QUALIFICATION_PROMPT_VALUE_INPUT = MobileBy.AccessibilityId("id_mstr38_txt");

                MULTIPLE_PROMPT_DATE_INPUT_ELEM = MobileBy.AccessibilityId("id_mstr24_txt");
                MULTIPLE_PROMPT_TEXT_INPUT_ELEM = MobileBy.AccessibilityId("id_mstr30_txt");

                NUMERIC_PROMPT_NUMBER_INPUT = MobileBy.AccessibilityId("id_mstr20_txt");

                STANDARD_PROMPT_ANSWER_INPUT_ELEM = MobileBy.AccessibilityId("id_mstr20_txt");

                OBJECT_PROMPT_IMPORT_OBJECT_ELEMS = By.xpath("//*[@AutomationId='ListBlockContents_id_mstr37']/*");
                OBJECT_PROMPT_IMPORT_OBJECT_ELEM_BASE = null;
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
