package desktop.automation.test.infrastructure;

import desktop.automation.ConfigVars;
import desktop.automation.driver.wrappers.Browser;
import desktop.automation.driver.wrappers.MacMachine;
import desktop.automation.driver.wrappers.Machine;
import desktop.automation.driver.wrappers.WindowsMachine;
import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public abstract class BaseTests {

    private static Browser getBrowser() {
        String host  = "https://www.office.com/launch/excel";
        Browser res = new Browser(host);

        //TODO ImageComparisonElem.setMachine(res);
        WebDriverElemWrapper.setMachine(res);

        return res;
    }


    private static MacMachine getMacMachine() {
        String host = "localhost";
        String MacApplicationDriverUrl = String.format("http://%s:4622/wd/hub", host);

        MacMachine res = new MacMachine(MacApplicationDriverUrl);
        ImageComparisonElem.setMachine(res);
        WebDriverElemWrapper.setMachine(res);

        return res;
    }

    private static WindowsMachine getWindowsMachine(){
        String host = ConfigVars.WINDOWS_HOST;
        String WindowsApplicationDriverUrl = String.format("http://%s:6007/wd/hub", host);

        WindowsMachine res = new WindowsMachine(WindowsApplicationDriverUrl);
        ImageComparisonElem.setMachine(res);
        WebDriverElemWrapper.setMachine(res);
        return res;
    }

    protected static Machine getMachine(){
        return getMachine(DESIRED_DRIVER_TYPE);
    }

    private static Machine getMachine(DriverType driverType){
        switch (driverType){
            case BROWSER:
                return getBrowser();
            case MAC_DESKTOP:
                return getMacMachine();
            case WINDOWS_DESKTOP:
                return getWindowsMachine();
            default:
                throw new RuntimeException("Unimplemented driver requested, driver type: " + driverType);
        }
    }
}
