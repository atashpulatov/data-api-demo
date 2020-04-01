package desktop.automation.functional.maintained.mvp.prompts;

import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import static junit.framework.TestCase.assertEquals;

public class PromptBasicImportTests extends BaseLoggedInTests {

    //TC40294 Part 1
    @Test
    public void date() {
        String report = "Report with prompt - Value prompt - Date (Day) | Required | No default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        //step 3 assertions
        assertEquals("", machine.getDatePromptPage().getDateInputElem().getText().trim());

        machine.getDatePromptPage().getCancelBtnElem();
        machine.getDatePromptPage().getRunBtnElem();

        //step 4 action
        machine.getDatePromptPage().getDateInputElemAndInputDate(2015, 1, 1);

        //step 5 action
        machine.getDatePromptPage().clickRunBtnAndAssertImportFLow();

        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40294 Part 2
    @Test
    public void dateAndTime(){
        String report = "Report with prompt - Value prompt - Date & Time (Day) | Required | No default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        //step 3 assertions
        assertEquals("", machine.getDatePromptPage().getDateInputElem().getText().trim());

        machine.getDatePromptPage().getCancelBtnElem();
        machine.getDatePromptPage().getRunBtnElem();

        //step 4 action
        machine.getDatePromptPage().getDateInputElemAndInputDate(2015, 11, 7);
        machine.getDatePromptPage().inputTime(12, 1, 3);

        //step 5 action
        machine.getDatePromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40295
    @Test
    public void numericReqDefault(){
        String report = "Report with prompt - Value prompt - Numeric (Year) | Required | Default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        //step 3 assertions
        machine.getNumericPromptPage().getCancelBtnElem();
        machine.getNumericPromptPage().getRunBtnElem();

        WebDriverElemWrapper inputElem = machine.getNumericPromptPage().getNumberInputElem();
        assertEquals("2014", inputElem.getText().trim());

        //step 4 action
        inputElem.clear();
        inputElem.sendKeys("2015");

        //step 5 action
        machine.getNumericPromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40296
    @Test
    public void textNotReqDefault(){
        String report = "Report with prompt - Value prompt - Text (Category) | Not required | Default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        //step 3 assertions
        assertEquals("Books", machine.getTextValuePromptPage().getAnswerInputElem().getText().trim());

        machine.getTextValuePromptPage().getCancelBtnElem();
        machine.getTextValuePromptPage().getRunBtnElem();

        //step 4 action
        machine.getTextValuePromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40297
    @Test
    public void bigDecimalNotReq(){
        String report = "Report with prompt - Value prompt - Big Decimal (Customer ID) | Not required | No default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getBigDecimalPromptPage().getCancelBtnElem();
        machine.getBigDecimalPromptPage().getRunBtnElem();

        WebElement inputElem = machine.getBigDecimalPromptPage().getAnswerInputElem();
        inputElem.sendKeys("1820");

        machine.getBigDecimalPromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40298
    @Test
    public void attributeElementReq(){
        String report = "Report with prompt - Attribute element prompt of Category | Required | Not default";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getAttributeElementPromptPage().getCancelBtnElem();
        machine.getAttributeElementPromptPage().getRunBtnElem();

        WebElement searchElem = machine.getAttributeElementPromptPage().getSearchElem();
        searchElem.sendKeys("Books");
        searchElem.sendKeys(Keys.ENTER);

        machine.getAttributeElementPromptPage().getAddBtnElem().click();
        machine.getAttributeElementPromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40299
    @Test
    public void objectReqDefault() {
        String report = "Report with prompt - Object prompt | Required | Default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getObjectPromptPage().getCancelBtnElem();
        machine.getObjectPromptPage().getRunBtnElem();

        machine.getObjectPromptPage().getAddAllBtnElem().click();
        machine.getAttributeElementPromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40300
    @Test
    public void hierarchyQualificationNotReqDefault() throws InterruptedException {
        String report = "Report with prompt - Expression prompt (Hierarchy Qualification Prompt) | Not required | Default";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getStandardPromptPage().getCancelBtnElem();
        machine.getStandardPromptPage().getRunBtnElem();

        Thread.sleep(machine.isBrowser() ? 10_000 : 3_000);
        machine.getStandardPromptPage().clickRunBtnAndAssertImportFLow();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40362
    @Test
    public void multiple(){
        String report = "Report with multiple prompts";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getMultiplePromptsPage().getDateInputElemAndInputDate(2015, 3, 8);

        WebElement textInput = machine.getMultiplePromptsPage().getTextInputElem();
        textInput.click();
        textInput.clear();
        textInput.sendKeys("Movies");

        machine.getMultiplePromptsPage().clickRunBtnAndAssertImportFLow();
        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40364
    @Test
    public void multipleWithPrepData(){
        String report = "Report with multiple prompts";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1, 0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withAttributes(new int[]{0, 2, 0, 1})
                .withMetrics(new int[]{0, 0, -1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getMultiplePromptsPage().getDateInputElemAndInputDate(2015, 3, 8);

        WebElement textInput = machine.getMultiplePromptsPage().getTextInputElem();
        textInput.click();
        textInput.clear();
        textInput.sendKeys("Movies");

        machine.getMultiplePromptsPage().getRunBtnElem().click();

        ImportPrepareDataHelper.prepareDataSimple(argumments);

        String[][] expectedCellValues = {
                {"A2", "Mid-Atlantic"},
                {"D8", "$380 435"},
                {"C1", "Profit"},
                {"B8", "Movies"}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC40365
    @Test
    public void nestedPrompts() throws InterruptedException {
        String report = "Report with nested prompt";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();
        Thread.sleep(!machine.isWindowsMachine() ? 10_000 : 3_000);

        machine.getStandardPromptPage().getRunBtnElem().click();
        Thread.sleep(!machine.isWindowsMachine() ? 10_000 : 1_000);
        machine.getStandardPromptPage().clickRunBtnAndAssertImportFLow();

        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40302
    @Test
    public void metricQualificationNotReqNoDefault() throws InterruptedException {
        String report = "Report with prompt - Expression prompt (Metric Qualification Prompt on Revenue) | Not required | Not default";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        //prompt
        machine.getMetricQualificationPromptPage().getMetricSelectionInputDropDownElem().click();

        machine.getMetricQualificationPromptPage().getMetricSelectionOptionByIndex(1).click();

        machine.getMetricQualificationPromptPage().getValueInputElem().sendKeys("1000");

        machine.getMetricQualificationPromptPage().clickRunBtnAndAssertImportFLow();

//      assert imported successfully
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "2014"},
                {"E95", "$263 072"},
                {"C49", "Electronics"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TC40301
    @Test
    public void attributeQualificationNoDefault(){
        String report = "Report with prompt - Expression prompt (Attribute Qualification Prompt on Year) | Required | Not default";
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        //prompt
        machine.getAttributeQualificationPromptPage().getOperatorSelectionDropDownElem().click();

        machine.getAttributeQualificationPromptPage().clickOperatorSelectionOptionByIndex(3);

        machine.getAttributeQualificationPromptPage().getValueInputElem().sendKeys("2015");

        machine.getAttributeQualificationPromptPage().clickRunBtnAndAssertImportFLow();
        //assert imported successfully
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "2015"},
                {"E65", "$263 072"},
                {"D44", "$25 602"},
                {"B38", "Mid-Atlantic"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    @Test
    public void prepareDataMetricQualificationNotReqNoDefault() throws InterruptedException {
        String report = "Report with prompt - Expression prompt (Metric Qualification Prompt on Revenue) | Not required | Not default";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1, 5, 6});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{0, 1})
                .withMetrics(new int[]{1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        //prompt
        machine.getMetricQualificationPromptPage().getMetricSelectionInputDropDownElem().click();

        WebElement element = machine.getMetricQualificationPromptPage().getMetricSelectionOptionByIndex(1);
        element.click();

        WebElement valueInput = machine.getMetricQualificationPromptPage().getValueInputElem();
        valueInput.sendKeys("5000");

        machine.getMetricQualificationPromptPage().getRunBtnElem().click();

        //prepare data
        ImportPrepareDataHelper.prepareDataSimple(argumments);

//      assert imported successfully
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "2014"},
                {"C19", "$1 707 548"},
                {"B4", "Northeast"},
                {"C15", "$1 224 377"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TC40303
    //TC40355
    @Test
    public void hierarchyNotReqDefault(){
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        //prompt
        machine.getHierarchyPromptPage().getAddAllBtnElem().click();

        machine.getHierarchyPromptPage().clickRunBtnAndAssertImportFLow();

        //assert imported successfully
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "Central"},
                {"D33", "433 233"},
                {"C23", "$271 833"},
                {"B14", "Books"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

}
