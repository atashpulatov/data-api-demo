package desktop.automation.functional.not.maintained.nonfunctional;

import com.google.gson.GsonBuilder;
import desktop.automation.elementWrappers.AnyInterfaceElement;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.exceptions.ImageBasedElemNotFound;
import desktop.automation.helpers.BenchmarkResultFormat;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseCommonTests;
import io.appium.java_client.windows.WindowsDriver;
import org.junit.Test;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import java.io.IOException;

public class ImportBenchmark extends BaseCommonTests {
    String benchmarkingLoginAndBasicImportScreenshotFolder = "benchmarking/loginAndBasicImport/";

    //test to get/update screenshots and run benchmark 3 times
    @Test
    public void testInitializeScreenshotsAndRunBenchmarkMultipleTimesLoginAndImportBasicReport() throws IOException {
        //initialize screenshots
        System.out.println("Initializing benchmark screenshots");

        importReportAndGetElementSreenshots();
        //reset
        resetLoginAndImportReportTestCase();

        //Execute benchmarking
        double[] runResSum = {0, 0};
        int resCount = 3;
        for (int i = 0; i < resCount; i++) {
            System.out.println("Benchmark run: " + i);

            double[] tmpRes = loginAndImportReportBasedOnImageRecognition();
            runResSum[0] += tmpRes[0];
            runResSum[1] += tmpRes[1];

            //reset
            resetLoginAndImportReportTestCase();
        }

        double[] runAvg = {runResSum[0] / resCount, runResSum[1] / resCount};
        System.out.println(getJSONResults(runAvg[0], runAvg[1]));
    }

    //test to get the screenshots
    public void importReportAndGetElementSreenshots() throws IOException {
        String report = ImportPrepareDataHelperArgumments.DEFAULT_REPORT;

        //startLoginBtnElem
        clickAndTakeScreenshot(machine.getLoginPage().getStartLoginBtnWebDriverElem(), "startLoginBtnElem");

        //usernameInputElem
        WebElement usernameInputElem = machine.getLoginPage().getUserNameInputElemWebElement().getDriverElement();
        machine.takeElementScreenshotWithDetails(usernameInputElem, benchmarkingLoginAndBasicImportScreenshotFolder + "usernameInputElem");
        usernameInputElem.sendKeys("a");

        //loginBtnElem
        clickAndTakeScreenshot(machine.getLoginPage().getLoginBtnElemWebdriverElem().getDriverElement(), "loginBtnElem");

        //importDataBtn
//        clickAndTakeScreenshot(machine.getMainPage().getImportDataBtnElem(), "importDataBtn");

        //searchBarElem
//        WebElement searchBarElem = machine.getImportPromptPage().getSearchBarElem();
//        machine.takeElementScreenshotWithDetails(searchBarElem, benchmarkingLoginAndBasicImportScreenshotFolder + "searchBarElem");
//        WebElement searchBarWithInputElem = machine.getImportPromptPage().getSearchBarElemAndSendKeys(report);

        //searchBarWithInputElem
//        machine.takeElementScreenshotWithDetails(searchBarWithInputElem, benchmarkingLoginAndBasicImportScreenshotFolder + "searchBarWithInputElem");

        //objectToImportInList_1kReport_Elem
        //TODO requires getObjectToImportNameCellElem()
//        clickAndTakeScreenshot(machine.getImportPromptPage().getObjectToImportNameCellElem(report), "objectToImportInList_1kReport_Elem");

        //importPromptImportBtnElem
//        clickAndTakeScreenshot(machine.getImportPromptPage().getImportBtnElem(), "importPromptImportBtnElem");

        //importedObjectInList_1kReport_Elem
        WebDriverElemWrapper importedObjectInList_1kReport_Elem = machine.getMainPage().getImportedObjectInListNameElem(report);
        machine.takeElementScreenshotWithDetails(importedObjectInList_1kReport_Elem.getDriverElement(), benchmarkingLoginAndBasicImportScreenshotFolder + "importedObjectInList_1kReport_Elem");
    }

    public double[] loginAndImportReportBasedOnImageRecognition(){
        String report = ImportPrepareDataHelperArgumments.DEFAULT_REPORT;

        //preload the images for faster element location
        ImageComparisonElem startLoginBtnElem = initializeImageComparisonElemForLoginAndReportTest("startLoginBtnElem");
        ImageComparisonElem usernameInputElem = initializeImageComparisonElemForLoginAndReportTest("usernameInputElem");
        ImageComparisonElem loginBtnElem = initializeImageComparisonElemForLoginAndReportTest("loginBtnElem");
        ImageComparisonElem importDataBtn = initializeImageComparisonElemForLoginAndReportTest("importDataBtn");
        ImageComparisonElem searchBarElem = initializeImageComparisonElemForLoginAndReportTest("searchBarElem");
        ImageComparisonElem searchBarWithInputElem = initializeImageComparisonElemForLoginAndReportTest("searchBarWithInputElem");
        ImageComparisonElem objectToImportInList_1kReport_Elem = initializeImageComparisonElemForLoginAndReportTest("objectToImportInList_1kReport_Elem");
        ImageComparisonElem importPromptImportBtnElem = initializeImageComparisonElemForLoginAndReportTest("importPromptImportBtnElem");
        ImageComparisonElem importedObjectInList_1kReport_Elem = initializeImageComparisonElemForLoginAndReportTest("importedObjectInList_1kReport_Elem");

        int totalActionsFromLoginToImportBtn = 0;
        int totalActionsFromImportBtnToImport = 0;

        //test
        long startFromLogInBtn = System.currentTimeMillis();
        startLoginBtnElem.waitAndFind(1550, 1850, 650, 750);
        long tmp = System.currentTimeMillis();
        startLoginBtnElem.click();
        totalActionsFromLoginToImportBtn += System.currentTimeMillis() - tmp;

        usernameInputElem.waitAndFind(780, 1150, 470, 540);
        tmp = System.currentTimeMillis();
        usernameInputElem.click();
        ((WindowsDriver) machine.driver).getKeyboard().sendKeys("a");
        totalActionsFromLoginToImportBtn += System.currentTimeMillis() - tmp;

        loginBtnElem.waitAndFind(780, 1150, 670, 750);
        tmp = System.currentTimeMillis();
        loginBtnElem.click();
        totalActionsFromLoginToImportBtn += System.currentTimeMillis() - tmp;

        importDataBtn.waitAndFind(1620,  1780, 850, 920);
        tmp = System.currentTimeMillis();
        importDataBtn.click();
        totalActionsFromLoginToImportBtn += System.currentTimeMillis() - tmp;

        searchBarElem.waitAndFind(1450, 1720, 130, 190);
        tmp = System.currentTimeMillis();

        searchBarElem.click();
        //1
//        machine.driver.getKeyboard()
//                .sendKeys(report);
        //2
        machine.actions
                .sendKeys(report)
                .perform();

        //both methods are unstable work around below
        reInputUntilCorrect(report);

        totalActionsFromLoginToImportBtn += System.currentTimeMillis() - tmp;

        //find "1k report" reprot in the "Import" pop-up to select for importing
        objectToImportInList_1kReport_Elem.waitAndFind(310, 690, 250, 500);
        tmp = System.currentTimeMillis();
        objectToImportInList_1kReport_Elem.click();
        totalActionsFromLoginToImportBtn += System.currentTimeMillis() - tmp;

        long startFromImportBtn = System.currentTimeMillis();
        importPromptImportBtnElem.waitAndFind(1280, 1420,  860,  940);
        tmp = System.currentTimeMillis();
        importPromptImportBtnElem.click();
        totalActionsFromImportBtnToImport += System.currentTimeMillis() - tmp;

        importedObjectInList_1kReport_Elem.waitAndFind(1560, 1720, 525, 610, 30_000);
        long end = System.currentTimeMillis();

        //measurements
        //measure
        int totalFromLoginMillis = (int)(end - startFromLogInBtn);
        int totalFromImportBtnMillis = (int)(end - startFromImportBtn);

        int withoutActionsFromLoginMillis = totalFromLoginMillis - totalActionsFromLoginToImportBtn - totalActionsFromImportBtnToImport;
        int withoutActionsFromImportBtnMillis = totalFromImportBtnMillis - totalActionsFromImportBtnToImport;

        //print
        System.out.println("Total:");
        System.out.format("From login: %20s\n", millisToSecStr(totalFromLoginMillis));
        System.out.format("From import:%20s\n", millisToSecStr(totalFromImportBtnMillis));

        System.out.println("Without time spent on driver element interactions:");
        System.out.format("From login: %20s\n", millisToSecStr(withoutActionsFromLoginMillis));
        System.out.format("From import:%20s\n", millisToSecStr(withoutActionsFromImportBtnMillis));

        return new double[]{withoutActionsFromImportBtnMillis, withoutActionsFromLoginMillis};
    }

    private String getJSONResults(double withoutActionsFromImportBtnMillis, double withoutActionsFromLoginMillis){
        BenchmarkResultFormat results = new BenchmarkResultFormat();
        results.setServerVersion("11.2.0000.2192");
        results.setPluginVersion("11.2.0000.22007");
        results.setClientOS("Windows 10");
        results.setClientCPUCores(9999);
        results.setBrowser("Desktop");
        results.setRows(999999999);
        results.setColumns(9999999);
        results.setImportingTime((double)withoutActionsFromImportBtnMillis / 1000);
        results.setNumberOfExecutions(3);
        results.setE2EDurationTime((double)withoutActionsFromLoginMillis / 1000);
        results.setNumberOfClicks(99999);
        results.setCPU_Usage(999999);
        results.setMemory_Usage(999999);

        return new GsonBuilder().create().toJson(results);
    }

    private void reInputUntilCorrect(String report) {
        machine.actions
                .moveByOffset(0, 200)
                .perform();

        ImageComparisonElem searchBarWithInputElem = initializeImageComparisonElemForLoginAndReportTest("searchBarWithInputElem");
        for (int i = 0; i < 10; i++) {
            try {
                searchBarWithInputElem.find(1450, 1720, 130, 190);
                break;
            } catch (ImageBasedElemNotFound e) {
                machine.actions
                        .sendKeys(Keys.chord(Keys.CONTROL, "a"))
                        .sendKeys(report)
                        .perform();
            }
        }
    }

    private String millisToSecStr(long millis) {
        String millisRemainder = String.format("%3d", millis % 1000).replace(' ', '0');
        return millis / 1000 + "," + millisRemainder;
    }

    //method to reset login and basic import test. That is remove the imported object and log out
    private void resetLoginAndImportReportTestCase(){
        machine.getMainPage().getImportedObjectsInList().get(0).getDeleteBtnElem().click();

        AnyInterfaceElement moreItemsMenuElem = machine.getMainPage().getMoreItemsMenuElem();
        moreItemsMenuElem.click();
        machine.getMoreItemMenuPage().getLogOutBtnElem().click();
    }

    private ImageComparisonElem initializeImageComparisonElemForLoginAndReportTest(String screenshotName){
        return ImageComparisonElem.getImageComparisonElemWithoutElementSearch(benchmarkingLoginAndBasicImportScreenshotFolder + screenshotName);
    }

    private void clickAndTakeScreenshot(WebElement element, String elementName) throws IOException {
        machine.takeElementScreenshotWithDetails(element, benchmarkingLoginAndBasicImportScreenshotFolder + elementName);
        element.click();
    }

    private void clickAndTakeScreenshot(WebDriverElemWrapper element, String elementName) throws IOException {
        machine.takeElementScreenshotWithDetails(element.getDriverElement(), benchmarkingLoginAndBasicImportScreenshotFolder + elementName);
        element.click();
    }
}
