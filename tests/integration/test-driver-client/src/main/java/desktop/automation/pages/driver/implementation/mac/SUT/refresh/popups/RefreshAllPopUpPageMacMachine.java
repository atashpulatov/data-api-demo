package desktop.automation.pages.driver.implementation.mac.SUT.refresh.popups;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.elementWrappers.ImageComparisonElem;
import desktop.automation.pages.SUT.refresh.popups.RefreshAllPopUpPage;
import org.openqa.selenium.By;

public class RefreshAllPopUpPageMacMachine extends RefreshAllPopUpPage {

    public RefreshAllPopUpPageMacMachine(Machine machine) {
        super(machine);
    }

    @Override
    protected void assertCurrentlyRefreshedObjectNameIsAsExpected(String expectedName) {
        By selector = By.xpath(String.format(REFRESHING_OBJECT_NAME_BASE, expectedName));
        machine.waitAndFind(selector, machine.TWELVE_UNITS);
    }

    @Override
    protected void assertCurrentlyRefreshObjectIndexAndTotalCountersAreAsExpected(int index, int total) {
        By selector = By.xpath(String.format(REFRESHING_OBJECT_INDEX_AND_TOTAL_BASE, index, total, index, total));
        machine.waitAndFind(selector, machine.TWO_UNITS);
    }

    @Override
    protected void assertRefreshedObjectSuccessOrFailureIconsPresent(int index) {
        if (refreshAllTitleStartX == -1 || refreshAllTitleStartY == -1)
            getRefreshAllDataTitleElem();

        int startX = refreshAllTitleStartX - 10;
        int endX = startX + 56;
        int startY = refreshAllTitleStartY + 266 + index * 62;
        int endY = startY + 62;

        new ImageComparisonElem(
                new String[]{REFRESHED_OBJECT_SUCCESS_ICON_IMAGE_1, REFRESHED_OBJECT_SUCCESS_ICON_IMAGE_2, REFRESHED_OBJECT_FAILURE_ICON_IMAGE},
                startX, endX, startY, endY
                , machine.getUnitIntValue() * 12_000);
    }

    @Override
    protected void assertNameOfObjectInListAsExpected(int index, String expectedName) {
        By selector = By.xpath(String.format(REFRESHED_OBJECT_NAME_BASE, index, expectedName));
        machine.waitAndFind(selector);
    }


}
