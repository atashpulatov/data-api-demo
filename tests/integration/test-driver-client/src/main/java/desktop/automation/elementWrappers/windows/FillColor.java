package desktop.automation.elementWrappers.windows;

public enum FillColor {
    //TODO confirm map between Windows and Mac
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
