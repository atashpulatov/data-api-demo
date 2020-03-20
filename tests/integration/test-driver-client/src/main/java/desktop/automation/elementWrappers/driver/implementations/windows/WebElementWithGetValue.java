package desktop.automation.elementWrappers.driver.implementations.windows;

import org.openqa.selenium.WebElement;

public class WebElementWithGetValue {
    protected WebElement element;

    public WebElementWithGetValue(WebElement element) {
        this.element = element;
    }

    public WebElement getElement() {
        return element;
    }

    public String getValue(){
        return element.getAttribute("Value.Value");
    }
}
