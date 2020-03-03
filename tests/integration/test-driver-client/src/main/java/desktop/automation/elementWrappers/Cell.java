package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.DriverType;
import desktop.automation.elementWrappers.windows.CellWindowsMachine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.remote.RemoteWebElement;

public abstract class Cell {
    protected RemoteWebElement element;

    protected Cell(RemoteWebElement element) {
        this.element = element;
    }

    public String getValue(){
        return element.getAttribute("Value.Value");
    }

    public boolean isFocused() {
        //deprecated?
        String res = element.getAttribute("HasKeyboardFocus");
        return res.trim().toLowerCase().matches("true");
    }

    public abstract boolean hasConditionalFormattingApplied();

    public String getFillColor(){
        //deprecated?
        return element.getAttribute("FillColor");
    }

    public RemoteWebElement getElement() {
        return element;
    }

    public static Cell getCell(DriverType driverType, RemoteWebElement element){
        switch (driverType) {
            case MAC_DESKTOP:
                return null;
            case WINDOWS_DESKTOP:
                return new CellWindowsMachine(element);
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }
}
