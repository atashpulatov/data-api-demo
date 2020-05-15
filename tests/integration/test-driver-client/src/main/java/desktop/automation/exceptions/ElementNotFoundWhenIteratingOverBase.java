package desktop.automation.exceptions;

public class ElementNotFoundWhenIteratingOverBase extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Failed to find element when iterating over base.";

    public ElementNotFoundWhenIteratingOverBase() {
        super(DEFAULT_MESSAGE);
    }

    public ElementNotFoundWhenIteratingOverBase(String message) {
        super(message);
    }
}
