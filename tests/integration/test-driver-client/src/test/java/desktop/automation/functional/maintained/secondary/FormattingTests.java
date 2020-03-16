package desktop.automation.functional.maintained.secondary;

import desktop.automation.elementWrappers.enums.FontValue;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

public class FormattingTests extends BaseLoggedInTests {

    //TC40370
    @Test
    public void tableFormatting(){
        FontValue fontValue = FontValue.COURIER_NEW;
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().goToCell("C2");

        machine.getPreSUTPage().getHomeTabElem().click();

        machine.getMainPage().getItalicToggleButton().getElement().click();
        machine.getMainPage().getBoldToggleButton().getElement().click();

        machine.getMainPage().inputFontValue(fontValue);

//        machine.getMainPage().getFontColorSplitButton().changeColor(SplitButton.GREEN);
//        machine.getMainPage().getFillColorSplitButton().changeColor(SplitButton.ORANGE);

        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().goToCell("C2");
        assertTrue(machine.getMainPage().getItalicToggleButton().isOn());
        assertTrue(machine.getMainPage().getBoldToggleButton().isOn());

        machine.getMainPage().assertExpectedFontValueSelected(fontValue);
//        assertEquals(SplitButton.GREEN, machine.getMainPage().getFontColorSplitButton().getValue());
//        assertEquals(SplitButton.ORANGE, machine.getMainPage().getFillColorSplitButton().getValue());
    }


    //TC40367
    @Test
    public void hideColumn() {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().hideHeader("D");
        machine.getMainPage().hideHeader("E");

        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().assertHeaderNotPresent("D");
        machine.getMainPage().assertHeaderNotPresent("E");

        String[][] cellExpectedValues = {
                {"A2", "Afghanistan"},
                {"I1001", "199048,89"},
                {"F455", "Asia"}
        };

        machine.getMainPage().assertCellValues(cellExpectedValues);
    }

    //TC40879
    @Test
    public void hideRows() {
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        machine.getMainPage().hideHeader("2");
        machine.getMainPage().hideHeader("3");

        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        machine.getMainPage().assertHeaderNotPresent("2");
        machine.getMainPage().assertHeaderNotPresent("3");

        String[][] cellExpectecValues = {
                {"A4", "Afghanistan"},
                {"I1001", "199048,89"},
                {"H328", "96767,94"}
        };

        machine.getMainPage().assertCellValues(cellExpectecValues);
    }

    //TC40369
    @Test
    public void changeColumnRowSize(){
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importObject(argumments);

        double firstColWidth = 5;
        double secondColWidth = 20;
        //different Excel clients round out the inputs to different values
        double firstRowHeight = machine.isBrowser() ? 9.75 : machine.isWindowsMachine() ? 10.1 : 10;
        double secondRowHeight = 30;

        machine.getMainPage().changeColumnWidth("A", firstColWidth);
        machine.getMainPage().changeColumnWidth("B", secondColWidth);

        machine.getMainPage().changeRowHeight("1", firstRowHeight);
        machine.getMainPage().changeRowHeight("2", secondRowHeight);

        machine.getMainPage().getImportedObjectsInList().get(0).clickRefreshBtnAndAssertRefreshFlowSingle(false);

        assertEquals(firstColWidth, machine.getMainPage().getHeaderSize("A", true));
        assertEquals(secondColWidth, machine.getMainPage().getHeaderSize("B", true));

        assertEquals(firstRowHeight, machine.getMainPage().getHeaderSize("1", false));
        assertEquals(secondRowHeight, machine.getMainPage().getHeaderSize("2", false));
    }
}
