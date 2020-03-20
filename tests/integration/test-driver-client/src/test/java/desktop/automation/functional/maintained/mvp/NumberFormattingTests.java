package desktop.automation.functional.maintained.mvp;

import desktop.automation.test.infrastructure.BaseNumberFormattingTests;
import org.junit.Test;

public class NumberFormattingTests extends BaseNumberFormattingTests {

    //TC35279
    @Test
    public void currency() {
        String[][] expected = {
                {"B2", "$4 560,00"},
                {"B3", "$3 456,00"},
                {"B4", "$8 907,00"}
        };

        checkIfCellsMatch(expected);
    }

    //TC35285
    @Test
    public void percentage(){
        String[][] expected = {
                {"C2", "34,67%"},
                {"C3", "678,00%"},
                {"C4", "245,90%"}
        };

        checkIfCellsMatch(expected);
    }

    //TC35286
    @Test
    public void dateAndTime(){
        String[][] expected = {
                {"D2", "12/12/2019"},
                {"D3", "07/14/2098"},
                {"D4", "01/13/1986"},
                {"E2", "5:11:29 PM"},
                {"E3", "7:21:55 PM"},
                {"E4", "6:09:34 PM"}
        };

        checkIfCellsMatch(expected);
    }

    //TC35288
    @Test
    public void fraction(){
        String[][] expected = {
                {"F2", "45/56"},
                {"F3", "34/12"},
                {"F4", "67/23"}
        };

        checkIfCellsMatch(expected);
    }

    //TC35289
    @Test
    public void scientific() {
        String[][] expected = {
                {"G2", "1,27E+08"},
                {"G3", "1,35E+17"},
                {"G4", "1,34E+09"}
        };

        checkIfCellsMatch(expected);
    }

    //TC35290
    @Test
    public void decimalAndThousands() {
        String[][] expected = {
                {"H2", "1,23"},
                {"H3", "123,45"},
                {"H4", "12 343,57"},
                {"I2", "1 345 654"},
                {"I3", "23 456 789 123"},
                {"I4", "13 456 789"}
        };

        checkIfCellsMatch(expected);
    }

    //TC35291
    @Test
    public void negative(){
        //Does not check for font color
        String[][] expected = {
                {"J2", "-123"},
                {"J3", "-3"},
                {"J4", "-456"}
        };

        checkIfCellsMatch(expected);
    }

    //TC35292
    @Test
    public void rounding(){
        String[][] expected = {
                {"K2", "35"},
                {"K3", "23146"},
                {"K4", "4568"}
        };

        checkIfCellsMatch(expected);
    }

    //TC35293
    @Test
    public void custom(){
        String[][] expected = {
                {"L2", "1 232 PLN"},
                {"L3", "7 896 434 PLN"},
                {"L4", "245 677 PLN"}
        };

        checkIfCellsMatch(expected);
    }

    private void checkIfCellsMatch(String[][] expected) {
        machine.getMainPage().assertCellValues(expected);
    }
}
