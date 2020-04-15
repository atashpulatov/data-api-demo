package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class MoreItemsMenuLinkPageSelectors {
    protected static final By TASK_BAR_CLOSE_ELEM;
    protected static final By TASK_BAR_ELEM;

    static {
        switch (DESIRED_DRIVER_TYPE) {
            case MAC_DESKTOP:
                TASK_BAR_CLOSE_ELEM = By.xpath("/AXApplication[@AXTitle='Dock']/AXList[0]/AXDockItem/AXMenu[0]/AXMenuItem[@AXTitle='Quit']");
                TASK_BAR_ELEM = By.xpath("/AXApplication[@AXTitle='Dock']/AXList[0]/AXDockItem[@AXTitle='Firefox' and @AXSubrole='AXApplicationDockItem']");
            break;
            case WINDOWS_DESKTOP:
                TASK_BAR_CLOSE_ELEM = MobileBy.AccessibilityId("Close");
                TASK_BAR_ELEM = By.name("Google Chrome - 1 running window");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
