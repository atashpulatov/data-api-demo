package desktop.automation.elementWrappers.driver.implementations.windows;

import desktop.automation.elementWrappers.ToggleButton;
import desktop.automation.elementWrappers.WebDriverElemWrapper;

public class ToggleButtonWindowsMachine extends ToggleButton {

    public ToggleButtonWindowsMachine(WebDriverElemWrapper element) {
        super(element);
    }

    @Override
    public boolean isOn(){
        return element.getDriverElement().getAttribute("Toggle.ToggleState").matches("1");
    }
}
