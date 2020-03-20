package desktop.automation.functional.not.maintained.prompts;

import desktop.automation.helpers.*;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;
import org.openqa.selenium.WebElement;

public class PromptPrepareDataTests extends BaseLoggedInTests {

    //TC40314
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
        Thread.sleep(5_000);

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

    //TC40306
    @Test
    public void prepareDataDateAndTime(){
        String report = "Report with prompt - Value prompt - Date (Day) | Required | No default answer";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{0, 1})
                .withMetrics(new int[]{1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getDatePromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "Central"},
                {"C33", "$377 770"},
                {"B19", "Electronics"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TODO TC40307
    //TC40360
    @Test
    public void prepareDataNumeric(){
        String report = "Report with prompt - Value prompt - Numeric (Year) | Required | Default answer";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1, 0, 1});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{-1, 1, 1, 1})
                .withMetrics(new int[]{0, 1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getNumericPromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "2015"},
                {"D5", "$928 719"},
                {"B4", "Movies"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TC40308
    @Test
    public void prepareDataText() {
        String report = "Report with prompt - Value prompt - Text (Category) | Not required | Default answer";

        FilterAndValuesNameBased filterAndValues = new FilterAndValuesNameBased("Region", new String[]{"Southeast"});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{1})
                .withMetrics(new int[]{0, 1})
                .withFiltersAndValues(new FilterAndValues[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        // prompt
        machine.getTextValuePromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "Books"},
                {"B2", "$36 619"},
                {"C2", "$170 445"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TODO TC40309
    @Test
    public void prepareDataBigDecimal(){
        String report = "Report with prompt - Value prompt - Big Decimal (Customer ID) | Not required | No default answer";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{0})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getBigDecimalPromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "1820"},
                {"B2", "$688"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TC40310
    @Test
    public void prepareDataAttributeElem(){
        String report = "Report with prompt - Attribute element prompt of Category | Required | Not default";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{1, 2});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{0, 1})
                .withMetrics(new int[]{0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getAttributeElementPromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "2015"},
                {"C17", "$37 501"},
                {"B12", "Northeast"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TODO TC40311
    @Test
    public void prepareDataObject(){
        String report = "Report with prompt - Object prompt | Required | Default answer";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(1, new int[]{-1, 0, 3});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{-1})
                .withMetrics(new int[]{-1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getObjectPromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "Books"},
                {"E67", "$201 379"},
                {"C41", "2014"},
                {"B36", "Comedy"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TC40312
    @Test
    public void prepareDataHierarchyQualification(){
        String report = "Report with prompt - Expression prompt (Hierarchy Qualification Prompt) | Not required | Default";

        FilterAndValuesIndexBased filterAndValues = new FilterAndValuesIndexBased(0, new int[]{1, 2});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{2})
                .withMetrics(new int[]{0, 1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getHierarchyQualificationPromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "Books"},
                {"C3", "$18 363 460"},
                {"B2", "$429 326"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TC40313
    @Test
    public void prepareDataAttributeQualification(){
        String report = "Report with prompt - Expression prompt (Attribute Qualification Prompt on Year) | Required | Not default";

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{0, 1});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1, 7, 6});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{-1})
                .withMetrics(new int[]{-1, -1, -1})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1, filterAndValues2})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getAttributeQualificationPromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "2015"},
                {"E49", "$100 919"},
                {"C18", "Books"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }

    //TODO TC40315
    @Test
    public void prepareDataHierarchy(){
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{-1});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .withAttributes(new int[]{-1})
                .withMetrics(new int[]{-1, 0, 0, 0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1, filterAndValues2})
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getPrepareDataBtnElem().click();

        machine.getHierarchyPromptPage().answerPromptCorrectly();

        ImportPrepareDataHelper.prepareDataSimple(argumments);
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //assert values good
        String[][] expectedValues = {
                {"A2", "Central"},
                {"C33", "433 233"},
                {"B15", "Electronics"}
        };

        machine.getMainPage().assertCellValues(expectedValues);
    }
}
