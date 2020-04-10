package desktop.automation.functional.not.maintained;

import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;
import org.openqa.selenium.WebElement;

import static junit.framework.TestCase.assertTrue;

public class PromptsErrorHandlingTests extends BaseLoggedInTests {

    //TC40351
    @Test
    public void numericOutsideRange(){
        //TODO elaborate assertions
        //TODO needs different test data to match test case, right now using with default answer
            //TODO remove the clear call once proper test data available
        String report = "Report with prompt - Value prompt - Numeric (Year) | Required | Default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        WebDriverElemWrapper input = machine.getNumericPromptPage().getNumberInputElem();
        input.clear();
        input.sendKeys("2017");

        assertTrue(machine.isButtonEnabled(machine.getStandardPromptPage().getCancelBtnElem()));
        assertTrue(machine.isButtonEnabled(machine.getStandardPromptPage().getRunBtnElem()));

        WebElement runBtn = machine.getStandardPromptPage().getRunBtnElem();
        runBtn.click();
        machine.getStandardPromptPage().getNumericPromptOutOfRangeMessage().getText();

        input.clear();
        input.sendKeys("2015");

        runBtn.click();

        machine.getMainPage().getImportedObjectInListNameElem(report);
    }

    //TC40352
    @Test
    public void missingReqAnswer(){
        String report = "Report with prompt - Value prompt - Date (Day) | Required | No default answer";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        assertTrue(machine.isButtonEnabled(machine.getDatePromptPage().getCancelBtnElem()));
        assertTrue(machine.isButtonEnabled(machine.getDatePromptPage().getRunBtnElem()));

        WebElement runBtn = machine.getDatePromptPage().getRunBtnElem();
        runBtn.click();

        machine.getDatePromptPage().getPromptRequiresAnswerMessageElem();

        machine.getDatePromptPage().getDateInputElemAndInputDate(2014, 2,2);
        runBtn.click();

        machine.getMainPage().getImportedObjectInListNameElem(report);
    }
}
