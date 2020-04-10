package desktop.automation.elementWrappers.driver.implementations.windows;

import org.openqa.selenium.WebElement;

public class FormatValue {
    private WebElement element;

    public FormatValue(WebElement element) {
        this.element = element;
    }

    public WebElement getElement() {
        return element;
    }

    public boolean isSelected(){
        String attr = element.getAttribute("LegacyState");

        return attr.matches("1048708|128");
    }
}
