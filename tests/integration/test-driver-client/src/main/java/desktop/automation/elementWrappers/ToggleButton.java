package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.DriverType;
import desktop.automation.elementWrappers.browser.ToggleButtonBrowser;
import desktop.automation.elementWrappers.mac.FontControls.ToggleButtonMacMachine;
import desktop.automation.elementWrappers.windows.ToggleButtonWindowsMachine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;

public abstract class ToggleButton {
    protected WebDriverElemWrapper element;

    protected ToggleButton(WebDriverElemWrapper element) {
        this.element = element;
    }

    public WebDriverElemWrapper getElement() {
        return element;
    }

    public abstract boolean isOn();

    public static ToggleButton getToggleButton(DriverType driverType, WebDriverElemWrapper element) {
        switch (driverType){
            case BROWSER:
                return new ToggleButtonBrowser(element);
            case MAC_DESKTOP:
                return new ToggleButtonMacMachine(element);
            case WINDOWS_DESKTOP:
                return new ToggleButtonWindowsMachine(element);
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }
}
