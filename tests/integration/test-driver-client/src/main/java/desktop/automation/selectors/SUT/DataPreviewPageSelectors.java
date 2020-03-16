package desktop.automation.selectors.SUT;

import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.openqa.selenium.By;

import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;

public class DataPreviewPageSelectors {
    protected static final By TITLE;
    protected static final By ROW_ELEM;
    protected static final By ONLY_TEN_ROWS_DISPLAYED_WARNING;
    protected static final By CLOSE_PREVIEW_BTN;

    static {
        switch (DESIRED_DRIVER_TYPE){
            case WINDOWS_DESKTOP:
                TITLE = By.xpath("//Text[@Name=\"Data Preview\"]");
                ROW_ELEM = By.xpath("//Document//DataItem");
                ONLY_TEN_ROWS_DISPLAYED_WARNING = By.name("Data preview displays 10 rows of data only.");
                CLOSE_PREVIEW_BTN = By.xpath("//Button[@Name=\"Close Preview\"]");
                break;
            default:
                throw NotImplementedForDriverWrapperException.getNotImplementedSelectorException();
        }
    }
}
