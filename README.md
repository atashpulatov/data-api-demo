# python_test
(python_test - name to be changed ;) )

Tests are written in [Gherkin](https://cucumber.io/docs/gherkin/reference/) (natural-like language used by
[Cucumber](https://cucumber.io/) framework). In Python Gherkin tests are executed using
[behave](https://behave.readthedocs.io/en/latest/).

### Content of this README:

1. Prerequisites and installation
1. Running tests
1. TODO

README TODO:

- BDD https://en.wikipedia.org/wiki/Behavior-driven_development
- tests, Gherkin
- steps (use @step; not @given, @when, @then)
- pages, page object model
- driver factory, selecting driver
- sets of pages
- base pages, page utils
- pages factory, selecting set of pages
- utils
- stability issues, pause()
- performance
- preparing selectors
- image recognition, limitations
- configuration, chromedriver
- reuse in different projects
- attach to open Excel on Windows Desktop
- running in different environments, e.g. executing Python code on Mac, driving Windows Desktop using VirtualBox  

### 1. Prerequisites and installation

##### General

- Python3 installed and available in path.

##### General Windows

- Python venv environment created and activated:

```
cd PROJECT_DIR
python3 -m venv venv_win
venv_win\Scripts\Activate
```

- Python modules installed:

```
pip install selenium
pip install Appium-Python-Client
pip install behave
pip install Pillow
pip install opencv-python-headless
```

##### Windows Desktop

- Excel Add-In installed ([see details](https://www2.microstrategy.com/producthelp/Current/Office/en-us/Content/install_manually.htm))
- [WinAppDriver](https://github.com/Microsoft/WinAppDriver/releases) installed and running, e.g.:

```
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe"
```
or
```
"C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" 192.168.1.248 4723/wd/hub
```

##### General Mac

- Python venv environment created and activated:

```
cd PROJECT_DIR
python3 -m venv venv_mac
source venv_mac/bin/activate
```

- Python modules installed:

```
pip install selenium
pip install Appium-Python-Client
pip install behave
pip install Pillow
pip install opencv-python-headless
```

##### Mac Desktop

- Excel Add-In installed ([see details](https://microstrategy.atlassian.net/wiki/spaces/TECCLIENTS/pages/818920406/Guideline+-+How+to+create+a+new+environment+for+automation+and+manual+testing
))
- [AppiumForMac](https://github.com/appium/appium-for-mac/releases) (not Appium, e.g.
[see issue](https://github.com/appium/appium-for-mac/issues/82)) installed and running.

### 2. Running tests

#### Activate Python venv environment:

##### Windows

```
cd PROJECT_DIR
venv_win\Scripts\Activate
```

##### Mac

```
cd PROJECT_DIR
source venv_mac/bin/activate
```

#### Executing tests

```
# test single feature, Windows Desktop:
behave -D DRIVER_TYPE=windows_desktop tests/behave/F25931_duplicate_object/TC64607_duplicate_object.feature

# test single feature, Mac Chrome, no colors, verbose logging, all logs printed to console: 
behave -D DRIVER_TYPE=mac_chrome --tags=mac_chrome --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/behave/F25931_duplicate_object/TC64607_duplicate_object.feature

# test all features in F25931_duplicate_object directory, Mac Chrome, no colors, less verbose logging, all logs printed to console:
behave -D DRIVER_TYPE=mac_chrome --tags=mac_chrome --no-color --logging-level=WARNING --no-capture-stderr --no-logcapture tests/behave/F25931_duplicate_object/

# test all features, Mac Chrome, no colors, only steps related information and errors logged, all logs printed to console:
behave -D DRIVER_TYPE=mac_chrome --tags=mac_chrome --no-color --logging-level=ERROR --no-capture-stderr --no-logcapture tests/behave/
```

##### Important parameters

**-D DRIVER_TYPE=driver_name** specifies the target platform to execute test on (the driver to be used),
where **driver_name** is one of available driver types (see [driver_type.py](driver/driver_type.py)):

- windows_desktop
- windows_chrome
- mac_desktop
- mac_chrome

**--tags=tag_name**, specifies which tests to execute (only those tagged **@tag_name**), for simplicity use the same 
values as for **driver_name** (windows_desktop, windows_chrome, mac_desktop, mac_chrome) 

**--logging_level=level** specifies logging level, where level is:

- DEBUG
- WARNING
- ERROR

### 3. TODO

- change usage of send_keys as it's not stable on Windows Desktop (potentially in other environments too), 
sometimes some chars are not sent;
entered values can be checked using - Windows Desktop: element.text, Mac Chrome: element.get_attribute('value')
- Windows Desktop - each time search for "MicroStrategy for Office"?
- reporting
- executing tests by Jenkins
- re-executing failing tests
- parallel test execution 
- use assertions library instead of simple Python's assert?
- test 0 verifying required objects existence
