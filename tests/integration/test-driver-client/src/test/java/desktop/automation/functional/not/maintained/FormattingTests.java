package desktop.automation.functional.not.maintained;

import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.elementWrappers.driver.implementations.windows.FillColor;
import desktop.automation.elementWrappers.driver.implementations.windows.FormatValue;
import desktop.automation.elementWrappers.enums.FontValue;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Ignore;
import org.junit.Test;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertFalse;

public class FormattingTests extends BaseLoggedInTests {

    //TC40372
    @Test
    public void conditional() {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().goToCell("H1");
        machine.actions
                .click(machine.getMainPage().getHeaderElem("H").getDriverElement())
                .perform();

        machine.getPreSUTPage().getHomeTabElem().click();
        machine.getFormattingPage().getConditionalFormattingMenuElem().click();
        machine.getFormattingPage().getHighlightCellsMenuItemElem().click();
        machine.getFormattingPage().getHighlightSubruleGreaterThanElem().click();

        //TODO does Windows require the following field?
        if (DESIRED_DRIVER_TYPE.equals(DriverType.MAC_DESKTOP))
            machine.getFormattingPage().getHighlightGreaterThanBoundInputElem().sendKeys("1000");

        machine.getFormattingPage().getConditionalFormattingPromptOKBtnElem().click();

        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        assertTrue(machine.getMainPage().isConditionalFormattingAppliedToCell("H2"));
        assertFalse(machine.getMainPage().isConditionalFormattingAppliedToCell("G2"));
    }

    //TC40373
    @Test
    public void tableStyles(){
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getFormattingPage().getFirstTableStyleElem().click();

        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        assertTrue(machine.getFormattingPage().isTableStyleElemSelected(machine.getFormattingPage().getFirstTableStyleElem()));
    }

    //TC40865
    @Test
    public void alignmentAndFont() throws InterruptedException {
        FontValue fontValue = FontValue.ARIAL_BLACK;

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);
        Thread.sleep(3_000);

        ImportedObjectInList importedObj = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObj.getMainElem().click();

        machine.getPreSUTPage().getHomeTabElem().click();
        machine.getFormattingPage().getCenterAlignElem().getElement().click();

        machine.getMainPage().inputFontValue(fontValue);

        importedObj.clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().getImportedObjectsInList().get(0).getMainElem().click();

        assertTrue(machine.getFormattingPage().getCenterAlignElem().isOn());
        machine.getMainPage().assertExpectedFontValueSelected(fontValue);
    }

    //TC40867
    @Test
    public void borderAndFill() throws InterruptedException {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withCell("B2")
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        ImportedObjectInList importedObj = machine.getMainPage().getImportedObjectsInList().get(0);
        importedObj.getMainElem().click();

        if (DESIRED_DRIVER_TYPE.equals(DriverType.MAC_DESKTOP))
            Thread.sleep(1_000);

        machine.getPreSUTPage().openFormatCellsPromptPage();

        machine.getFormatCellsPromptPage().getFormatCellsBorderTabElem().click();
        machine.getFormatCellsPromptPage().getOutlineBorderValueElem().click();

        FillColor testColor = FillColor.LIGHT_ORANGE;
        machine.getFormatCellsPromptPage().getFormatCellsFillTabElem().click();
        machine.actions
                .moveToElement(machine.getFormatCellsPromptPage().getFillValueElem(testColor))
                .click()
                .pause(500)
                .perform();

        machine.getFormatCellsPromptPage().getOKButtonElem().click();

        importedObj.getRefreshBtnElem().click();
//        if (DESIRED_DRIVER_TYPE.equals(DriverType.MAC_DESKTOP)) //TODO replace with new refresh page controls
//            ((MainPageMacMachine)machine.getMainPage()).waitForDialogOpenNotificationToAppearAndDisappears();


        //assertions
        machine.getMainPage().getImportedObjectsInList().get(0).getMainElem().click();

        machine.getPreSUTPage().openFormatCellsPromptPage();

        machine.getFormatCellsPromptPage().getFormatCellsBorderTabElem().click();
        machine.getFormatCellsPromptPage().assertBorderOutlineIsSelected();

        machine.getFormatCellsPromptPage().getFormatCellsFillTabElem().click();
        machine.getFormatCellsPromptPage().assertFillValueSelected(testColor);

        machine.getFormatCellsPromptPage().getOKButtonElem().click();
    }

    //TC40371
    @Ignore
    @Test
    public void numberFormatting(){
        String report = "Number Formatting";

        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .withObjectName(report)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        String[][] headerToFormat = {
                {"A", "Number"},
                {"B", "General"},
                {"C", "Currency"},
                {"D", "Accounting"},
                {"E", "Date"},
                {"F", "Time"},
                {"G", "Percentage"},
                {"H", "Fraction"},
                {"I", "Custom"},
                {"J", "Text"},
                {"K", "Special"},
                {"L", "Scientific"}
        };

        for (String[] rowFormat : headerToFormat) {
            machine.getMainPage().goToCell(rowFormat[0] + 1);

            WebDriverElemWrapper header = machine.getMainPage().getHeaderElem(rowFormat[0]);
            machine.contextClickElem(header.getDriverElement());
            machine.getMainPage().getFormatCellsMenuItemElem().click();

            FormatValue target = machine.getMainPage().getCellFormatValueElem(rowFormat[1]);
            try {
                //on Mac the AppiumForMac driver clicks the element, but throws an exception, just ignore it and carry on
                target.getElement().click();
            } catch (org.openqa.selenium.WebDriverException ignored){}

            machine.getMainPage().getFormatValuePaneOKBtnElem().click();
        }

        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        String[][] cellExpectedValues = {
                {"A2", "Dollar"},
                {"B2", "4560"},
                {"C2", "0,35"},
                {"D2", "43 811,00"},
                {"E2", "00.01.1900"},
                {"F2", "45/56"},
                {"G2", "12728394000,00%"},
                {"H2", "1 1/4"},
                {"I2", "1345654"},
                {"J2", "-123"},
                {"K2", "00-035"},
                {"L2", "1,23E+03"}
        };

        for (String[] cellExpectedValue : cellExpectedValues) {
            machine.getMainPage().goToCellAndAssertValue(cellExpectedValue[0], cellExpectedValue[1]);
        }

        for (String[] rowFormat : headerToFormat) {
            machine.getMainPage().goToCell(rowFormat[0] + 1);

            WebDriverElemWrapper header = machine.getMainPage().getHeaderElem(rowFormat[0]);
            machine.contextClickElem(header.getDriverElement());
            machine.getMainPage().getFormatCellsMenuItemElem().click();

            FormatValue target = machine.getMainPage().getCellFormatValueElem(rowFormat[1]);

            boolean targetIsSelected = target.isSelected();
            if (!targetIsSelected) {
                String message = String.format("Expected initial format is not persisted after refresh. Header: %s, expected format: %s", rowFormat[0], rowFormat[1]);
                assertTrue(message, targetIsSelected);
            }

            machine.getMainPage().getFormatValuePaneOKBtnElem().click();
        }

    }
}
