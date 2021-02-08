# Adding a new test

To add a new test:

1. Add `.feature` test file written in [Gherkin](https://cucumber.io/docs/gherkin/reference/),
e.g. `tests/features/F25931_duplicate_object/TC64607_duplicate_object.feature`:

    ```gherkin
    @windows_desktop
    @windows_chrome
    @mac_desktop
    @mac_chrome
    Feature: F25931 - Duplicate object
    
      Scenario: [TC64607] - Duplicate object
        Given I logged in as default user
          And I clicked Import Data button
          And I ensured that MyLibrary Switch is OFF
    
          And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
          And I clicked Import button
          And I closed all notifications
          And number of worksheets should be 1
    
         When I clicked Duplicate on object 1
          And I clicked Import button in Duplicate popup
          And I closed last notification
    
         Then object number 1 should be called "100_report Copy"
          And number of worksheets should be 2
    
          And I logged out
    ```

1. Add all necessary Steps to steps files in `tests/steps`. Steps should correspond 1-1 to Pages, each set of steps
is related to one Page in tested application. Example of Steps file: `tests/steps/right_side_panel_tile_steps.py`:

    ```python
    from behave import *
    
    
    @step('I closed last notification')
    def step_impl(context):
        context.pages.right_panel_tile_page().close_last_notification_on_hover()

    ``` 

1. Implement all methods in appropriate Pages (e.g. `close_last_notification_on_hover()` in
`RightPanelTileWindowsDesktopPage`, `RightPanelTileBrowserPage` etc.) and ensure Pages are added to all Page Sets,
see `Adding a new Page`.
   

1. Add all necessary tags to your new test file. **Check here [full list of tags](list_of_tags.md).**
