package desktop.automation.elementWrappers.mac;

import desktop.automation.elementWrappers.Cell;
import org.openqa.selenium.remote.RemoteWebElement;

public class CellMacMachine extends Cell {

    protected CellMacMachine(RemoteWebElement element) {
        super(element);
    }

    @Override
    public boolean hasConditionalFormattingApplied() {
        System.out.println(element.getAttribute("AXTopLevelUIElement"));

        return false;
    }
}
