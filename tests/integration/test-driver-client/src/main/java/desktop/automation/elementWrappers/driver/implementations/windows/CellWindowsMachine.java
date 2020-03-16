package desktop.automation.elementWrappers.driver.implementations.windows;

import desktop.automation.elementWrappers.Cell;
import org.openqa.selenium.remote.RemoteWebElement;

public class CellWindowsMachine extends Cell {

    public CellWindowsMachine(RemoteWebElement element) {
        super(element);
    }

    @Override
    public boolean hasConditionalFormattingApplied() {
        String attr = element.getAttribute("ItemStatus");
        if (attr == null)
            return false;

        return attr.contains("Contains Conditional Formatting.");
    }

}
