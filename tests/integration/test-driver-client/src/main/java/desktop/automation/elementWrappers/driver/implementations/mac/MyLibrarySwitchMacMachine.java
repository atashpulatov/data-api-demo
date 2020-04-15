package desktop.automation.elementWrappers.driver.implementations.mac;

import desktop.automation.elementWrappers.MyLibrarySwitch;
import org.openqa.selenium.WebElement;

public class MyLibrarySwitchMacMachine extends MyLibrarySwitch {

    public MyLibrarySwitchMacMachine(WebElement driverElement) {
        super(driverElement);
    }

    @Override
    public boolean isOn() {
        String value = getDriverElement().getAttribute("AXValue");

        return value.equals("1");
    }
}
