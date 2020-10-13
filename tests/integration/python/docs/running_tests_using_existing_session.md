# Running tests using existing application session

To speed-up writing tests, it's possible to run tests using already open `Excel` session (for both Desktop and browser). 

1. [Windows Desktop](#windows_desktop)
1. [Mac Desktop](#mac_desktop)
1. [Mac Chrome](#mac_chrome)

<a name="windows_desktop"></a>
### Windows Desktop

1. In `config.json` set:

    ```json
    "connect_to_existing_session_enabled": true,
    "cleanup_after_test_enabled": false,
    ```
    
1. Open `Excel` desktop application.

1. Make sure your Workbook is named as in `config.json`:
    ```json
    "windows_desktop_excel_root_element_name": "Book1 - Excel",
    ```

1. Go to the application state you would like to continue your work with. 

1. Run the test you're working on, starting from the step you need (comment out steps not needed now). Ensure test
starts from `Given` step (perhaps artificial), e.g. `Given I pass`.

<a name="mac_desktop"></a>
### Mac Desktop

1. In `config.json` set:

    ```json
    "connect_to_existing_session_enabled": true,
    "cleanup_after_test_enabled": false,
    ```
    
1. Open Excel Desktop application.

1. Go to the application state you would like to continue your work with. 

1. Run the test you're working on, starting from the step you need (comment out steps not needed now). Ensure test
starts from `Given` step (perhaps artificial), e.g. `Given I pass`.

<a name="mac_chrome"></a>
### Mac Chrome

###### I. Acquire execution url and session id

1. In `config.json` set:

    ```json
    "connect_to_existing_session_enabled": false,
    "cleanup_after_test_enabled": false,
    ```
    
1. Run first test with `--logging-level=WARNING` and log capturing disabled, e.g.:

    ```console
    behave --no-color --logging-level=WARNING --no-capture-stderr --no-logcapture tests/features/debug_features/empty.feature
    ```
 
1. Copy `session_id` and `execution_url` (should look like this):

    ```console
    WARNING:root:Starting WebDriver, execution_url: [http://127.0.0.1:59498], session_id: [d26e0c8f59db329bb2a75f9a85fbb93c]
    ```
    
1. Paste `session_id` and `execution_url` to `config.json`:

    ```json
    "browser_existing_session_executor_url": "http://127.0.0.1:59498",
    "browser_existing_session_id": "d26e0c8f59db329bb2a75f9a85fbb93c",
    ```

1. New browser session should stay open. 

###### II. Execute test

1. In `config.json` set:

    ```json
    "connect_to_existing_session_enabled": true,
    "cleanup_after_test_enabled": false,
    ```

1. Using open browser session, go to the application state you would like to continue your work with. 

1. Run the test you're working on, starting from the step you need (comment out steps not needed now). Ensure test
starts from `Given` step (perhaps artificial), e.g. `Given I pass`.

Tip 1:
```
All test cases start from the login step, make sure you prepared the Excel app to have
the AddIn opened. If you'd like to start from further step in the test, comment out steps
you don't want to execute.
```

Tip 2:
```
Test Scenario must start with a 'Given' step. When original first step is commented out
(e.g. Given I logged in as default user), it's necessary to add artifical 'Given' step, e.g.:

Given I pass
```
