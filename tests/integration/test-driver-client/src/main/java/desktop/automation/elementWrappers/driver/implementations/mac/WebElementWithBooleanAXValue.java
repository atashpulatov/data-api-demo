package desktop.automation.elementWrappers.driver.implementations.mac;

import org.openqa.selenium.WebElement;

public class WebElementWithBooleanAXValue {
    private WebElement element;

    public WebElementWithBooleanAXValue(WebElement element) {
        this.element = element;
    }

    public boolean isSelected(){
        return element.getAttribute("AXValue").matches("1");
    }

    public WebElement getElement() {
        return element;
    }

    public String getText() {
        return element.getText();
    }

    public void click(){
        element.click();
    }
}
