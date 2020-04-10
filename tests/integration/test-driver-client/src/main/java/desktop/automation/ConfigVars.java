package desktop.automation;

import desktop.automation.driver.wrappers.enums.BrowserType;
import desktop.automation.driver.wrappers.enums.DriverType;

public class ConfigVars {
    //driver selection
    private static final String DRIVER_TYPE_SYSTEM_PROPERTY = System.getProperty("driverType");
    public static final DriverType DESIRED_DRIVER_TYPE = DRIVER_TYPE_SYSTEM_PROPERTY != null ? DriverType.valueOf(DRIVER_TYPE_SYSTEM_PROPERTY) :
            DriverType.BROWSER;

    //universal
    public static final boolean SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN = false;
    //enabling image debugging stores cropped images during runtime, be careful as not to overflow the memory, decrease the performance and pollute the git commits
    public static final boolean DEBUG_IMAGE_COMPARISON = false;
    public static final String EXCEL_ADD_IN_TEST_USER_NAME = "a";
    public static final String EXCEL_ADD_IN_TEST_USER_PASS = null;
    public static final String EXCEL_ADD_IN_TEST_USER_INITIALS = "A";

    //Browser specific
    private static final String BROWSER_TYPE_SYSTEM_PROPERTY = System.getProperty("browserType");
    public static final BrowserType DESIRED_BROWSER_TYPE = BROWSER_TYPE_SYSTEM_PROPERTY != null ? BrowserType.valueOf(BROWSER_TYPE_SYSTEM_PROPERTY) :
            BrowserType.CHROME;

    public static final String EXCEL_USER_NAME = "testing.universal@mstrtesting.onmicrosoft.com";
    public static final String EXCEL_USER_PASS = "somePassword1";
    public static final boolean MINIMIZE_WINDOW_AFTER_TEST_CASE = true;
    public static final String EXCEL_ADD_IN_NAME_IN_HOME_TAB_BROWSER = "env-182059";

    //Mac desktop specific
    public static final String EXCEL_ADD_IN_NAME_IN_HOME_TAB_MAC_DESKTOP = "yi_local_ip";

    //Windows desktop specific
    public static final String WINDOWS_HOST = "localhost";
    public static final boolean UTILIZE_INDEX_IMAGE_BASED_PREPARE_DATA_HELPER = true;
    public static final boolean RECORD_TEST_CASE = false;
    public static final String EXCEL_ADD_IN_NAME_IN_HOME_TAB_WINDOWS_DESKTOP = "yi_local_ip";
}
