package desktop.automation.helpers.windows;

import desktop.automation.driver.wrappers.Machine;
import io.appium.java_client.MobileBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import java.util.Date;
import java.util.List;

public class PowerPoint {
    private Machine machine;
    private long start;
    private static final String PATH_TO_POWERPOINT_RECORDINGS = "C:\\Users\\dtamosiunas\\Documents\\";

    public PowerPoint(Machine machine) {
        this.machine = this.machine;
    }

    public WebElement getPowerPointTaskBarElem(){
        return machine.waitAndFind(By.name("PowerPoint"));
    }

    public WebElement getBlankPresentationElem(){
        return machine.waitAndFind(By.name("Blank Presentation"));
    }

    public WebElement getInsertTabElem(){
        return machine.waitAndFind(By.name("Insert"));
    }

    public WebElement getScreenRecordingElem(){
        return machine.waitAndFind(By.name("Screen Recording..."));
    }

    public WebElement getStartMenuElem(){
        return machine.waitAndFind(By.name("Start"));
    }

    public WebElement getDesktopElem(){
        return machine.waitAndFind(By.name("Desktop 1"));
    }

    public WebElement getRecordBtnElem(){
        return machine.waitAndFind(By.name("Record"));
    }

    public WebElement getStopRecordingBtnElem() {
        return machine.waitAndFind(By.xpath("//*[@HelpText=\"Stop (Windows logo key+Shift+Q)\"]"), machine.TWO_UNITS);
    }

    public void selectAllScreenForVideoRecording(){
        WebElement desktop = getDesktopElem();

        WebElement startMenuElem = getStartMenuElem();
        getScreenRecordingElem().click();

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Actions actions = new Actions(machine.driver);
        actions.clickAndHold(startMenuElem)
                .pause(5000)
                .moveToElement(startMenuElem, desktop.getSize().getWidth(), - desktop.getSize().getHeight())
                .release()
                .perform();

        getRecordBtnElem().click();
        start = System.currentTimeMillis();
    }

    public void startRecording(){
        getPowerPointTaskBarElem().click();
        getBlankPresentationElem().click();
        getInsertTabElem().click();
        selectAllScreenForVideoRecording();
    }

    public void stopRecording(){
        WebElement desktop = getDesktopElem();

        Actions actions = new Actions(machine.driver);
        actions.moveToElement(desktop, 0, -desktop.getSize().getHeight() / 2)
                .perform();

        getStopRecordingBtnElem().click();

        machine.contextClickElem(getRecordingInPowerPointElem());
        getSaveMediaAsMenuItemElem().click();

        String recordingName = new Date(start).toInstant().toString();
        recordingName = recordingName.replace(":", "-");
        recordingName = PATH_TO_POWERPOINT_RECORDINGS + recordingName;
        System.out.println("recordingName = " + recordingName);

        WebElement input = getMediaNameInputElem();
        input.clear();
        input.sendKeys(recordingName + "");

        getMediaSaveBtnElem().click();

        getCloseBtnElem().click();
        getDontSaveBtnElem().click();
    }

    public WebElement getRecordingInPowerPointElem(){
        return machine.waitAndFind(MobileBy.AccessibilityId("1071"));
    }

    public WebElement getSaveMediaAsMenuItemElem(){
        return machine.waitAndFind(By.name("Save Media as..."));
    }

    public WebElement getMediaNameInputElem(){
        try {
            Thread.sleep(3_000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        By selector = By.name("File name:");
        List<WebElement> elems = machine.driver.findElements(selector);

        return elems.get(1);
    }

    public WebElement getMediaSaveBtnElem(){
        return machine.waitAndFind(MobileBy.name("Save"));
    }

    public WebElement getCloseBtnElem(){
        return machine.waitAndFind(By.name("Close"));
    }

    public WebElement getDontSaveBtnElem(){
        return machine.waitAndFind(By.name("Don't Save"));
    }
}
