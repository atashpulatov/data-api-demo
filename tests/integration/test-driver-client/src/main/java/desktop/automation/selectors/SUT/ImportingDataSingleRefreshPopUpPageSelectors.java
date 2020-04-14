package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class ImportingDataSingleRefreshPopUpPageSelectors {
    protected static final By IMPORTING_DATA_TITLE_ELEM;
    protected static final By DIALOG_OPEN_NOTIFICATION;

    static {
        switch (DESIRED_DRIVER_TYPE){
            case BROWSER:
                IMPORTING_DATA_TITLE_ELEM = By.xpath("//dialog[@class='loading-page loading-dialog']/h1[text()[.='Importing data']]");
                DIALOG_OPEN_NOTIFICATION = By.xpath("//span[text()[.='A MicroStrategy for Office Add-in dialog is open']]");
                break;
            case MAC_DESKTOP:
                IMPORTING_DATA_TITLE_ELEM = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[@AXDOMIdentifier='root']/AXHeading[@AXTitle='Importing data']/AXStaticText[@AXValue='Importing data']");
                DIALOG_OPEN_NOTIFICATION = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:16' and @AXSubrole='AXStandardWindow']/AXSplitGroup[0]/AXGroup/AXGroup[0]/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup/AXGroup[1]/AXStaticText[@AXValue='A MicroStrategy for Office Add-in dialog is open']");
                break;
            case WINDOWS_DESKTOP:
                IMPORTING_DATA_TITLE_ELEM = null;
                DIALOG_OPEN_NOTIFICATION = null;
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
