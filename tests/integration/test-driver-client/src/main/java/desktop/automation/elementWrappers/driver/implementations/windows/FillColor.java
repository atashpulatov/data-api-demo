package desktop.automation.elementWrappers.driver.implementations.windows;

public enum FillColor {
    ORANGE("Orange", 6),
    LIGHT_ORANGE("RGB(255, 217, 102)", 8);

    private String windowsName;
    private int macIndex;

    FillColor(String windowsName, int macIndex) {
        this.windowsName = windowsName;
        this.macIndex = macIndex;
    }

    public String getWindowsName() {
        return windowsName;
    }

    public int getMacIndex() {
        return macIndex;
    }
}
