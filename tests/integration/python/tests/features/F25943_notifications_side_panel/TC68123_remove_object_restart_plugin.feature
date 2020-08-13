@mac_chrome
Feature: F25943 - Notifications side panel

  Scenario: [TC68123] - Removing the object and restarting plugin without closing notification
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "100_report"
      And I clicked Import button
      And I closed last notification

     When I removed object 1 using icon
      And I clicked close Add-in button
      And I clicked Add-in icon

     Then Right Panel is empty

      And I log out
