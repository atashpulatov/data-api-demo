package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.elementWrappers.driver.implementations.browser.MyLibrarySwitchBrowser;
import desktop.automation.elementWrappers.driver.implementations.mac.MyLibrarySwitchMacMachine;
import desktop.automation.elementWrappers.driver.implementations.windows.MyLibrarySwitchWindowsMachine;
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
