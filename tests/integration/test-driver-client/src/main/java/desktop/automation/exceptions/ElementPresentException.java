package desktop.automation.exceptions;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ElementPresentException extends RuntimeException{

    private ElementPresentException(String message) {
        super(message);
    }

    public static ElementPresentException getElementPresentException(By expected, WebElement actual) {
        String generic = String.format("Expected element with selector: %s\nnot to be present. Found: %s\n", expected, actual);

        return new ElementPresentException(generic);
    }
}
