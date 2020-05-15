package desktop.automation.pages.SUT;

import desktop.automation.driver.wrappers.WindowsMachine;
import desktop.automation.selectors.SUT.DataPreviewPageSelectors;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

public class DataPreviewPage extends DataPreviewPageSelectors {
    private WindowsMachine windowsMachine;

    public DataPreviewPage(WindowsMachine windowsMachine) {
        this.windowsMachine = windowsMachine;
    }

    public WebElement getTitleElem(){
        return windowsMachine.waitAndFind(TITLE);
    }

    public void assertTitleElemNotPresent(){
        windowsMachine.assertNotPresent(TITLE);
    }

    public void assertTableElemsAreAsExpected(String[] expectedValues, int[][]coordinates, int totalColCount){
        ListIterator<WebElement> iterator = getTableElemsByRowAndColumnIndexes(coordinates, totalColCount).listIterator();

        for (int i = 0; i < expectedValues.length; i++) {
            String expectedValue = expectedValues[i];
            assertEquals(expectedValue, iterator.next().getText());
        }
    }

    public List<WebElement> getTableElemsByRowAndColumnIndexes(int[][] coordinates, int totalColCount){
        List<WebElement> rowElems = getTableElems();

        List<WebElement> res = new ArrayList<>();
        for (int[] currCoor : coordinates)
            res.add(rowElems.get(currCoor[0] + currCoor[1] * totalColCount ));

        return res;
    }

    public List<WebElement> getTableElems(){
        List<WebElement> rowElems = windowsMachine.driver.findElements(ROW_ELEM);
        assertTrue(rowElems.size() <= 40);

        return rowElems;
    }

    public WebElement getOnlyTenRowsDisplayedWarningElem(){
        return windowsMachine.waitAndFind(ONLY_TEN_ROWS_DISPLAYED_WARNING);
    }

    public WebElement getClosePreviewBtnElem(){
        return windowsMachine.waitAndFind(CLOSE_PREVIEW_BTN);
    }}
