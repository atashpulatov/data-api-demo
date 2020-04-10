package desktop.automation.elementWrappers.driver.implementations.mac;

import desktop.automation.elementWrappers.ToggleButton;
import desktop.automation.elementWrappers.WebDriverElemWrapper;

public class ToggleButtonMacMachine extends ToggleButton {

    public ToggleButtonMacMachine(WebDriverElemWrapper element) {
        super(element);
    }

    @Override
    public boolean isOn() {
        //when elem is retrieved there is a delay until the value returned is correct
        try {
            Thread.sleep(1_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        String axValue = element.getDriverElement().getAttribute("AXValue");
        return axValue.matches("1");
    }

}
