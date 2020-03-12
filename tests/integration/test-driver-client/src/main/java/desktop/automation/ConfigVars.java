package desktop.automation;

import desktop.automation.driver.wrappers.DriverType;

public class ConfigVars {
    public static final boolean SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN = false;
    //enabling image debugging stores cropped images during runtime, be careful as not to overflow the memory, decrease the performance and pollute the git commits
    public static final boolean DEBUG_IMAGE_COMPARISON = false;
    public static final String EXCEL_ADD_IN_TEST_USER_NAME = "a";
    public static final String EXCEL_ADD_IN_TEST_USER_PASS = null;
    public static final String EXCEL_ADD_IN_NAME_IN_HOME_TAB =
            // "Import Data"
//            "env-182059"
            "yi_local_ip"
            ;

    //hosts and host selection
    public static final DriverType DESIRED_DRIVER_TYPE = DriverType.MAC_DESKTOP;
    public static final String WINDOWS_REMOTE_HOST = "localhost";

    //Windows specific
    public static final boolean UTILIZE_INDEX_IMAGE_BASED_PREPARE_DATA_HELPER = false;
    public static final boolean RECORD_TEST_CASE = false;

    //Browser sepcific
    public static final boolean MINIMIZE_WINDOW_AFTER_TEST_CASE = true;
}
