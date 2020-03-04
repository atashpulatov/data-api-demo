package desktop.automation.elementWrappers;

public interface AnyInterfaceElement {
    void click();
    void clickExplicitlyByActionClass();
    void sendKeys(CharSequence... input);
    void clear();
    String getText();
}
