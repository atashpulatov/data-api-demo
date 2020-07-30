# Running tests

**Check [Installation](installation.md) before running tests.** 

1. [Preparation](#preparation)
1. [Running tests](#running_tests)
1. [Test executing parameters](#test_executing_parameters)

<a name="preparation"></a>
### 1. Preparation

#### Windows Desktop - single machine

1. Open first `cmd` window as Administrator and run `WinAppDriver`:

    ```console
    "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" 127.0.0.1 4723/wd/hub
    ```

1. Open second `cmd` window or console in your IDE and activate Python environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    venv_win\Scripts\Activate
    ```

1. Ensure in `config.json` (or as command line parameters) you have:

   - `driver_type` set to `windows_desktop` 
   - `driver_path_windows_desktop` set to path to `Excel`
   - `host_url_windows_desktop` set to `http://127.0.0.1:4723/wd/hub`
   - `excel_add_in_environment` and `excel_desktop_add_in_import_data_name` set to the ones you deployed on `Excel`
   desktop for Windows

1. Execute tests (in second window, see [Running tests](#running_tests))

### Windows Chrome browser - single machine

1. Open `cmd` window or console in your IDE and activate Python environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    venv_win\Scripts\Activate
    ```

1. Ensure `driver_type` is set to `windows_chrome` in `config.json` or as a command line parameter.

1. Execute tests (see [Running tests](#running_tests))

### Mac Desktop - single machine

1. Run `AppiumForMac`.

1. Open terminal window or console in your IDE and activate Python environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    source venv_mac/bin/activate
    ```

1. Ensure `driver_type` is set to `mac_desktop` in `config.json` or as a command line parameter.

1. Execute tests (see [Running tests](#running_tests))

### Mac Chrome browser - single machine

1. Open terminal window or console in your IDE and activate Python environment:
    
    ```console
    cd PROJECT_DIR/tests/integration/python
    source venv_mac/bin/activate
    ```

1. Ensure `driver_type` is set to `mac_chrome` in `config.json` or as a command line parameter.

1. Execute tests (see [Running tests](#running_tests))

### Starting tests on Mac and executing them on remote Windows Desktop

##### On Windows:

1. When using **PyTTy** configuration: open previously configured PuTTy session
(see [Starting tests on Mac and executing them on remote Windows Desktop](installation#start_on_mac_execute_on_windows))
and login into your Mac machine (no need to do it when using firewall configuration).

1. Open `cmd` window as Administrator and run `WinAppDriver`:

    PuTTy configuration:

    ```console
    "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" 127.0.0.1 4723/wd/hub
    ```

    Windows Desktop firewall configuration:

    ```console
    "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" IP_ADDRESS_OF_WINDOWS_IN_LOCAL_NETWORK 4723/wd/hub
    ```

    **Tips:** 
    
    You can check IP_ADDRESS_OF_WINDOWS_IN_LOCAL_NETWORK by executing `ipconfig` from `cmd`.

    If you can't connect, please check if path to the `WinAppDriver.exe` is correct.

##### On Mac:

1. Open terminal window or console in your IDE and activate Python environment:

    ```console
    cd PROJECT_DIR/tests/integration/python
    source venv_mac/bin/activate
    ```
1. Ensure `driver_type` is set to `windows_desktop` in `config.json` or as a command line parameter.

1. Ensure in `config.json` (or as command line parameters) you have:

   - `driver_type` set to `windows_desktop` 
   - `driver_path_windows_desktop` set to path to `Excel` on your Windows machine
   - `host_url_windows_desktop` to `http://IP_ADDRESS_OF_WINDOWS_IN_LOCAL_NETWORK:4723/wd/hub`
   (firewall configuration), or
   - `host_url_windows_desktop` to `http://127.0.0.1:4723/wd/hub` (PuTTy configuration)
   - `excel_add_in_environment` and `excel_desktop_add_in_import_data_name` set to the ones you deployed on `Excel`
   desktop for Windows

1. Execute tests (see [Running tests](#running_tests))

<a name="#running_tests"></a>    
### 2. Running tests

Examples of running tests (check [Test execution parameters](#test_executing_parameters)):

```bash
# test single feature, default logging:
behave tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test single feature, verbose logging:
behave --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test single feature, verbose logging, redircting logs to files:
behave --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/TC64607_duplicate_object.feature 2>> log.err.txt | tee log.out.txt

# test single feature, no colors, verbose logging, all logs printed to console: 
behave --tags=@mac_chrome --no-color --logging-level=DEBUG --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/TC64607_duplicate_object.feature

# test all features in F25931_duplicate_object directory, Mac Chrome, no colors, less verbose logging, all logs printed to console:
behave --tags=@mac_chrome --no-color --logging-level=WARNING --no-capture-stderr --no-logcapture tests/F25931_duplicate_object/

# test all features, no colors, only steps related information and errors logged, all logs printed to console:
behave --tags=@mac_chrome --no-color --logging-level=ERROR --no-capture-stderr --no-logcapture tests/
```

<a name="test_executing_parameters"></a>
### 3. Test execution parameters

All custom parameters values can be defined in [config.json](config/config.json) file or as `behave` command options
(specified using `-D`, takes precedence over configuration file). For complete list of available custom parameters see
[config.json](config/config.json).

For `behave` options (no `-D` flag) see [behave documentation](https://behave.readthedocs.io/en/latest/).

`-D driver_type=driver_name` specifies the target platform to execute test on (the driver to be used),
where `driver_name` is one of available driver types (see [driver_type.py](driver/driver_type.py)):

- windows_desktop
- windows_chrome
- mac_desktop
- mac_chrome

`--tags=@tag_name`, specifies which tests to execute (only those tagged `@tag_name`), for simplicity use the same 
values as for `driver_name` (`@windows_desktop`, `@windows_chrome`, `@mac_desktop`, `@mac_chrome`).

Tags related to selecting tests for different tasks (e.g. release or GA validation, CI execution) are going to be
added, e.g. @release_validation. To execute only tests tagged @windows_desktop AND @release_validation use `--tags`
multiple times:

`--tags=@windows --tags=@release_validation`.

`-D image_recognition_enabled=True` enables (`True`) or disables (`False`) usage of image recognition to speed up
tests execution. Works only when implemented for selected driver (see `-D driver_type`), currently only
`windows_desktop`. 

`-D connect_to_existing_session_enabled=True` enables (`True`) or disables (`False`) attaching to an existing Excel
or session. Speeds up tests development allowing to e.g. skip first part of the test (see: Running tests using existing
application session).

`-D browser_existing_session_executor_url=url` specifies `url` address used when attaching to an existing browser
session (see: Running tests using existing application session).

`-D browser_existing_session_id=session_id` specifies `session_id` address used when attaching to an existing browser
session (see: Running tests using existing application session).

`-D windows_desktop_excel_root_element_name=root_element_name` specifies Windows Desktop root Excel element name
(e.g. `Book1 - Excel`) (see: Running tests using existing application session).

`-D cleanup_after_test_enabled=True` enables (`True`) or disables (`False`) cleaning up after test execution (closing
Excel or browser). Useful for debug purposes when developing tests.

`-D driver_path_windows_desktop=path` specifies `path` to Excel for Windows Desktop.

`-D driver_path_windows_chrome=path` specifies `path` to `chromiumdriver.exe` for Windows Desktop.

`-D driver_path_mac_chrome=path` specifies `path` to `chromiumdriver` for Mac Desktop.

`-D host_url_mac_desktop=url` specifies `url` to running `AppiumForMac`, used when executing tests on Mac Desktop.

`-D host_url_windows_desktop=url` specifies `url` to running `WinAppDriver`, used when executing tests
on Windows Desktop.

`-D excel_add_in_environment=environemnt` specifies `environemnt` name used to select which Excel Add In should be
started. Used on Windows Desktop and Mac Desktop.

`-D excel_desktop_add_in_import_data_name=import_name` specifies `import_name` string used when choosing which
Excel Add In should be started. Used in browsers.

`-D excel_user_name=user_name` specifies `user_name` used when logging in to Excel in browser.
 
`-D excel_user_password=user_password` specifies `user_password` used when logging in to Excel in browser. 

`--logging_level=level` specifies logging level, where `level` is:

- DEBUG _(the most verbose)_
- WARNING _(somehow verbose)_
- ERROR _(almost quiet, only errors)_

`--no-skipped` disables printing skipped steps (due to tags).

`--no-color` disables the use of ANSI color escapes.

`--no-logcapture` disables logging capture.

`--no-capture-stderr` disables capturing stderr (any stderr output will be printed immediately).

`--format allure_behave.formatter:AllureFormatter` configures formatting tests results for reporting with Allure.

`-o folder/` specifies tests results output folder when formatting is configured for using Allure.  
