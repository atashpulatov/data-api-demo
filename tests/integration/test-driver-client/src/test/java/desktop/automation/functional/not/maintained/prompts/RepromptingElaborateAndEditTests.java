package desktop.automation.functional.not.maintained.prompts;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import junit.framework.TestCase;
import org.junit.Test;
import org.openqa.selenium.WebElement;

import static org.junit.Assert.assertEquals;

public class RepromptingElaborateAndEditTests extends BaseLoggedInTests {

    //1) import through prepare data flow + re-prompt
    //TC49534
    @Test
    public void importWithPrepareDataNumeric(){
        String report = "Report with prompt - Value prompt - Numeric (Year) | Required | Default answer";

        int[] attributes = {0, 0, 0, 1};
        int[] metrics = {-1};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importThroughPrepareDataFlowThenRepromtTestStart(report, machine.getNumericPromptPage(),
                attributes, metrics, filterAndValuesArr);

        WebDriverElemWrapper inputElem = machine.getNumericPromptPage().getNumberInputElem();
        inputElem.clear();
        inputElem.sendKeys("2014");
        machine.getNumericPromptPage().getRunBtnElem().click();

        //assert cell values
        machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        String[][] expectedCellValues = {
                {"A2", "2014"},
                {"D9", "$471 477"},
                {"D1", "Revenue"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC49536
    @Test
    public void importWithPrepareDataBigDecimal(){
        String report = "Report with prompt - Value prompt - Big Decimal (Customer ID) | Not required | No default answer";

        int[] attributes = {-1};
        int[] metrics = {0};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{-1, -1});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importThroughPrepareDataFlowThenRepromtTestStart(report, machine.getBigDecimalPromptPage(),
                attributes, metrics, filterAndValuesArr);

        WebElement inputElem = machine.getBigDecimalPromptPage().getAnswerInputElem();
        inputElem.clear();
        inputElem.sendKeys("1800");
        machine.getBigDecimalPromptPage().getRunBtnElem().click();

        //assert cell values
        machine.getMainPage().getImportedObjectInListNameElem(report);

        String[][] expectedCellValues = {
                {"A2", "1800"},
                {"B2", "$769"},
                {"A1", "Customer ID BIG DECIMAL"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC49538
    @Test
    public void importWithPrepareDataObject(){
        String report = "Report with prompt - Object prompt | Required | Default answer";

        int[] attributes = {0, 2};
        int[] metrics = {-1};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{2, 3, 4, 5, 6, 7, 8, 9});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importThroughPrepareDataFlowThenRepromtTestStart(report, machine.getObjectPromptPage(),
                attributes, metrics, filterAndValuesArr);

        machine.getObjectPromptPage().getRemoveAllBtnElem().click();
        machine.getObjectPromptPage().getImportObjectElems().get(2).click();
        machine.getObjectPromptPage().getAddBtnElem().click();
        machine.getObjectPromptPage().getRunBtnElem().click();

        //assert cell values
        String[][] expectedCellValues = {
                {"A2", "Books"},
                {"D7", "$6 576 147"},
                {"B4", "2016"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC49540
    @Test
    public void importWithPrepareDataAttributeQualification(){
        String report = "Report with prompt - Expression prompt (Attribute Qualification Prompt on Year) | Required | Not default";

        int[] attributes = {0, 1};
        int[] metrics = {-1};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{0});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importThroughPrepareDataFlowThenRepromtTestStart(report, machine.getAttributeQualificationPromptPage(),
                attributes, metrics, filterAndValuesArr);

        machine.getAttributeQualificationPromptPage().getOperatorSelectionDropDownElem().click();
        machine.getAttributeQualificationPromptPage().clickOperatorSelectionOptionByIndex(4);

        WebElement inputElem = machine.getAttributeQualificationPromptPage().getValueInputElem();
        inputElem.clear();
        inputElem.sendKeys("2016");

        machine.getAttributeQualificationPromptPage().getRunBtnElem().click();

        //assert cell values
        String[][] expectedCellValues = {
                {"A2", "2015"},
                {"D9", "$1 031 392"},
                {"B6", "South"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC49542
    @Test
    public void importWithPrepareDataHierarchy(){
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";

        int[] attributes = {-1};
        int[] metrics = {-1};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importThroughPrepareDataFlowThenRepromtTestStart(report, machine.getHierarchyPromptPage(),
                attributes, metrics, filterAndValuesArr);

        machine.getHierarchyPromptPage().getRemoveAllBtnElem().click();
        machine.getHierarchyPromptPage().getImportObjectElems().get(2).click();
        machine.getHierarchyPromptPage().getAddBtnElem().click();
        machine.getHierarchyPromptPage().getRunBtnElem().click();

        //assert cell values
        machine.getMainPage().getImportedObjectInListNameElem(report);
        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"C11", "$1 053 305"},
                {"D33", "35 023 708"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    private void importThroughPrepareDataFlowThenRepromtTestStart(String reportName, BasePromptPage promptPage,
                                                                  int[] attributes, int[] metrics, FilterAndValuesIndexBased[] filterAndValues) {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(reportName)
                .withAttributes(attributes)
                .withMetrics(metrics)
                .withFiltersAndValues(filterAndValues)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();
        promptPage.answerPromptCorrectly();
        ImportPrepareDataHelper.prepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(reportName);

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);

        importedObjectInList.getRepromptBtnElem().click();
    }

    //2) import and edit + re-prompt
    //TC49533
    //TC48354
    @Test
    public void importAndEditThenRepromtDateAndTime(){
        String report = "Report with prompt - Value prompt - Date (Day) | Required | No default answer";

        int[] attributes = {0};
        int[] metrics = {-1, -1, 0, 1};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{0, 1, 2});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importAndEditTest(report, machine.getDatePromptPage(),
                attributes, metrics, filterAndValuesArr);

        //assert values
        String[][] expectedCellValues = {
                {"A2", "Books"},
                {"A3", "Electronics"},
                {"A4", "Movies"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        machine.getMainPage().getImportedObjectsInList().get(0).getRepromptBtnElem().click();

        machine.getDatePromptPage().getDateInputElemAndInputDate(2016, 1, 1);
        machine.getDatePromptPage().getRunBtnElem().click();

        expectedCellValues = new String[][]{
                {"A2", "Books"},
                {"A3", "Electronics"},
                {"A4", "Movies"}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC49535
    //TC48358
    @Test
    public void importAndEditThenRepromtText(){
        String report = "Report with prompt - Value prompt - Text (Category) | Not required | Default answer";

        int[] attributes = {-1, -1};
        int[] metrics = {1};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{0, 2, 3});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importAndEditTest(report, machine.getTextValuePromptPage(),
                attributes, metrics, filterAndValuesArr);

        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"C4", "$28 030"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        machine.getMainPage().getImportedObjectsInList().get(0).getRepromptBtnElem().click();

        WebDriverElemWrapper inputElem = machine.getTextValuePromptPage().getAnswerInputElem();
        inputElem.clear();
        inputElem.sendKeys("Music");
        machine.getTextValuePromptPage().getRunBtnElem().click();

        //assert values
        expectedCellValues = new String[][]{
                {"A2", "Central"},
                {"B3", "Music"},
                {"C4", "$9 155"}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC49537
    //TC48357
    @Test
    public void importAndEditThenRepromtAttributeElem(){
        String report = "Report with prompt - Attribute element prompt of Category | Required | Not default";

        int[] attributes = {0, 2};
        int[] metrics = {-1, 0, 1};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{-1, 2});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importAndEditTest(report, machine.getAttributeElementPromptPage(),
                attributes, metrics, filterAndValuesArr);

        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"C9", "$118 464"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        machine.getMainPage().getImportedObjectsInList().get(0).getRepromptBtnElem().click();

        machine.getAttributeElementPromptPage().getRemoveAllBtnElem().click();
        machine.getAttributeElementPromptPage().filterAndClickOption("Electronics");
        machine.getAttributeElementPromptPage().filterAndClickOption("Movies");
        machine.getAttributeElementPromptPage().getRunBtnElem().click();

        //assert cell values
        expectedCellValues = new String[][]{
                {"A2", "Central"},
                {"C9", "$1 214 244"},
                {"B5", "$140 754"}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC49539
    //TC48359
    @Test
    public void importAndEditThenRepromtHierarchyQualification(){
        String report = "Report with prompt - Expression prompt (Hierarchy Qualification Prompt) | Not required | Default";

        int[] attributes = {0};
        int[] metrics = {-1, -1};
        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{0, 2});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues1, filterAndValues2};

        importAndEditTest(report, machine.getHierarchyQualificationPromptPage(),
                attributes, metrics, filterAndValuesArr);

        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"B9", "Electronics"},
                {"D17", "$2 006 105"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        machine.getMainPage().getImportedObjectsInList().get(0).getRepromptBtnElem().click();

        machine.getHierarchyQualificationPromptPage().getHierarchyElemByNameAndClick("Customers");

        machine.getHierarchyQualificationPromptPage().getAttributeElemByName("Customer").click();
        machine.getHierarchyQualificationPromptPage().getAddBtnElem().click();

        machine.getHierarchyQualificationPromptPage().getCustomerLastNameDoesNotEqualHierarchySelectionWithValueInputOpen();
        machine.getHierarchyQualificationPromptPage().getAttributeValueInputElem().sendKeys("Aadland");
        machine.getHierarchyQualificationPromptPage().getAttributeValueOKBtnElem().click();
        machine.getHierarchyQualificationPromptPage().getRunBtnElem().click();

        expectedCellValues = new String[][]{
                {"A2", "Central"},
                {"D17", "$2 006 078"},
                {"C11", "$435 242"},
                {"B7", "Electronics"}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC49541
    //TC48362
    @Test
    public void importAndEditThenRepromtMetricQualification(){
        String report = "Report with prompt - Expression prompt (Metric Qualification Prompt on Revenue) | Not required | Not default";

        int[] attributes = {0, 1, 1, 1};
        int[] metrics = {1, -1, 1};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(2, new int[]{-1});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importAndEditTest(report, machine.getMetricQualificationPromptPage(),
                attributes, metrics, filterAndValuesArr);

        String[][] expectedCellValues = {
                {"A2", "Books"},
                {"B5", "$150 777"},
                {"B3", "$4 286 196"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        //re-prompt start
        machine.getMainPage().getImportedObjectsInList().get(0).getRepromptBtnElem().click();

        WebElement inputElem = machine.getMetricQualificationPromptPage().getValueInputElem();
        inputElem.clear();
        inputElem.sendKeys("1500");
        machine.getMetricQualificationPromptPage().getRunBtnElem().click();

        //assert cell values
        expectedCellValues = new String[][]{
                {"A2", "Books"},
                {"B5", "$116 478"},
                {"B3", "$4 270 571"} //$4 286 196
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //edit prompted report with prompt
    //TC48355
    @Test
    public void importAndEditObject() {
        String report = "Report with prompt - Object prompt | Required | Default answer";

        int[] attributes = {1, 2};
        int[] metrics = {0, 0, 0, 0};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1, 2, 4, 6, 8});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importAndEditTest(report, machine.getObjectPromptPage(),
                attributes, metrics, filterAndValuesArr);

        String[][] expectedCellValues = {
                {"A2", "Books"},
                {"C5", "$3 893 367"},
                {"B4", "$254 698"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        assertEquals(report, machine.getMainPage().getImportedObjectsInList().get(0).getNameElem().getText());
    }

    //TC48356
    @Test
    public void importAndEditAttributeQualification() {
        String report = "Report with prompt - Expression prompt (Attribute Qualification Prompt on Year) | Required | Not default";

        int[] attributes = {2, 1, 1};
        int[] metrics = {0};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(2, new int[]{0,2,3});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importAndEditTest(report, machine.getAttributeQualificationPromptPage(),
                attributes, metrics, filterAndValuesArr);

        String[][] expectedCellValues = {
                {"A2", "2015"},
                {"C17", "$714 486"},
                {"B6", "South"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        assertEquals(report, machine.getMainPage().getImportedObjectsInList().get(0).getNameElem().getText());
    }

    //TC48360
    @Test
    public void importAndEditHierarchy() {
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";

        int[] attributes = {1};
        int[] metrics = {0};
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{-1, 4, 3});
        FilterAndValuesIndexBased[] filterAndValuesArr = {filterAndValues};

        importAndEditTest(report, machine.getHierarchyPromptPage(),
                attributes, metrics, filterAndValuesArr);

        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"B7", "3 902 762"}
        };
        machine.getMainPage().assertCellValues(expectedCellValues);

        assertEquals(report, machine.getMainPage().getImportedObjectsInList().get(0).getNameElem().getText());
    }

    private void importAndEditTest(String reportName, BasePromptPage promptPage, int[] attributes, int[] metrics, FilterAndValuesIndexBased[] filterAndValues) {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(reportName)
                .withAttributes(attributes)
                .withMetrics(metrics)
                .withFiltersAndValues(filterAndValues)
                .build();
        ImportPrepareDataHelper.importObject(argumments);
        promptPage.answerPromptCorrectly();

        machine.getMainPage().getImportedObjectInListNameElem(reportName);
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        assertEquals(reportName, importedObjectInList.getNameElem().getText());
        importedObjectInList.getEditBtnElem().click();
        ImportPrepareDataHelper.prepareDataSimple(argumments);
    }

    //TC49543
    @Test
    public void importWithPrepareDataMultiplePrompts() {
        String report = "Report with multiple prompts";
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{-1, -1});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{-1})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();
        machine.getMultiplePromptsPage().answerPromptCorrectly();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        //re-prompt
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.getRepromptBtnElem().click();

        machine.getMultiplePromptsPage().getDateInputElemAndInputDate(2015, 1, 1);
        WebElement answerInputElem = machine.getMultiplePromptsPage().getTextInputElem();
        answerInputElem.clear();
        answerInputElem.sendKeys("Electronics");

        machine.getMultiplePromptsPage().getRunBtnElem().click();

        //assert imported successfully
        importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        TestCase.assertEquals(report, importedObjectInList.getNameElem().getText());

        //assert values good
        String[][] expectedValues = {
                {"A2", "2015"},
                {"E17", "$1 685 408"},
                {"C12", "Electronics"},
                {"D8", "$155 127"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TC49544
    @Test
    public void importAndEditMultiplePrompts() {
        String report = "Report with multiple prompts";
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{0, 2, 2})
                .withMetrics(new int[]{-1, 1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMultiplePromptsPage().answerPromptCorrectly();

        //re-prompt
        machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.getMainPage().getImportedObjectsInList().get(0).getEditBtnElem().click();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObjectInList.getRepromptBtnElem().click();

        machine.getMultiplePromptsPage().getDateInputElemAndInputDate(2015, 5, 5);
        WebElement answerInputElem = machine.getMultiplePromptsPage().getTextInputElem();
        answerInputElem.clear();
        answerInputElem.sendKeys("Electronics");
        machine.getMultiplePromptsPage().getRunBtnElem().click();

        //assert imported successfully
        importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);
        TestCase.assertEquals(report, importedObjectInList.getNameElem().getText());

        //assert values good
        String[][] expectedValues = {
                {"A2", "Central"},
                {"C9", "$244 538"},
                {"B5", "Electronics"},
                {"A9", "Web"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TC49546
    @Test
    public void importWithPrepareDataNestedPrompts(){
        String report = "Report with nested prompt";

        //TODO attributes, metrics, filters and filter values
        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{0, 1, 2, 3});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{1, 2})
                .withMetrics(new int[]{-1})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();
        machine.getStandardPromptPage().getRunBtnElem().click();
        machine.getStandardPromptPage().getRunBtnElem().click();
        ImportPrepareDataHelper.prepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.getMainPage().getImportedObjectsInList().get(0).getRepromptBtnElem().click();

        machine.getStandardPromptPage().getRunBtnElem().click();

        machine.getHierarchyPromptPage().getAddAllBtnElem().click();
        machine.getHierarchyPromptPage().getRunBtnElem().click();

        //assert imported successfully
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "Central"},
                {"E17", "196 269"},
                {"D7", "$3 106 940"},
                {"B11", "Electronics"},
                {"C7", "$545 693"}
        };
        machine.getMainPage().assertCellValues(expectedValues);
    }
}
