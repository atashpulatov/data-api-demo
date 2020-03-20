package desktop.automation.driver.wrappers;

import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.pages.SUT.DataPreviewPage;
import desktop.automation.pages.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.windows.SUT.*;
import desktop.automation.pages.driver.implementation.windows.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.windows.SUT.refresh.popups.ImportingDataSingleRefreshPopUpPageWindowsMachine;
import desktop.automation.pages.driver.implementation.windows.SUT.refresh.popups.RefreshAllPopUpPageWindowsMachine;
import desktop.automation.pages.driver.implementation.windows.nonSUT.PreSUTPageWindowsMachine;
import io.appium.java_client.windows.WindowsDriver;
import junit.framework.AssertionFailedError;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.URL;

import static desktop.automation.ConfigVars.SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN;
import static junit.framework.TestCase.assertTrue;

public class WindowsMachine extends Machine {
    public Actions actions;
    //extend folder to 1)Windows, 2)Mac desktop, 3) browser

    public WindowsMachine(String host) {
        super(host, DriverType.WINDOWS_DESKTOP, 30);

        preSUTPage = new PreSUTPageWindowsMachine(this);
        loginPage = new LoginPageWindowsMachine(this);
        mainPage = new MainPageWindowsMachine(this);
        importPromptPage = new ImportPromptPageWindowsMachine(this);
        prepareDataPromptPage = new PrepareDataPromptPageWindowsMachine(this);
        dataPreviewPage = new DataPreviewPage(this);
        conditionalFormattingPage = new FormattingPageWindowsMachine(this);
        formatCellsPromptPage = new FormatCellsPromptPageWindowsMachine(this);
        moreItemMenuPage = new MoreItemMenuPageWindowsMachine(this);
        moreItemsMenuLinkPage = new MoreItemsMenuLinkPageWindowsMachine(this);
        importingDataSingleRefreshPopUpPage = new ImportingDataSingleRefreshPopUpPageWindowsMachine(this);
        refreshAllPopUpPage = new RefreshAllPopUpPageWindowsMachine(this);
        applicationSelectionPopUpPage = new ApplicationSelectionPopUpPageWindowsMachine(this);

        standardPromptPage = new StandardPromptPage(this);
        datePromptPage = new DatePromptPageWindowsMachine(this);
        bigDecimalPromptPage = new BigDecimalPromptPage(this);
        numericPromptPage = new NumericPromptPage(this);
        textValuePromptPage = new TextValuePromptPage(this);
        hierarchyPromptPage = new HierarchyPromptPageWindowsMachine(this);
        objectPromptPage = new ObjectPromptPageWindowsMachine(this);
        attributeElementPromptPage = new AttributeElementPromptPage(this);
        hierarchyQualificationPromptPage = new HierarchyQualificationPromptPage(this);
        metricQualificationPromptPage = new MetricQualificationPromptPageWindowsMachine(this);
        attributeQualificationPromptPage = new AttributeQualificationPromptPageWindowsMachine(this);
        multiplePrompts = new MultiplePromptsPage(this);
        importDossierPage = new ImportDossierPageWindowsMachine(this);

    }

    @Override
    protected void initDriver(String remoteAddress) {
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability("app", "Root");
        capabilities.setCapability("newCommandTimeout", 360);

        for (int i = 0; i < 10; i++) {
            System.out.println("Initializing driver. Attempt: " + i);
            try {
                URL url = new URL(remoteAddress);

                driver = new WindowsDriver(url, capabilities);
                actions = new Actions(driver);

                Thread.sleep(5000);
                ((WindowsDriver)driver).launchApp();

                if (!SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN) {
                    String expectedAppTitleToContain = "Desktop 1";
                    String assertionMessage = String.format("application tile does not match.\nActual:%s\nExpected:%s\n", driver.getTitle(), expectedAppTitleToContain);
                    assertTrue(assertionMessage, driver.getTitle().contains(expectedAppTitleToContain));

                    System.out.println("Initialized");
                }
                break;
            } catch (Exception | AssertionFailedError e) {
                e.printStackTrace();
            }
        }
    }


    public boolean isButtonEnabled(WebElement button) {
        String res = button.getAttribute("IsEnabled").trim();
        return "True".matches(res);
    }

    public int getGridIndex(WebElement element) {
        return Integer.parseInt(element.getAttribute("GridItem.Row"));
    }

}
