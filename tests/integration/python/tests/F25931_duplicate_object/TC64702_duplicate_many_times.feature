@mac_chrome
@mac_desktop
Feature: F25931 - Duplicate object

  Scenario: [TC64702] - Duplicate object
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "100_report"
      And I clicked Import button
      And I closed all notifications
      And number of worksheets should be 1

     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed all notifications

     Then object number 1 should be called "100_report Copy"
      And number of worksheets should be 2

     When I clicked Duplicate on object 2
      And I clicked Import button in Duplicate popup
      And I closed all notifications

     Then object number 1 should be called "100_report Copy 2"
      And number of worksheets should be 3

     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed all notifications

     Then object number 1 should be called "100_report Copy 3"
      And number of worksheets should be 4

      And I log out

