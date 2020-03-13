package desktop.automation.pages.driver.implementation.windows.SUT.refresh.popups;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.refresh.popups.RefreshAllPopUpPage;

public class RefreshAllPopUpPageWindowsMachine extends RefreshAllPopUpPage {

    public RefreshAllPopUpPageWindowsMachine(Machine machine) {
        super(machine);
    }

    @Override
    protected void assertCurrentlyRefreshedObjectNameIsAsExpected(String expectedName) {
        throw new NotImplementedForDriverWrapperException();
    }

    @Override
    protected void assertCurrentlyRefreshObjectIndexAndTotalCountersAreAsExpected(int index, int total) {
        throw new NotImplementedForDriverWrapperException();
    }

    @Override
    protected void assertRefreshedObjectSuccessOrFailureIconsPresent(int index) {
        throw new NotImplementedForDriverWrapperException();
    }

    @Override
    protected void assertNameOfObjectInListAsExpected(int index, String expectedName) {
        throw new NotImplementedForDriverWrapperException();
    }
}
