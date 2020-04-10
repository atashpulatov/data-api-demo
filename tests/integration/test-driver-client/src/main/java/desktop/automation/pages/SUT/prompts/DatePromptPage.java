package desktop.automation.pages.SUT.prompts;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.pages.SUT.prompts.bases.BasePromptPage;
import org.openqa.selenium.WebElement;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public abstract class DatePromptPage extends BasePromptPage {
    private static SimpleDateFormat format = new SimpleDateFormat("M/d/YYYY");

    public DatePromptPage(Machine machine) {
        super(machine);
    }

    @Override
    public void answerPromptCorrectly() {
        WebElement runBtn = machine.getDatePromptPage().getRunBtnElem();

        machine.getDatePromptPage().getDateInputElemAndInputDate(2015, 1, 1);

        runBtn.click();
    }

    public WebElement getDateInputElemAndInputDate(int year, int month, int day){
        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, day);
        Date date = cal.getTime();

        String input = format.format(date);

        WebElement res = getDateInputElem();
        res.clear();
        res.sendKeys(input);

        return res;
    }

    protected abstract List<WebElement> getTimeEditElems();

    public void inputTime(int hour, int minute, int second){
        machine.focusOnPromptPopUpFrameForBrowser();
        List<WebElement> timeEditElems = getTimeEditElems();

        timeEditElems.get(0).click();
        timeEditElems.get(0).clear();
        timeEditElems.get(0).sendKeys(hour + "");

        timeEditElems.get(1).click();
        timeEditElems.get(1).clear();
        timeEditElems.get(1).sendKeys(minute + "");

        timeEditElems.get(2).click();
        timeEditElems.get(2).clear();
        timeEditElems.get(2).sendKeys(second + "");
    }

    public WebElement getDateInputElem(){
        machine.focusOnPromptPopUpFrameForBrowser();
        return machine.waitAndFind(DATE_PROMPT_DATE_INPUT);
    }
}
