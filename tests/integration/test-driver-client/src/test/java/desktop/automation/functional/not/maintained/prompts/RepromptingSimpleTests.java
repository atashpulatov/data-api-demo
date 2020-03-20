package desktop.automation.functional.not.maintained.prompts;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.WebElement;

public class RepromptingSimpleTests extends BaseLoggedInTests {

    //TODO recheck asserted values MANUALLY
    //TC49523
    @Ignore
    @Test
    public void repromptDateAndTimeReqNoDefault(){
        String report = "Report with prompt - Value prompt - Date (Day) | Required | No default answer";
        basicImportThenRepromtTestStart(report, machine.getDatePromptPage());

        machine.getDatePromptPage().getDateInputElemAndInputDate(2014, 5, 5);
        machine.getDatePromptPage().getRunBtnElem().click();

        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"D33", "$377 770"},
                {"B12", "Movies"},
                {"C21", "$24 785"},
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC49524
    @Test
    public void repromptNumeric(){
        String report = "Report with prompt - Value prompt - Numeric (Year) | Required | Default answer";
        basicImportThenRepromtTestStart(report, machine.getNumericPromptPage());

        machine.getNumericPromptPage().getNumberInputElem().sendKeys("2016");
        machine.getNumericPromptPage().getRunBtnElem().click();

        String[][] expectedCellValues = {
                {"A2", "2016"},
                {"E33", "$263 072"}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC49525
    @Test
    public void repromptText(){
        String report = "Report with prompt - Value prompt - Text (Category) | Not required | Default answer";
        basicImportThenRepromtTestStart(report, machine.getTextValuePromptPage());

        WebDriverElemWrapper inputElem = machine.getTextValuePromptPage().getAnswerInputElem();
        inputElem.clear();
        inputElem.sendKeys("Electronics");
        machine.getTextValuePromptPage().getRunBtnElem().click();

        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"D9", "$2 724 922"}
        };

        machine.getMainPage().assertObjectImportAndCellValues(report, expectedCellValues);
    }

    //TC49526
    @Test
    public void repromptBigDecimalReqNoDefault(){
        String report = "Report with prompt - Value prompt - Big Decimal (Customer ID) | Not required | No default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        WebElement inputElem = machine.getBigDecimalPromptPage().getAnswerInputElem();
        inputElem.sendKeys("1820");

        machine.getBigDecimalPromptPage().getRunBtnElem().click();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //Test
        machine.getMainPage().getImportedObjectsInList().get(0).getRepromptBtnElem().click();

        machine.getBigDecimalPromptPage().getAnswerInputElem().clear();
        machine.getBigDecimalPromptPage().getAnswerInputElem().sendKeys("1805");

        machine.getBigDecimalPromptPage().getRunBtnElem().click();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);

        String[][] expectedCellValues = {
                {"A2", "1805"},
                {"B2", "$862"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC49527
    @Test
    public void repromptAttributeElement(){
        String report = "Report with prompt - Attribute element prompt of Category | Required | Not default";
        basicImportThenRepromtTestStart(report, machine.getAttributeElementPromptPage());

        machine.getAttributeElementPromptPage().getAddAllBtnElem().click();
        machine.getAttributeElementPromptPage().getRunBtnElem().click();

        //assert that import succeeded
        machine.getMainPage().getImportedObjectInListNameElem(report);

        String[][] expectedCellValues = {
                {"A2", "2014"},
                {"E97", "$263 072"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    // TC49528
    @Test
    public void repromptObject(){
        String report = "Report with prompt - Object prompt | Required | Default answer";
        basicImportThenRepromtTestStart(report, machine.getObjectPromptPage());

        machine.getObjectPromptPage().getRemoveAllBtnElem().click();
        machine.getObjectPromptPage().getImportObjectElems().get(0).click();
        machine.getObjectPromptPage().getAddBtnElem().click();
        machine.getObjectPromptPage().getRunBtnElem().click();

        String[][] expectedCellValues = {
                {"A2", "Books"},
                {"C5", "$3 893 367"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC49529
    @Test
    public void repromptHierarchyQualification(){
        String report = "Report with prompt - Expression prompt (Hierarchy Qualification Prompt) | Not required | Default";
        basicImportThenRepromtTestStart(report, machine.getHierarchyQualificationPromptPage());

        machine.getHierarchyQualificationPromptPage().getHierarchyElemByNameAndClick("Customers");

        machine.getHierarchyQualificationPromptPage().getAttributeElemByName("Customer").click();
        machine.getHierarchyQualificationPromptPage().getAddBtnElem().click();

        machine.getHierarchyQualificationPromptPage().getCustomerLastNameDoesNotEqualHierarchySelectionWithValueInputOpen();
        machine.getHierarchyQualificationPromptPage().getAttributeValueInputElem().sendKeys("Aadland");
        machine.getHierarchyQualificationPromptPage().getAttributeValueOKBtnElem().click();
        machine.getHierarchyQualificationPromptPage().getRunBtnElem().click();

        machine.getMainPage().getImportedObjectInListNameElem(report);

        String[][] expectedCellValues = {
                {"A2", "2014"},
                {"C19", "Electronics"},
                {"D25", "$74 977"},
                {"E49", "$1 685 381"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC49530
    @Test
    public void repromptAttributeQualification(){
        String report = "Report with prompt - Expression prompt (Attribute Qualification Prompt on Year) | Required | Not default";
        basicImportThenRepromtTestStart(report, machine.getAttributeQualificationPromptPage());

        WebElement inputElem = machine.getAttributeQualificationPromptPage().getValueInputElem();
        inputElem.clear();
        inputElem.sendKeys("2016");
        machine.getAttributeQualificationPromptPage().getRunBtnElem().click();

        String[][] expectedCellValues = {
                {"A2", "2016"},
                {"E33", "$263 072"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TODO recheck asserted values MANUALLY
    //TC49531
    @Ignore
    @Test
    public void repromptMetricQualification() {
        String report = "Report with prompt - Expression prompt (Metric Qualification Prompt on Revenue) | Not required | Not default";
        basicImportThenRepromtTestStart(report, machine.getMetricQualificationPromptPage());

        WebElement inputElem = machine.getMetricQualificationPromptPage().getValueInputElem();
        inputElem.clear();
        inputElem.sendKeys("2000");

        machine.getMetricQualificationPromptPage().getRunBtnElem();

        String[][] expectedCellValues = {
                {"A2", "2014"},
                {"E82", "$257 677"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    //TC49532
    @Test
    public void repromptHierarchy(){
        String report = "Report with prompt - Hierarchy prompt | Not required | Default";
        basicImportThenRepromtTestStart(report, machine.getHierarchyPromptPage());

        machine.getHierarchyPromptPage().getRemoveAllBtnElem().click();
        machine.getHierarchyPromptPage().getImportObjectElems().get(0).click();
        machine.getHierarchyPromptPage().getAddBtnElem().click();
        machine.getHierarchyPromptPage().getRunBtnElem().click();

        String[][] expectedCellValues = {
                {"A2", "Central"},
                {"D33", "433 233"}
        };

        machine.getMainPage().assertCellValues(expectedCellValues);
    }

    static void basicImportThenRepromtTestStart(String reportName, BasePromptPage promptPage){
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(reportName)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();
        promptPage.answerPromptCorrectly();
        machine.getMainPage().getImportedObjectInListNameElem(reportName);

        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(0);

        importedObjectInList.getRepromptBtnElem().click();
    }

    //TODO TC49545
    @Ignore
    @Test
    public void nestedPrompts(){
        String report = "Report with nested prompt";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.selectObjectToImportSimple(argumments);
        machine.getImportPromptPage().getImportBtnElem().click();

        machine.getStandardPromptPage().getRunBtnElem().click();
        machine.getStandardPromptPage().getRunBtnElem().click();

        machine.getMainPage().getImportedObjectsInList().get(0).getRepromptBtnElem().click();

        machine.getStandardPromptPage().getRunBtnElem().click();

        machine.getHierarchyPromptPage().getAddAllBtnElem().click();
        machine.getHierarchyPromptPage().getRunBtnElem().click();

        //assert imported successfully
        machine.getMainPage().getImportedObjectInListNameElem(report);

        //TODO
        //assert values good
        String[][] expectedValues = {
        };
        machine.getMainPage().assertCellValues(expectedValues);
    }
}
