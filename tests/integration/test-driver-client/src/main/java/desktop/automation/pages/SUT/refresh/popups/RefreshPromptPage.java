package desktop.automation.pages.SUT.refresh.popups;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.elementWrappers.ImportedObjectInList;
import desktop.automation.elementWrappers.windows.RefreshStatus;
import desktop.automation.elementWrappers.windows.RefreshedObjectInlist;
import desktop.automation.selectors.SUT.RefreshPromptPageSelectors;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;

public class RefreshPromptPage extends RefreshPromptPageSelectors {
    private Machine machine;

    public RefreshPromptPage(Machine machine) {
        this.machine = machine;
    }

    public WebElement getRefreshAllTitleElem(){
        return machine.waitAndFind(REFRESH_ALL_TITLE_ELEM);
    }

    public void assertRefreshAllTitleElemNotPresent(){
        machine.assertNotPresent(REFRESH_ALL_TITLE_ELEM);
    }

    public WebElement getRefreshSingleTitleElem(){
        return machine.waitAndFind(REFRESH_SINGLE_TITLE_ELEM);
    }

    public WebElement getRefreshSingleMessageElem(){
        return machine.waitAndFind(REFRESH_SINGLE_MESSAGE_ELEM);
    }

    public void assertRefreshSingleTitleElemNotPresent(){
        machine.assertNotPresent(REFRESH_SINGLE_TITLE_ELEM);
    }

    public WebElement getRefreshCompleteMessageElem(){
        return machine.waitAndFind(REFRESH_COMPLETE_MESSAGE_ELEM, machine.SIX_UNITS);
    }

    public void waitUntilRefreshCompleteMessageNotPresent(){
        machine.assertNotPresent(REFRESH_COMPLETE_MESSAGE_ELEM);
    }

    public List<WebElement> getAllPromptElems(){
        return machine.getChildren(machine.waitAndFind(REFRESH_PROMPT_CONTAINER_ELEM));
    }

    public WebElement getRefreshPromptContainerElem(){
        return machine.waitAndFind(REFRESH_PROMPT_CONTAINER_ELEM, machine.TWO_UNITS);
    }

    public String getRefreshStatusFromRefreshPromptContainerElem(){
//res = [Refresh All Data, 100010 rows report, (1/2), Loading data..., 100010 rows report, Report with prompt - Value prompt - Big Decimal (Customer ID) | Not required | No default answer]
//res = [Refresh All Data, Refreshing complete!, 100010 rows report, Report with prompt - Value prompt - Big Decimal (Customer ID) | Not required | No default answer]

        String[] textNodes = getAllTextNodeContentsFromRefreshPromptContainerElem();
        return textNodes[1].equals("Refreshing complete!") ? textNodes[1] : textNodes[1] + " " + textNodes[2];
    }

    public List<String> getRefreshingObjectNames(){
        String[] raw = getAllTextNodeContentsFromRefreshPromptContainerElem();

        List<String> res = new LinkedList<>();
        int start = raw[1].equals("Refreshing complete!") ? 2 : 4;
        for (int i = start; i < raw.length; i++) {
            String s = raw[i];
            res.add(s);
        }

        return res;
    }

    public void assertRefreshStatusForObjectRefreshed(String objectName, int index, int total){
        String expectedStatus = objectName + String.format(" (%d/%d)", index, total);

        assertEquals(expectedStatus, getRefreshStatusFromRefreshPromptContainerElem());
    }

    public String[] getAllTextNodeContentsFromRefreshPromptContainerElem(){
        String promptTitleRaw = getRefreshPromptContainerElem().getText().trim();

        return promptTitleRaw.replaceAll("[\\n\\r]+", "\n").split("\n");
    }

    public List<WebElement> getAllStatusImageElems(){
        List<WebElement> allImageElems = getRefreshPromptContainerElem().findElements(By.xpath("./*/*/*/*/*/*[@LocalizedControlType='image']"));
        return allImageElems;
    }

    public List<RefreshStatus> getRefreshStatuses(){
        List<WebElement> allImageElems = getAllStatusImageElems();

        List<RefreshStatus> res = new LinkedList<>();
        for (WebElement allImageElem : allImageElems) {
            String automationId = allImageElem.getAttribute("AutomationId");

            switch (automationId){
                case "icon_offline_success":
                    res.add(RefreshStatus.SUCCESS);
                    break;
                case "Group-3":
                    res.add(RefreshStatus.FAILED);
                    break;
                default:
                    res.add(RefreshStatus.UNKNOWN);
            }
        }

        System.out.println("res.size() = " + res.size());
        return res;
    }

    public WebElement getToolTipElem(){
        return machine.waitAndFind(TOOL_TIP_ELEM);
    }

    public WebElement moveToRefreshStatusIconAndGetToolTip(RefreshedObjectInlist refreshedObject){
        machine.actions
                .moveToElement(refreshedObject.getStatusElem())
                .pause(500)
                .perform();

        return getToolTipElem();
    }

    public WebElement getToolTipTitleElem(RefreshedObjectInlist refreshedObjectInlist){
        return machine.waitAndFind(By.name(refreshedObjectInlist.getNameElem().getText() + " could not be refreshed"));
    }

    public WebElement getToolTipBindindErrorMessageElem(){
        return machine.waitAndFind(TOOL_TIP_BINDING_ERROR_MESSAGE_ELEM);
    }

    public WebElement getCloseBtnElem(){
        return machine.waitAndFind(CLOSE_BTN_ELEM);
    }

    public List<RefreshedObjectInlist> getRefreshedObjectsList(){
        List<RefreshedObjectInlist> res = new LinkedList<>();

        List<WebElement> promptElems = getAllPromptElems();
        for (int i = 0; i < promptElems.size(); i++) {
            WebElement statusElem = promptElems.get(i);

            RefreshStatus status = null;
            String autoId = statusElem.getAttribute("AutomationId");
            if (autoId != null && autoId.matches("icon_offline_success"))
                status = RefreshStatus.SUCCESS;
            else {
                String name = statusElem.getAttribute("Name");
                if (name != null && name.matches("Refresh failed icon"))
                    status = RefreshStatus.FAILED;
            }

            if (status != null){
                while (true) {
                    WebElement nameElem = promptElems.get(++i);

                    String tagName = nameElem.getTagName();
                    if (tagName != null && tagName.matches("ControlType.Text")) {
                        res.add(new RefreshedObjectInlist(status, statusElem, nameElem));
                        break;
                    }
                }
            }
        }

        return res;
    }

    public void refreshObjectAndAssertFlow(int objectIndexInImportedObjectList, String expectedName, boolean isDataset, int secondsToWaitForRefreshToFinish){
        ImportedObjectInList importedObjectInList = machine.getMainPage().getImportedObjectsInList().get(objectIndexInImportedObjectList);

        //1
//        RemoteWebElement addInPaneElem = machine.getMainPage().getAddInPaneElem();
//        machine.actions
//                .click(importedObjectInList.getRefreshBtnElem())
//                .moveToElement(addInPaneElem)
//
//                .pause(1_000)
//                .moveByOffset(10, 10)
//                .moveByOffset(-10, -10)
//                .pause(1_000)
//                .moveByOffset(10, 10)
//                .moveByOffset(-10, -10)
//                .pause(1_000)
//                .moveByOffset(10, 10)
//                .moveByOffset(-10, -10)
//
//                .perform();
//        assertRefreshFlowForRefreshBySingleObjectRefreshBtnClick(expectedName, isDataset, secondsToWaitForRefreshToFinish);
        //2
        importedObjectInList.getRefreshBtnElem().click();
        waitForRefreshNotificationToAppear(secondsToWaitForRefreshToFinish);
        assertRefreshSingleTitleElemNotPresent();
    }

    public ImageComparisonElem getRefreshNotificationImageBasedElem() {
        return ImageComparisonElem.getImageComparisonElemWithoutElementSearch("mainPage/refreshSuccess");
    }

    public void waitForRefreshNotificationToAppear(int secondsToWaitForRefreshToFinish) {
        ImageComparisonElem refreshNotification = getRefreshNotificationImageBasedElem();
        refreshNotification.waitAndFind(1550, 1800, 600, 700, secondsToWaitForRefreshToFinish * 1_000);
    }

    public void assertRefreshFlowForRefreshBySingleObjectRefreshBtnClick(String expectedName, boolean isDataset, int secondsToWaitForRefreshToFinish) {
//        getRefreshSingleTitleElem();
//        getRefreshSingleMessageElem();

        //1
//        WebDriverWait wait = new WebDriverWait(machine.driver, secondsToWaitForRefreshToFinish);
//        try {
//            if (isDataset)
//                machine.takeElementScreenshotWithDetails(machine.getMainPage().getDatasetRefreshedMessageElem(wait), "mainPage/datasetRefreshed");
//            else
//                machine.takeElementScreenshotWithDetails(machine.getMainPage().getReportRefreshedMessageElem(wait), "mainPage/reportRefreshed");
//        }
//        catch (IOException e) {
//            e.printStackTrace();
//        }
        //2
        ImageComparisonElem refreshNotification = ImageComparisonElem.getImageComparisonElemWithoutElementSearch(isDataset ? "mainPage/datasetRefreshed" : "mainPage/reportRefreshed");
        refreshNotification.waitAndFind(1520, 1700, 620, 700, secondsToWaitForRefreshToFinish * 1000);
    }

    public void refreshAllObjectsAndAssertFlow(String[] expectedObjectNames, int secondsToWaitForEachObjectRefreshToFinish){
        machine.getMainPage().getRefreshAllBtnElem().click();

        assertRefreshFlowForRefreshByRefreshAllBtnClick(expectedObjectNames, secondsToWaitForEachObjectRefreshToFinish);

        getCloseBtnElem().click();
        assertRefreshAllTitleElemNotPresent();
    }

    public void refreshAllObjectsAndAssertFlowImagedBased(String[] expectedObjectNames, int secondsToWaitForEachObjectRefreshToFinish){
        throw new RuntimeException("not implemented");
//
//        //TODO
//        machine.getMainPage().getRefreshAllBtnElem().click();
//
//        assertRefreshFlowForRefreshByRefreshAllBtnClickImagedBased(expectedObjectNames, secondsToWaitForEachObjectRefreshToFinish);
//
//        getCloseBtnElem().click();
//        assertRefreshAllTitleElemNotPresent();
    }

    private void assertRefreshFlowForRefreshByRefreshAllBtnClickImagedBased(String[] expectedObjectNames, int secondsToWaitForEachObjectRefreshToFinish) {
        throw new RuntimeException("not implemented");
//
//        //TODO create IR elems
//
//        //assert title correct at start
//        //TODO
//        getRefreshAllTitleElem();
//
//        //skipping spinner for automation
////        getLoadingSpinnerElem();
//
//        //each object flow
//        for (int i = 0; i < expectedObjectNames.length; i++) {
//            String expectedObjectName = expectedObjectNames[i];
//            assertRefreshFlowForRefreshByRefreshAllBtnClickPerObjectImageBased(expectedObjectName, i + 1, expectedObjectNames.length, secondsToWaitForEachObjectRefreshToFinish);
//        }
//
//        //assert title correct at end
//        //TODO copy
//        getRefreshAllTitleElem();
//
//        //Refresh complete message present at end
//        //TODO
//        getRefreshCompleteMessageElem();
//
//        //assert allNames correct at end
//        assertRefreshingObjectNames(expectedObjectNames);
    }

    private void assertRefreshFlowForRefreshByRefreshAllBtnClickPerObjectImageBased(String expectedObjectName, int displayedIndex, int total, int secondsToWaitForEachObjectRefreshToFinish) {
        throw new RuntimeException("not implemented");
    }

    public void assertRefreshFlowForRefreshByRefreshAllBtnClick(String[] expectedObjectNames, int secondsToWaitForEachObjectRefreshToFinish) {
        //TODO slow method only to be used with large objects, otherwise implement IR based method

        //assert title correct at start
        getRefreshAllTitleElem();

        //assert allNames correct at start
        assertRefreshingObjectNames(expectedObjectNames);

        //assert Spinner present at start
        getLoadingSpinnerElem();

        //each object flow
        for (int i = 0; i < expectedObjectNames.length; i++) {
            String expectedObjectName = expectedObjectNames[i];
            assertRefreshFlowForRefreshByRefreshAllBtnClickPerObject(expectedObjectName, i + 1, expectedObjectNames.length, secondsToWaitForEachObjectRefreshToFinish);
        }

        //assert title correct at end
        getRefreshAllTitleElem();

        //Refresh complete message present at end
        getRefreshCompleteMessageElem();

        //assert allNames correct at end
        assertRefreshingObjectNames(expectedObjectNames);
    }

    private void assertRefreshingObjectNames(String[] expectedObjectNames) {
        ListIterator<String> actualNamesIterator = getRefreshingObjectNames().listIterator();
        for (int i = 0; i < expectedObjectNames.length; i++) {
            String expectedObjectName = expectedObjectNames[i];
            assertEquals(expectedObjectName, actualNamesIterator.next());
        }
    }

    private WebElement getLoadingSpinnerElem() {
        return machine.waitAndFind(LOADING_SPINNER_ELEM);
    }

    public void assertRefreshFlowForRefreshByRefreshAllBtnClickPerObject(String expectedObjectName, int displayedIndex, int total, int secondsToWaitForEachObjectRefreshToFinish) {
        //assert Refresh status title
        assertRefreshStatusForObjectRefreshed(expectedObjectName, displayedIndex, total);

        //at end assert Refresh status next to element
        long start = System.currentTimeMillis();
        do {
            try {
                RefreshStatus status = getRefreshStatuses().get(displayedIndex - 1);
                String message = String.format("expected %s or %s status for element index in refresh list: %d, was %s", RefreshStatus.FAILED, RefreshStatus.SUCCESS, displayedIndex - 1, status);
                assertTrue(message, !status.equals(RefreshStatus.UNKNOWN));
                break;
            } catch (Exception ignored){}
        } while (System.currentTimeMillis() - start < secondsToWaitForEachObjectRefreshToFinish);
    }
}
