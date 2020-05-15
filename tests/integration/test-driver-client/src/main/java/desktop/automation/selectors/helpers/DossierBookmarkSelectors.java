package desktop.automation.selectors.helpers;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class DossierBookmarkSelectors {
    //no shared selectors currently, but keeping the selector encapsulation option available
    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                break;
            case MAC_DESKTOP:
                break;
            case WINDOWS_DESKTOP:
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
