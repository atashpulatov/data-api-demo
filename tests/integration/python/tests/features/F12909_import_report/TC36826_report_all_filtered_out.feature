@ci_pipeline_daily_windows_chrome  @ci_pipeline_daily_mac_chrome
@windows_desktop @windows_chrome @mac_chrome
Feature: F12909 - Import report

  Scenario: [TC36826] Importing report with all data filtered out
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "B570032611E94B25B9810080EF95B252" and selected "Report with All data filtered out"
     Then I clicked Import button and saw error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

      And I logged out
