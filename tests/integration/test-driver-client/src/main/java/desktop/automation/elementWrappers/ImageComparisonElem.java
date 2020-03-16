package desktop.automation.elementWrappers;

import desktop.automation.driver.wrappers.Machine;
import desktop.automation.driver.wrappers.enums.OS;
import desktop.automation.exceptions.ImageBasedElemNotFound;
import desktop.automation.exceptions.NotImplementedForDriverWrapperException;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
import tools.CompareImages;

import java.io.File;
import java.io.IOException;

import static desktop.automation.ConfigVars.DEBUG_IMAGE_COMPARISON;
import static desktop.automation.ConfigVars.DESIRED_DRIVER_TYPE;
import static tools.CompareImages.findFirstMatch;

public class ImageComparisonElem implements AnyInterfaceElement {
    //pass on initialization with setter method
    private static Machine machine;
    private final static By DESKTOP_ELEM = By.name("Desktop 1");
    private final static By MENU_BAR = By.xpath("/AXApplication[@AXTitle='Microsoft Excel']/AXMenuBar[0]");

    private static WebElement FOUND_DESKTOP_ELEM = null;
    private static int imageCounter = 0;

    private Mat standardizedImage;

    private int x = -1;
    private int y = -1;
    private int width = -1;
    private int height = -1;

    static {
        OS os = OS.getOSType();
        if (os.equals(OS.MAC))
            System.load(new File("libs/libopencv_java420.dylib").getAbsolutePath());
        else if (os.equals(OS.WINDOWS))
            System.load(new File("libs/opencv_java412.dll").getAbsolutePath());
        else
            throw new RuntimeException("Unrecognized OS");
    }

    public ImageComparisonElem(String imageFile, int startX, int endX, int startY, int endY) {
        this(imageFile, startX, endX, startY, endY, 10_000);
    }

    public ImageComparisonElem(String[] imageFiles, int startX, int endX, int startY, int endY) {
        this(imageFiles, startX, endX, startY, endY, 10_000);
    }

    public ImageComparisonElem(String imageFile, int startX, int endX, int startY, int endY, int millisToWaitFor) {
        this(imageFile, startX, endX, startY, endY, millisToWaitFor, 20);
    }

    public ImageComparisonElem(String imageFile, int startX, int endX, int startY, int endY, int millisToWaitFor, int tolerance) {
        String imageRelPath = formatTheFilePathArg(imageFile);

        standardizedImage = Imgcodecs.imread(imageRelPath);

        waitAndFind(startX, endX, startY, endY, millisToWaitFor, 0, tolerance);
    }

    public ImageComparisonElem(String[] imageFiles, int startX, int endX, int startY, int endY, int millisToWaitFor) {
        this(imageFiles, startX, endX, startY, endY, millisToWaitFor, 20);
    }

    public ImageComparisonElem(String[] imageFiles, int startX, int endX, int startY, int endY, int millisToWaitFor, int tolerance) {
        long start = System.currentTimeMillis();
        do {
            for (String imageFile : imageFiles) {
                try {
                    String imageRelPath = formatTheFilePathArg(imageFile);

                    standardizedImage = Imgcodecs.imread(imageRelPath);

                    find(startX, endX, startY, endY, tolerance);
                    return;
                } catch (ImageBasedElemNotFound ignored) {
                    if (DEBUG_IMAGE_COMPARISON)
                        System.out.println("did not find image: " + imageFile);
                }
            }
        } while (System.currentTimeMillis() - start < millisToWaitFor);

        throw new ImageBasedElemNotFound();
    }

    private ImageComparisonElem(){
    }

    public static ImageComparisonElem getImageComparisonElemWithoutElementSearch(String imageFile){
        ImageComparisonElem res = new ImageComparisonElem();
        res.standardizedImage = Imgcodecs.imread(formatTheFilePathArg(imageFile));

        return res;
    }

    public ImageComparisonElem(String imageFile) {
        standardizedImage = Imgcodecs.imread(formatTheFilePathArg(imageFile));

        setDimensions(find());
    }

    private static String formatTheFilePathArg(String imageFile){
        String res = machine.getCurrentDriverRootImageFolder() + imageFile + ".png";

        File tmp = new File(res);
        if (DEBUG_IMAGE_COMPARISON)
            System.out.println("Image searched for absolute path: " + tmp.getAbsolutePath());
        if (!tmp.exists()) {
            String message = String.format("No such file for argument: \n%s\nparsed:\n%s\nabsolute path:\n%s",
                    imageFile, res, tmp.getAbsolutePath());
            throw new IllegalArgumentException(message);
        }

        return res;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    private void setDimensions(int[] imageComparisonRes){
        if (imageComparisonRes == null){
            this.x = -1;
            this.y = -1;
            this.width = -1;
            this.height = -1;
        }
        else {
            switch (DESIRED_DRIVER_TYPE){
                case MAC_DESKTOP:
                    this.x = imageComparisonRes[0]/ 2;
                    this.y = imageComparisonRes[1] / 2;
                    this.width = imageComparisonRes[2] / 2;
                    this.height = imageComparisonRes[3] / 2;
                    break;
                case WINDOWS_DESKTOP:
                    this.x = imageComparisonRes[0];
                    this.y = imageComparisonRes[1];
                    this.width = imageComparisonRes[2];
                    this.height = imageComparisonRes[3];
                    break;
                default:
                    throw new NotImplementedForDriverWrapperException();
            }
        }
    }

    @Override
    public void sendKeys(CharSequence... input){
        click();
        machine.actions.sendKeys(input).perform();
    }

    @Override
    public void clear() {
        throw new NotImplementedForDriverWrapperException();
    }

    public void click(){
        moveTo();
        if (x != -1 && y != -1)
            machine.actions
                    .moveByOffset(width / 2, height / 2)
                    .click()
                    .perform();
    }

    @Override
    public void clickExplicitlyByActionClass() {
        click();
    }

    @Override
    public String getText() {
        throw new RuntimeException("Not Implemented");
    }

    public void contextClick(){
        moveTo();
        if (x != -1 && y != -1)
            machine.actions
                    .moveByOffset(width / 2, height / 2)
                    .contextClick()
                    .perform();
    }

    public void moveTo(){
        switch (DESIRED_DRIVER_TYPE) {
            case MAC_DESKTOP:
                //move to start
                if (x != -1 && y != -1){
                    WebElement menuBarElem = machine.waitAndFind(MENU_BAR);

                    machine.actions
                            .moveToElement(menuBarElem)
                            .moveByOffset(x - menuBarElem.getSize().width / 2 - menuBarElem.getLocation().getX(),
                                    y - menuBarElem.getSize().height / 2)
                            .perform();
                }
                break;
            case WINDOWS_DESKTOP:
                //move to start
                if (x != -1 && y != -1){
                    WebElement desktopElem = getDesktopElem();

                    int moveToX = x - desktopElem.getSize().getWidth() / 2;
                    int moveToY = y - desktopElem.getSize().getHeight() / 2;

                    machine.actions
                            .moveToElement(desktopElem)
                            .moveByOffset(moveToX, moveToY)
                            .perform();
                }
                break;
            default:
                throw new NotImplementedForDriverWrapperException();
        }
    }

    public int[] find() throws ImageBasedElemNotFound{
        return find(-1, -1, -1, -1);
    }

    //this method should find this object's standardizedImage within the passed elem
    public int[] find(WebElement element){
        Point loc = element.getLocation();
        Mat actualScreenshot = null;
        try {
            actualScreenshot = machine.getElementMat("tmpElementUncropped", element);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return getCoordinates(actualScreenshot, loc.getX(), loc.getY());
    }

    public int[] find(int startX, int endX, int startY, int endY) {
        return find(startX, endX, startY, endY, 20);
    }

    public int[] find(int startX, int endX, int startY, int endY, int tolerance){
        int[] res = compareTargetToScreenshot(startX, endX, startY, endY, tolerance);

        if (res == null) {
            setDimensions(new int[]{-1, -1, -1, -1});
            throw new ImageBasedElemNotFound(standardizedImage);
        }

        setDimensions(res);
        return res;
    }

    public int[] waitAndFind(int startX, int endX, int startY, int endY, int millisToWaitFor, int timeoutInBetweenAttempts) {
        return waitAndFind(startX, endX, startY, endY, millisToWaitFor, timeoutInBetweenAttempts, 20);
    }

    public int[] waitAndFind(int startX, int endX, int startY, int endY, int millisToWaitFor, int timeoutInBetweenAttempts, int tolerance){
        long start = System.currentTimeMillis();
        do {
            try {
                return find(startX, endX, startY, endY, tolerance);
            } catch (ImageBasedElemNotFound ignored){}

            if (timeoutInBetweenAttempts > 0) {
                try {
                    Thread.sleep(timeoutInBetweenAttempts);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } while (System.currentTimeMillis() - start < millisToWaitFor);

        throw new ImageBasedElemNotFound(standardizedImage);
    }

    public int[] waitAndFind(int startX, int endX, int startY, int endY, int millisToWaitFor){
        return waitAndFind(startX, endX, startY, endY, millisToWaitFor, 0);
    }

    public int[] waitAndFind(int startX, int endX, int startY, int endY) {
        return waitAndFind(startX, endX, startY, endY, 10_000);
    }

    private int[] compareTargetToScreenshot(int startX, int endX, int startY, int endY) {
        return compareTargetToScreenshot(startX, endX, startY, endY, 20);
    }

    private int[] compareTargetToScreenshot(int startX, int endX, int startY, int endY, int tolerance){
        Size standardizedImageSize = standardizedImage.size();

        //default tmp screenshot relative path sans ".png"
        String tmpScreenshotFile = "tmp";
        String relTmpScreenshotFilePath = Machine.getCurrentDriverRootImageFolder() + tmpScreenshotFile + ".png";
        //init var
        Mat actualScreenshot = null;


        try {
            //get screenshot Mat object
            machine.takeScreenshot(tmpScreenshotFile);
            actualScreenshot = Imgcodecs.imread(relTmpScreenshotFilePath);

            if (startX == -1)
                startX = 0;
            if (startY == -1)
                startY = 0;
            if (endX == -1)
                endX = actualScreenshot.width();
            if (endY == -1)
                endY = actualScreenshot.height();

            if (endX - startX < standardizedImageSize.width ||
                    endY - startY < standardizedImageSize.height)
                throw new IllegalArgumentException(String.format("The passed coordinates are smaller than the image searched for, standardized image width: %f, height: %f",
                        standardizedImageSize.width, standardizedImageSize.height));

            if (DEBUG_IMAGE_COMPARISON)
                System.out.println("actualScreenshot.size() = " + actualScreenshot.size());

            //get cropped image
            Size size = actualScreenshot.size();
            if (startX > size.width ||
                    startY > size.height ||
                    endX > size.width ||
                    endY > size.height)
                throw new IllegalArgumentException("the passed coordinates for cropping are larger than the actual screenshot dimensions");

            actualScreenshot = CompareImages.getSubMat(actualScreenshot,
                    startX , endX, startY, endY);

            //debug
            if (DEBUG_IMAGE_COMPARISON) {
                File debuggingfolder = new File(Machine.getCurrentDriverRootImageFolder() + "debugging/");
                if (!debuggingfolder.exists())
                    debuggingfolder.mkdirs();
                //don't save more than 100 cropped images
                imageCounter = ++imageCounter % 100;
                Imgcodecs.imwrite(Machine.getCurrentDriverRootImageFolder() + "debugging/" + "tmpCropped" + imageCounter + ".png", actualScreenshot);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            //delete tmp
            if (!DEBUG_IMAGE_COMPARISON) {
                File tmpFile = new File(relTmpScreenshotFilePath);
                if (tmpFile.exists())
                    if (!tmpFile.delete())
                        System.out.println("FAILED TO DELETE TMP FILE FOR IMAGE COMPARISON");
            }
        }

        //compare
        return getCoordinates(actualScreenshot, startX, startY, tolerance);
    }

    public int[] getCoordinates(Mat actualScreenshot, int screenshotStartX, int screenshotStartY) {
        return getCoordinates(actualScreenshot, screenshotStartX, screenshotStartY, 1000);
    }

    public int[] getCoordinates(Mat actualScreenshot, int screenshotStartX, int screenshotStartY, int tolerance) {
        int[] loc = findFirstMatch(
                actualScreenshot,
                standardizedImage,
                1, 10, tolerance);

        if (loc != null) {
            //make start coordinates absolute from screenshot crop relative
            loc[0] += screenshotStartX;
            loc[1] += screenshotStartY;
        }

        return loc;
    }

    public static void setMachine(Machine machine) {
        ImageComparisonElem.machine = machine;
    }

    public static WebElement getDesktopElem(){
        //1
//        return machine.waitAndFind(By.name("Desktop 1"));
        //2 attempt to improve performance by storing the element if stale element exception encountered comment out //2 and uncomment //1
        if (FOUND_DESKTOP_ELEM == null)
            FOUND_DESKTOP_ELEM = machine.waitAndFind(DESKTOP_ELEM);

        return FOUND_DESKTOP_ELEM;
    }
}
