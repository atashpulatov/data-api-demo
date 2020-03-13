package desktop.automation.elementWrappers.windows;

import org.openqa.selenium.WebElement;

public class WebElementWithAriaProperties {
    WebElement element;

    public WebElementWithAriaProperties(WebElement element) {
        this.element = element;
    }

    public WebElement getElement() {
        return element;
    }

    private String getAriaProperties(){
        return element.getAttribute("AriaProperties");
    }

    public boolean isChecked(){
        //structure is "checked=true;label..."
        String raw = getAriaProperties();
        String resStr = raw.split(";")[0].split("=")[1];

        if (resStr.equals("true"))
            return true;
        else if (resStr.equals("false"))
            return false;
        else
            throw new RuntimeException(String.format("Parsed AriaProperties did not match expected values. Raw: %s, parsed: %s", raw, resStr));
    }
}

