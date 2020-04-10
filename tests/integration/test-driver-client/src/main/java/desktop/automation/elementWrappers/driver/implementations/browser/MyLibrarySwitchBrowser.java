package desktop.automation.elementWrappers.driver.implementations.browser;

import desktop.automation.elementWrappers.MyLibrarySwitch;
import org.openqa.selenium.WebElement;

public class MyLibrarySwitchBrowser extends MyLibrarySwitch {

    public MyLibrarySwitchBrowser(WebElement driverElement) {
        super(driverElement);
    }

    @Override
    public boolean isOn() {
        return Boolean.parseBoolean(getDriverElement().getAttribute("aria-checked"));
    }
}
