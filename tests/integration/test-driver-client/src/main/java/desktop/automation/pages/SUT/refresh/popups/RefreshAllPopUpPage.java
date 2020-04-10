package desktop.automation.pages.SUT.refresh.popups;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.WebDriverElemWrapper;
import desktop.automation.selectors.SUT.RefreshAllPopUpPageSelectors;

public abstract class RefreshAllPopUpPage extends RefreshAllPopUpPageSelectors {
    protected Machine machine;
    protected static int refreshAllTitleStartX = -1;
    protected static int refreshAllTitleStartY = -1;

    public RefreshAllPopUpPage(Machine machine) {
        this.machine = machine;
    }

    public WebDriverElemWrapper getRefreshAllDataTitleElem(){
        WebDriverElemWrapper res = machine.waitAndFindElemWrapper(REFRESH_ALL_DATA_TITLE_ELEM);

        refreshAllTitleStartX = res.getDriverElement().getLocation().getX() * 2;
        refreshAllTitleStartY = res.getDriverElement().getLocation().getY() * 2;

        return res;
    }

    public WebDriverElemWrapper getRefreshCompleteTitleElem(){
        return machine.waitAndFindElemWrapper(REFRESH_COMPLETE_TITLE_ELEM, machine.TWELVE_UNITS);
    }

    public WebDriverElemWrapper getCloseBtn(){
        return machine.waitAndFindElemWrapper(CLOSE_BTN_ELEM);
    }

    protected abstract void assertCurrentlyRefreshedObjectNameIsAsExpected(String expectedName);

    protected abstract void assertCurrentlyRefreshObjectIndexAndTotalCountersAreAsExpected(int index, int total);

    protected abstract void assertRefreshedObjectSuccessOrFailureIconsPresent(int index);

    protected void assertNamesOfObjectsInListAreAsExpected(String[] expectedNames){
        for (int i = 0; i < expectedNames.length; i++) {
            String expectedName = expectedNames[i];
            assertNameOfObjectInListAsExpected(i * 2 + 3, expectedName);
        }
    }

    protected abstract void assertNameOfObjectInListAsExpected(int index, String expectedName);

    public void assertRefreshAllFlow(String[] objectNames){
        getRefreshAllDataTitleElem();

        for (int i = 0; i < objectNames.length; i++) {
            String objectName = objectNames[i];

            assertCurrentlyRefreshedObjectNameIsAsExpected(objectName);
//            assertCurrentlyRefreshObjectIndexAndTotalCountersAreAsExpected(i + 1, objectNames.length);
            if (i != 0)
                assertRefreshedObjectSuccessOrFailureIconsPresent(i - 1);
        }
        getRefreshCompleteTitleElem();
        assertRefreshedObjectSuccessOrFailureIconsPresent(objectNames.length - 1);

        assertNamesOfObjectsInListAreAsExpected(objectNames);
    }
}
