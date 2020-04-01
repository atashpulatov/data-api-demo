# Windows Desktop Test Suite

Original Windows Desktop client test suite for the Excel add-in. 
The test suite has been extended to automate all client applications.

## Recordings
Recordings for the Excel add-in runs can be found in the following link:
Version 11.2.0100.22936: https://share.microstrategy.com/link/7Fn8gIUADMm2lx0svJxlbt

Frameworks utilized for interacting with client interfaces:
### Windows desktop client: 
1. WinAppDriver (Acccessiblity API based)
2. OpenCV (Image based)

### Mac desktop client:
1. AppiumForMac (Acccessiblity API based)
2. OpenCV (Image based)

### Browser clients:
1. Selenium (HTTP based)

Test cases that are take priority for maintenance can be found under the "mvp"(Minimal Viable Product) package. 
relative path: src/test/java/desktop/automation/functional/all/mvp

# Running tests from CLI
Standard Java maven surefire execution: 

to run the tests execute command at the test suite project root: mvn clean test

pass arguments for which test cases to execute:

-Dtest=\<tests\>, replace \<tests\> with desired test cases (e.g. -Dtest="desktop.automation.functional.maintained.**" -Dtest=LogInLogOutTests)

-DdriverType=\<driverType\>, replace \<driverType\> with desired DriverType enum value

-DbrowserType=\<browserType\>, replace \<browserType\> with desired BrowserType enum value 

# Intro:
## Element wrappers:
The test suite implements multiple elements with convenience instant methods for easier and cleaner test implementation, different interface unified handling and wrapping the multiple objects across the SUT so that refactoring and updating the method calls can be handled in a single place

### AnyInterfaceElement
highest level element wrapper. Interface that at the time of writing has four methods:
1.	void click(); - method to click the element in any manner
2.	void clickExplicitlyByActionClass(); - method to click the element explicitly by utilizing the Actions class.
3.	void sendKeys(CharSequence... input); - method to sendKeys to the element in any manner
4.	String getText(); - get text of the element. In case of ImageComparisonElem that implements the interface the method throws the RuntimeException with the message: “Not Implemented”
In order to support calling certain Machine object methods or objects, the ImageComparisonElem and WebDriverElemWrapper classes implement the static setMachine() method to set the machine on initialization.

### ImageComparisonElem
implements AnyInterfaceElement  interface. Element for finding and interacting with an image based element. The object utilizes the imageComparison.jar dependency found under /lib folder in the project, which is built on top of OpenCV open source project for image comparison. The ImageComparisonElem has a few constructors for initialization convenience:
1.	ImageComparisonElem(String imageFile, int startX, int endX, int startY, int endY)  - 
The most utilized contructor for object initialization. This method takes a relative path of the object found under folder defined in Machine.rootImageFolder field and searches for it in the given screen coordinates. The constructor looks for the image for 10 seconds. Throws ImageBasedElemNotFound exception if image not found.
2.	ImageComparisonElem(String[] imageFiles, int startX, int endX, int startY, int endY) – 
Same as ImageComparisonElem(String imageFile, int startX, int endX, int startY, int endY), only takes an array of images and looks for the given images iteratively until timeout reached. The constructor looks for the images for 10 seconds. Throws ImageBasedElemNotFound exception if image not found.
3.	ImageComparisonElem(String imageFile, int startX, int endX, int startY, int endY, int millisToWaitFor) - This method takes a relative path of the object found under folder defined in Machine.rootImageFolder field and searches for it in the given screen coordinates. The constructor looks for the image for milliseconds set in millisToWaitFor parameter. Throws ImageBasedElemNotFound exception if image not found.
4.	ImageComparisonElem(String[] imageFiles, int startX, int endX, int startY, int endY, int millisToWaitFor) - Same as ImageComparisonElem(String imageFile, int startX, int endX, int startY, int endY, int millisToWaitFor), only takes an array of images and looks for the given images iteratively until timeout reached. The constructor looks for the images for milliseconds set in millisToWaitFor parameter. Throws ImageBasedElemNotFound exception if image not found.
5.	ImageComparisonElem(String imageFile) – at the time of writing the method is never called in the test suite, but allows to simply pass an image file relative to the folder define under Machine.rootImageFolder  and search the whole screen for the image.
Whenever any of the constructors are called it will straight away look for the image and if found update the location (x, y) and dimension (width, height) instance variables, later the AnyInterfaceElement, click(), clickExplicitlyByActionClass(), sendKeys() methods can be called to allow the user to interact with the element. The getText() method is not implemented.

If desired the methods 
1.	find()
2.	find(WebElement element)
3.	find(int startX, int endX, int startY, int endY)
4.	waitAndFind(int startX, int endX, int startY, int endY, int millisToWaitFor, int timeoutInBetweenAttempts)
5.	waitAndFind(int startX, int endX, int startY, int endY, int millisToWaitFor)
6.	waitAndFind(int startX, int endX, int startY, int endY)

can be called to find the object again and update the coordinates of the element immediately with find or within a given timeframe with waitAndFind methods.

### WebDriverElemWrapper 
implements AnyInterfaceElement  interface. The object simply  wraps the WebElement object returned from the Selenium driver and implements all of the AnyInterfaceElement  interface methods as well as allows to get the original WebElement object by calling getDriverElement() method. 

## Machine wrappers:
### Machine class
is the abstract class that wraps the Selenium driver that the test suite is executing against. It has helper methods created for more efficient test logic creation and it stores the page objects that can be called with getter methods to interact with the SUT.

The notable mention is that the object has instance variables for WebDriverWaits that are named as follows:
•	QUARTER_UNIT
•	HALF_UNIT
•	ONE_UNIT
•	TWO_UNITS
•	FOUR_UNITS
•	SIX_UNITS
•	TWELVE_UNITS
One unit corresponds to the seconds int value set when initializing the driver. For example, when initializing the Mac desktop driver the one unit value is set to 10, meaning ten seconds. HALF_UNIT would therefor be 5 seconds, FOUR_UNITS would be 40 seconds. The test suite then uses these WebDriverWaits, when calling waitAndFind methods, and can be called be retrieved from the Machine object as public instance variables.

The WindowsMachine and MacMachine extend the Machine abstract class and implement the relevant abstract methods.
One exceptionally important method in the class is 
getImageComparisonElemFallBackToWebDriver – the method calls returns an AnyInterfaceElement that can be located by an image and in case the image recognition fails then a fallback call to the webdriver based selector method is made and once the element is found the previous passed image is overwritten and by the newly captured screenshot. 
This method is highly important for the Windows desktop client automation, where the webdriver is slow, but reliable and the image recognition fails after some time due to the GUI nodes rendering with slightly different fonts and font styles on a regular basis.

## Base classes:
### BaseTests 
the class implements is for implementation of any shared methods across the different classes only no test hooks should be present in the BaseTests class. At the time of writing the only methods implemented in the class is Machine getMachine(DriverType driverType) method for initializing a Machine object for test execution by desired driver type.

### BaseCommonTests
the class implements the set up and tear down hooks for getting to the SUT. 

getToSUT() - opens up the client application (Microsoft Excel for Mac, Microsoft Excel, browser) opens a new blank workbook and opens the add-in starting at the Login task pane.
handleTearDown() – method closes the workbook or application based on the test case.

### BaseLoggedInTests 
the class extends the BaseCommonTests and simply gets to the SUT and logs in to the application if user is logged out.
getToSUTAndLogIn() – get to SUT and log in to the add-in with default user “a”.


## ConfigVars:
The class encapsulates the configuration for the test suite and stored as a Java class allows for compile time error checking.

1.	SKIP_STANDARD_INITIALIZATION_AND_TEAR_DOWN – flag turns off set up and tear down hooks when executing test cases. Very useful for debugging
2.	DEBUG_IMAGE_COMPARISON – stores up to 100 cropped screenshot images, screenshot and paths to files when set to true
3.	DESIRED_DRIVER_TYPE – Enum for selecting the driver that is desired for execution
4.	WINDOWS_REMOTE_HOST – windows machine remote host URL, if set to localhost, runs locally
5.	UTILIZE_INDEX_IMAGE_BASED_PREPARE_DATA_HELPER – flag for Windows automation specifically. Allows to utilize remembered prepare data checkbox coordinates for quicker test execution. At the time of writing implementation full implementation in-progress
6.	RECORD_TEST_CASE– Windows specific. Starts PowerPoint and records the screen for each test case. Not maintained.

## Helpers:
### ImportPrepareDataHelper:
Highly utilized class across the test suite. Encapsulates the logic from opening the “Import Data” popup to importing the object to the workbook. Either by simple import or by prepare data flow. Utilized as well for editing imported objects. 

The methods in the class also interact with non-SUT functionality of going to the specified cell and specified Excel sheet provided the sheet is present.

The following methods are implemented for convenience in test execution:
1.	importObject – imports an object without prepare data from the moment the “Add Data” or “Import Data” button is present to “Data successfully loaded” imported notification present. Method cuts down on assertions to improve over all test execution performance.
2.	importWithPrepareDataSimple - imports an object with prepare data from the moment the “Add Data” or “Import Data” button is present to “Data successfully loaded” imported notification is present. Method cuts down on assertions to improve over all test execution performance.
3.	prepareDataWithoutImportingSimple – method goes through prepare data flow from the moment the “Prepare Data” popup is present to all data selected before importing. Method cuts down on assertions to improve over all test execution performance.
4.	prepareDataSimple – method calls “prepareDataWithoutImportingSimple” method and after send click command to “Import” button in “Prepare Data” popup and waits for “Data successfully loaded” or “Report/Dataset refreshed” notification present.
5.	importWithPrepareDataElaborate – same as importWithPrepareDataSimple, but with elaborated assertions. Method currently requires maintenance.
6.	prepareDataElaborate – same as prepareDataSimple, but with elaborated assertions. Method currently requires maintenance.
7.	selectObjectToImportSimple – select the object for import. Starting from “Import Data” or “Add Data” button present to object selected in “Import Data” popup. Method cuts down on assertions to improve over all test execution performance.
8.	selectObjectToImportElaborate - same as selectObjectToImportSimple, but with elaborated assertions. Method currently requires maintenance.
9.	initPrepareDataSimpleIndexAndImageBased – Windows specific method found in class ImportPrepareDataHelperWindowsMachine. The method foes through prepare data flow once on initialization to take screenshots of Filter value “(All)” checkbox when it’s unchecked, checke, partially checked and stores the indexes and there differences in y axis for the different “Prepare Data” popup column checkboxes.
10.	handleImportProcess – method asserts the handling of import of an object.

### ImportPrepareDataHelperArguments:
Helper class that encapsulates the arguments for ImportPrepareDataHelper class static method calls. Highly utilized

Machine machine – passed machine object to interact with
String cell – excel workbook cell to go to before import method calls are made
int sheetIndex – sheet index in workbook to go to
Boolean isFirstImport – flag that determines whether to get the “Add Data” or “Import Data” button, if set to null, the method looks first for “Add Data” button and if not found within machine.ONE_UNIT defined timeout, then looks for “Import Data” button.
boolean isDataset – flag to determine if is dataset and calls the appropriate assertions during method call
boolean isMyLibrarySwitchOn – flag for whether the “My Library” switch should stay on when going through the “Import Data” button. For example, if set to false and the switch is on when “Import Data” popup opens then the switch is clicked to set it to off.
String objectName – name of object to work with.

int[] attributesToChoose – for prepare data flow, specifies what attributes and in what are order are expected to be clicked. -1 means (All) flag.
int[] metricsToChoose – for prepare data flow, specifies what metrics and in what are order are expected to be clicked. -1 means (All) flag.
FilterAndValues[] filtersAndValuesToChoose – for prepare data flow, specifies what filters and filter values and in what order are expected to be clicked. -1 means (All) flag for filter values.

boolean isEditFlow – specifies whether the arguments object will be passed in edit flow call.

# Set up:
## Windows Desktop:
TODO
Brief overview is:
1. Install JDK 1.8
2. Install Maven
3. Install WinAppDriver
3. (Optionally) install IntelliJ IDEA
4. (Optionally) install Windows developer SDK (for Inspect.exe)
5. Set DPI to 125 % (Image recognition written against a Dell Latitude E5470)
6. Run "mvn clean" first time before running the test suite to build the local imageRecognition dependency

## Mac Desktop:
TODO
Brief overview is:
1. Install JDK 1.8
2. Install Maven
3. Install AppiumForMac
4. (Optionally) install IntelliJ IDEA
5. (Optionally) install xcode (for Accessibility Inspector)
6. with brew build opencv and update the .dylib under libs in the project. CLI commands:
    1. brew edit opencv
    2. set -DBUILD_opencv_java=ON
    3. brew install --build-from-source opencv
7. Run "mvn clean" first time before running the test suite to build the local imageRecognition dependency
  

# Other
Old Mac desktop automation test suite:
https://github.microstrategy.com/dtamosiunas/MacDesktopTestSuite
