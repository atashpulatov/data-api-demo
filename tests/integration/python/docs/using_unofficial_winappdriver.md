# Using Unofficial WinAppDriver

This option has been created as a workaround when Microsoft WinAppDriver started having problems with logging page source.
Note that these configuration changes are for development purposes only and are not to be pushed to repository.

### Setting up

1. Download the driver from [https://github.com/licanhua/YWinAppDriver](https://github.com/licanhua/YWinAppDriver) and unpack it

2. Download and install [.Net Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet/thank-you/sdk-3.1.409-windows-x64-installer)

3. In `config.json` set:
    ```json
   "run_win_app_driver_enabled": false,
   "host_url_windows_desktop": "http://localhost:4723",
   ```

4. In `framework/driver/driver_windows_desktop.py` at line 43 add:

    ```python
    capabilities['attachToTopLevelWindowClassName'] = 'XLMAIN'
    capabilities['app'] = 'Root'
    ```

5. In `framework/util/debug_on_failure/page_source_on_failure.py` make sure that varaible `TAG_TO_FILE_EXTENSION_MAP` on line 63 looks like this:

    ```python
    TAG_TO_FILE_EXTENSION_MAP = {
    '<html': '.html',
    '<?xml': '.xml',
    '<Body': '.xml',
    'Error': '.txt'
    }
    ```

6.  Before starting a test run the `WinAppDriver.exe` from the zip file downloaded in step 1
