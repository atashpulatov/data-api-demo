package notToBeRunAsPartOfTestSuite;

import desktop.automation.test.infrastructure.BaseLoggedInTests;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;

import java.util.List;

public class DraftExample extends BaseLoggedInTests {

    @Test
    public void test(){
        WebElement parent = null;

        List<WebElement> children = machine.getChildren((RemoteWebElement) parent);
        int firstCellIndex = 0;
        for (WebElement child : children) {
            if (child.getTagName().equals("Item"))
                break;

            firstCellIndex++;
        }

        //index of firstCellIndex 8
        int countOfCol = firstCellIndex - 2;

        // int row, int col
        int row = 0;
        int col = 0;

        int targetIndex = firstCellIndex + (1 + countOfCol) * row + col;
        WebElement targetCellElem = children.get(targetIndex);

        String name = targetCellElem.getAttribute("Name");
    }

    @Test
    public void test1(){
        WebElement parent = null;
        List<WebElement> allCells = parent.findElements(By.xpath(".//*[@LocalizedControlType='item']"));

        int totalColCount = 6;
        int row = 0;
        int col = 0;

        int targetIndex = row * totalColCount + col;
        WebElement targetCellElem = allCells.get(targetIndex);

        String name = targetCellElem.getAttribute("Name");
    }
}
