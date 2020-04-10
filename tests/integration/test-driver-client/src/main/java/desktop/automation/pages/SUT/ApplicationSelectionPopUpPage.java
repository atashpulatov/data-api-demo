package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.Machine;

import java.util.List;
import java.util.ListIterator;

import static junit.framework.TestCase.assertEquals;

public abstract class ApplicationSelectionPopUpPage {
    Machine machine;

    public ApplicationSelectionPopUpPage(Machine machine) {
        this.machine = machine;
    }

    public abstract List<String> getListOfApplicationNames();

    public void assertListOfApplicationsAsExpected(List<String> expectedApplicationNames){
        List<String> actualApplicationNames = getListOfApplicationNames();

        assertEquals(expectedApplicationNames.size(), actualApplicationNames.size());
        ListIterator<String> actualIter = actualApplicationNames.listIterator();
        for (String expectedApplicationName : expectedApplicationNames)
            assertEquals(expectedApplicationName, actualIter.next());
    }
}
