@windows_desktop
@windows_chrome
@mac_desktop
@mac_chrome
@ci
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

      And I log out
