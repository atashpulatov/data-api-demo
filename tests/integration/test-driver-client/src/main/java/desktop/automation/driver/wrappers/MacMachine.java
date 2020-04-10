package desktop.automation.driver.wrappers;

import desktop.automation.driver.wrappers.enums.DriverType;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.mac.SUT.*;
import desktop.automation.pages.driver.implementation.mac.SUT.prompts.*;
import desktop.automation.pages.driver.implementation.mac.SUT.refresh.popups.ImportingDataSingleRefreshPopUpPageMacMachine;
import desktop.automation.pages.driver.implementation.mac.SUT.refresh.popups.RefreshAllPopUpPageMacMachine;
import desktop.automation.pages.driver.implementation.mac.nonSUT.PreSUTPageMacMachine;
import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

public class MacMachine extends Machine {

    public MacMachine(String host) {
        //TODO pass URL in basetest
        super(host, DriverType.MAC_DESKTOP, 10);

        preSUTPage = new PreSUTPageMacMachine(this);
        loginPage = new LoginPageMacMachine(this);
        mainPage = new MainPageMacMachine(this);
        importPromptPage = new ImportPromptPageMacMachine(this);
        prepareDataPromptPage = new PrepareDataPromptPageMacMachine(this);
        //TODO dataPreviewPage
        //TODO importRefreshProgressPopUp depricated?
        conditionalFormattingPage = new FormattingPageMacMachine(this);
        formatCellsPromptPage = new FormatCellsPromptPageMacMachine(this);
        moreItemMenuPage = new MoreItemMenuPageMacMachine(this);
        moreItemsMenuLinkPage = new MoreItemsMenuLinkPageMacMachine(this);
        importingDataSingleRefreshPopUpPage = new ImportingDataSingleRefreshPopUpPageMacMachine(this);
        refreshAllPopUpPage = new RefreshAllPopUpPageMacMachine(this);
        applicationSelectionPopUpPage = new ApplicationSelectionPopUpPageMacMachine(this);

        standardPromptPage = new StandardPromptPage(this);
        datePromptPage = new DatePromptPageMacMachine(this);
        bigDecimalPromptPage = new BigDecimalPromptPage(this);
        numericPromptPage = new NumericPromptPage(this);
        textValuePromptPage = new TextValuePromptPage(this);
        hierarchyPromptPage = new HierarchyPromptPageMacMachine(this);
        objectPromptPage = new ObjectPromptPageMacMachine(this);
        attributeElementPromptPage = new AttributeElementPromptPage(this);
        hierarchyQualificationPromptPage = new HierarchyQualificationPromptPage(this);
        metricQualificationPromptPage = new MetricQualificationPromptPageMacMachine(this);
        attributeQualificationPromptPage = new AttributeQualificationPromptPageMacMachine(this);
        multiplePrompts = new MultiplePromptsPage(this);
        importDossierPage = new ImportDossierPageMacMachine(this);

    }

    @Override
    protected void initDriver(String host) {
        startAppiumForMacDriver(host);
    }

    public void startAppiumForMacDriver(String host) {
        DesiredCapabilities caps = new DesiredCapabilities();

        caps.setCapability("platformName", "Mac");
        caps.setCapability("deviceName", "Mac");
        caps.setCapability("app", "Root");

        try {
            try {
                driver = new AppiumDriver(new URL(host), caps);
            } catch (org.openqa.selenium.WebDriverException e){
                if (e.getMessage().startsWith("Connection refused")) {
                    try {
                        Runtime.getRuntime().exec("open /Applications/AppiumForMac.app").waitFor();
                        Thread.sleep(3_000);
                        driver = new AppiumDriver(new URL(host), caps);
                    } catch (InterruptedException | IOException e1) {
                        e1.printStackTrace();
                    }
                }
                else
                    e.printStackTrace();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean isButtonEnabled(WebElement button) {
        throw new NotImplementedForDriverWrapperException();
    }

}
