package desktop.automation.elementWrappers.driver.implementations.windows;

import desktop.automation.elementWrappers.MyLibrarySwitch;
import org.openqa.selenium.WebElement;

public class MyLibrarySwitchWindowsMachine extends MyLibrarySwitch {

    public MyLibrarySwitchWindowsMachine(WebElement driverElement) {
        super(driverElement);
    }

    private String getAriaProperties(){
        return getDriverElement().getAttribute("AriaProperties");
    }

    @Override
    public boolean isOn() {
        //structure is "checked=true;label..."
        String raw = getAriaProperties();
        String resStr = raw.split(";")[0].split("=")[1];

        return Boolean.parseBoolean(resStr);
    }
}
