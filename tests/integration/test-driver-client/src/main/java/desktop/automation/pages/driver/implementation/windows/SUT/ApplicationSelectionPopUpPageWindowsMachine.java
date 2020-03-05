package desktop.automation.pages.driver.implementation.windows.SUT;

import desktop.automation.driver.wrappers.WindowsMachine;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import desktop.automation.pages.SUT.ApplicationSelectionPopUpPage;

import java.util.List;

public class ApplicationSelectionPopUpPageWindowsMachine extends ApplicationSelectionPopUpPage {

    public ApplicationSelectionPopUpPageWindowsMachine(WindowsMachine machine) {
        super(machine);
    }

    @Override
    public List<String> getListOfApplicationNames() {
        throw new NotImplementedForDriverWrapperException();
    }
}
