package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.DriverType;
import desktop.automation.elementWrappers.browser.MyLibrarySwitchBrowser;
import desktop.automation.elementWrappers.mac.MyLibrarySwitchMacMachine;
import desktop.automation.elementWrappers.windows.MyLibrarySwitchWindowsMachine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.WebElement;

public abstract class MyLibrarySwitch extends WebDriverElemWrapper{

    protected MyLibrarySwitch(WebElement driverElement) {
        super(driverElement);
    }

    public abstract boolean isOn();

    public static MyLibrarySwitch getSwitch(WebElement element, DriverType driverType){
        switch (driverType){
            case BROWSER:
                return new MyLibrarySwitchBrowser(element);
            case MAC_DESKTOP:
                return new MyLibrarySwitchMacMachine(element);
            case WINDOWS_DESKTOP:
                return new MyLibrarySwitchWindowsMachine(element);
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }
}
