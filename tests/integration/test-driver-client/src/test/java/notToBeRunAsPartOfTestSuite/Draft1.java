package notToBeRunAsPartOfTestSuite;

import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.helpers.FilterAndValuesIndexBased;
import desktop.automation.helpers.ImportPrepareDataHelper;
import desktop.automation.helpers.ImportPrepareDataHelperArgumments;
import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class Draft1 extends BaseLoggedInTests {
    
    @Test
    public void test(){
        List<ImportedObjectInList> importedObjectsInList = machine.getMainPage().getImportedObjectsInList();
        System.out.println("importedObjectsInList.size() = " + importedObjectsInList.size());
        for (ImportedObjectInList importedObjectInList : importedObjectsInList) {
            System.out.println("importedObjectInList.getName() = " + importedObjectInList.getName());
        }
    }

    @Test
    public void test1(){
        machine.getImportPromptPage().getSearchBarElemAndSendKeys("test");
    }

    @Test
    public void testDataset() {
        String object = "5k Sales Records.csv";

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{-1, 0});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1, 0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine, true)
                .withObjectName(object)
                .withAttributes(new int[]{-1, 0})
                .withMetrics(new int[]{-1, 0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1, filterAndValues2})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(object);
    }

    @Test
    public void testReportWithoutCrosstab() {
        String report = "1k report";

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{-1, 0});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1, 0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{-1, 0})
                .withMetrics(new int[]{-1, 0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1, filterAndValues2})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(report);
    }

    @Test
    public void testReportWithCrosstab() {
        String report = "Report with crosstab 123";

        FilterAndValuesIndexBased filterAndValues1 = new FilterAndValuesIndexBased(0, new int[]{-1, 0});
        FilterAndValuesIndexBased filterAndValues2 = new FilterAndValuesIndexBased(1, new int[]{-1, 0});
        ImportPrepareDataHelperArgumments argumments = new ImportPrepareDataHelperArgumments.Builder(machine)
                .withObjectName(report)
                .withAttributes(new int[]{-1, 0})
                .withMetrics(new int[]{-1, 0})
                .withFiltersAndValues(new FilterAndValuesIndexBased[]{filterAndValues1, filterAndValues2})
                .isFirstImport(true)
                .build();
        ImportPrepareDataHelper.importWithPrepareDataSimple(argumments);

        machine.getMainPage().getImportedObjectsInList().get(0).assertNameIsAsExpected(report);
    }




    @Test
    public void test3() throws InterruptedException {
        Thread.sleep(3000);
        //"/AXApplication[@AXTitle='Excel']/AXWindow[@AXTitle='Office Add-ins - env-182059.customer.cloud.microstrategy.com' and @AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXGroup"
        //"/AXApplication[@AXTitle='Excel']/AXWindow[@AXTitle='Office Add-ins - env-182059.customer.cloud.microstrategy.com' and @AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXGroup"
        //"/AXApplication[@AXTitle='Excel']/AXWindow[@AXTitle='Office Add-ins - env-182059.customer.cloud.microstrategy.com' and @AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXUnknown[0]/AXGroup[0]/AXGroup[0]"
        By t = By.xpath(
//                "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Office Add-ins - env-182059.customer.cloud.microstrategy.com' and @AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXGroup[6]/AXGroup[0]/AXCheckBox[0]"
                "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Office Add-ins - env-182059.customer.cloud.microstrategy.com' and @AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[1]"
//                "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXTitle='Office Add-ins - env-182059.customer.cloud.microstrategy.com' and @AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXGroup"
//                "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXGroup/AXGroup[1]/AXGroup[0]/AXStaticText[@AXValue='Month']"
//                "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXOutline[0]/AXRow[@AXSubrole='AXOutlineRow']/AXGroup/AXGroup[1]/AXGroup[0]/AXStaticText[@AXValue='Month']"
//                "/AXApplication[@AXTitle='Microsoft Excel']/AXWindow[@AXIdentifier='_NS:9' and @AXSubrole='AXStandardWindow']/AXGroup[0]/AXGroup[0]/AXScrollArea[0]/AXWebArea[0]/AXTable[0]/AXUnknown[0]/AXGroup[0]/AXGroup[0]"
        );
        machine.waitAndFind(t).click();
    }

    @Test
    public void test4(){
        //"Prepare Data" popup pane selector experiments
        By target = By.xpath(
//                "//Text[@Name=\"icon: search\"]/.." // ~55
                "//*[@AutomationId='form_names_label']/.." //36,439 50,426
//                "//Link[@AutomationId='form_names_label']/.." // fails
//                "//Button[@AutomationId='import']/.." // 48,716
//                "//*[@AutomationId='import']/.." // 52,368
        );
        RemoteWebElement targetElem = machine.waitAndFind(target);
        machine.printChildren(targetElem);
    }

    @Test
    public void test5(){
        machine.getPrepareDataPromptPage().clickAttributes(new int[]{-1});
        machine.getPrepareDataPromptPage().clickMetrics(new int[]{-1});
        machine.getPrepareDataPromptPage().clickFilterAndFilterValues(null, new int[]{-1});
    }

    @Test
    public void test6() throws InterruptedException {
        //TODO check for simple report
            //TODO check with filter selected
            //TODO check for edit simple report
        //TODO check for crosstab report
            //TODO check with filter selected
            //TODO check for edit crosstab report

        //windows prepare data popup poc
        //get prepare data pane elem
        By prepDataPaneSelector = By.xpath("//*[@AutomationId='form_names_label']/..");
        WebElement prepDataPaneElem = machine.waitAndFind(prepDataPaneSelector);

        //get all children elem
        List<WebElement> prepDataPaneChildren = machine.getChildren((RemoteWebElement) prepDataPaneElem);
        machine.printChildren(prepDataPaneChildren);

        ListIterator<WebElement> iterator = prepDataPaneChildren.listIterator();
        int attributeColStart = -1;
        int attributeColEnd = -1;
        int metricColStart = -1;
        int metricColEnd = -1;
        int filterColStart = -1;
        int filterColEnd = -1;
        int filterValuesColStart = -1;

        //find start of col attributes
        WebElement attributeHeader = null;
        while (iterator.hasNext()){
            WebElement nextChild = iterator.next();
            if (nextChild.getText().startsWith("Attributes")) {
                attributeHeader = nextChild;
                attributeColStart = iterator.previousIndex();
                break;
            }
        }

        attributeHeader.click();
        //find end of   col attributes
        //find start of col metrics
        WebElement metricHeader = null;
        while (iterator.hasNext()){
            WebElement nextChild = iterator.next();
            if (nextChild.getText().startsWith("Metrics")) {
                metricHeader = nextChild;
                attributeColEnd = iterator.previousIndex();
                metricColStart = attributeColEnd;
                break;
            }
        }

        Thread.sleep(1_000);
        metricHeader.click();

        //find end of   col metrics
        //find start of col filters
        WebElement filterHeader = null;
        while (iterator.hasNext()){
            WebElement nextChild = iterator.next();
            if (nextChild.getText().startsWith("Filters")) {
                filterHeader = nextChild;
                metricColEnd = iterator.previousIndex();
                filterColStart = metricColEnd;
                break;
            }
        }

        Thread.sleep(1_000);
        filterHeader.click();
        //find end of   col filters
        //find start of col filter values
        WebElement filterValueAllRow = null;
        while (iterator.hasNext()){
            WebElement nextChild = iterator.next();
            if (nextChild.getText().startsWith("(All)")) {
                filterValueAllRow = nextChild;
                filterColEnd = iterator.previousIndex();
                filterValuesColStart = filterColEnd;
                break;
            }
        }

        System.out.println("attributeColStart = " + attributeColStart);
        System.out.println("attributeColEnd = " + attributeColEnd);
        System.out.println("metricColStart = " + metricColStart);
        System.out.println("metricColEnd = " + metricColEnd);
        System.out.println("filterColStart = " + filterColStart);
        System.out.println("filterColEnd = " + filterColEnd);
        System.out.println("filterValuesColStart = " + filterValuesColStart);

//        Thread.sleep(1_000);
//        filterValueAllRow.click();
        //-----
        //get "All" elems and get all column child elems
        //attr
        WebElement attributesAllElem = prepDataPaneChildren.get(attributeColStart + 1);
        List<WebElement> attributes = new ArrayList<>();
        for (int i = attributeColStart + 1; i < attributeColEnd; i++) {
            WebElement current = prepDataPaneChildren.get(i);
            if (current.getTagName().equals("ControlType.TreeItem"))
                attributes.add(current);
        }

        //metric
        WebElement metricsAllElem = prepDataPaneChildren.get(metricColStart + 2);
        List<WebElement> metrics = new ArrayList<>();
        for (int i = metricColStart + 3; i < metricColEnd; i++) {
            WebElement current = prepDataPaneChildren.get(i);
            if (current.getTagName().equals("ControlType.CheckBox"))
                metrics.add(current);
        }

        //filters
        List<WebElement> filters = new ArrayList<>();
        for (int i = filterColStart + 1; i < filterColEnd; i++) {
            WebElement current = prepDataPaneChildren.get(i);
            if (current.getTagName().equals("ControlType.TreeItem"))
                filters.add(current);
        }

        //filter values
        List<WebElement> filterValues = new ArrayList<>();
        for (int i = filterValuesColStart + 1; i < prepDataPaneChildren.size(); i++) {
            WebElement current = prepDataPaneChildren.get(i);
            if (current.getTagName().equals("ControlType.CheckBox"))
                filterValues.add(current);
        }

        //-----
        //start interacting
        //click each all elem
        attributesAllElem.click();
        Thread.sleep(1_000);

        metricsAllElem.click();
        Thread.sleep(1_000);

        filters.get(0).click();
        Thread.sleep(1_000);

        filterValueAllRow.click();
        Thread.sleep(1_000);

        //click add list elems attrbutes, metrics, filter values, filters
        for (WebElement attribute : attributes) {
            System.out.println("attribute.getText() = " + attribute.getText());
            machine.clickObjectWithOffset(attribute, 50, 20);
        }

        for (WebElement metric : metrics) {
            System.out.println("metric.getText() = " + metric.getText());
            metric.click();
        }

        for (int i = 0; i < 10; i++) {
            WebElement filterValue = filterValues.get(i);
            filterValue.click();
        }

        for (WebElement filter : filters) {
            machine.clickObjectWithOffset(filter, 50, 20);
        }
    }

    @Test
    public void test123(){
        By selector = By.xpath("//Text[@Name='To preserve this crosstab report, select all objects without changing their forms.']");
        WebElement target = machine.driver.findElement(selector);
    }
}
