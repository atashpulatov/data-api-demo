package desktop.automation.elementWrappers.enums;

import org.openqa.selenium.By;

public enum FontValue {
    APPLE_CHANCERY("Apple Chancery"),
    EDWARDIAN_SCRIPT_ITC("Edwardian Script ITC"),

    ARIAL_BLACK("Arial Black", By.cssSelector("#m_excelWebRenderer_ewaCtl_Arial\\ Black-Menu")),
    COURIER_NEW("Courier New", By.cssSelector("#m_excelWebRenderer_ewaCtl_Courier\\ New-Menu"));

    private String inputValue;
    private By browserDropDownSelector;

    FontValue(String inputValue) {
        this.inputValue = inputValue;
    }

    FontValue(String inputValue, By browserDropDownSelector) {
        this.inputValue = inputValue;
        this.browserDropDownSelector = browserDropDownSelector;
    }

    public String getInputValue() {
        return inputValue;
    }

    public By getBrowserDropDownSelector() {
        return browserDropDownSelector;
    }
}
