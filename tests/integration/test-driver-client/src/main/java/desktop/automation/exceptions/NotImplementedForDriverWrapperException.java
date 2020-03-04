package desktop.automation.exceptions;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class NotImplementedForDriverWrapperException extends RuntimeException {
    public NotImplementedForDriverWrapperException() {
    }

    public NotImplementedForDriverWrapperException(String message) {
        super(message);
    }

    public static NotImplementedForDriverWrapperException getNotImplementedSelectorException(){
        return new NotImplementedForDriverWrapperException("Selectors for requested driver not initialized for page, driver type: " + DESIRED_DRIVER_TYPE);
    }
}
