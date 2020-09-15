@mac_chrome
@windows_chrome
Feature: F25943 - Notifications side panel

  Scenario: [TC68123] - Removing the object and restarting plugin without closing notification
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed last notification

     When I removed object 1 using icon
      And I clicked close Add-in button
      And I clicked Add-in icon

     Then Right Panel is empty

      And I log out
