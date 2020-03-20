package desktop.automation.driver.wrappers.enums;

public enum OS {
    WINDOWS,
    MAC;

    public static OS getOSType(){
        String os = System.getProperty("os.name");
        if (os.startsWith("Mac"))
            return MAC;
        else if (os.startsWith("Windows"))
            return WINDOWS;
        else
            throw new RuntimeException("Unrecognized OS");
    }
}
