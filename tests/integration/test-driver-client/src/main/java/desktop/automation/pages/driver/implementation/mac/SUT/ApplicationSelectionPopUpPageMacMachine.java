package desktop.automation.pages.driver.implementation.mac.SUT;

import desktop.automation.driver.wrappers.MacMachine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.ApplicationSelectionPopUpPage;

import java.util.List;

public class ApplicationSelectionPopUpPageMacMachine extends ApplicationSelectionPopUpPage {

    public ApplicationSelectionPopUpPageMacMachine(MacMachine machine) {
        super(machine);
    }

    @Override
    public List<String> getListOfApplicationNames() {
        throw new NotImplementedForDriverWrapperException();
    }
}
