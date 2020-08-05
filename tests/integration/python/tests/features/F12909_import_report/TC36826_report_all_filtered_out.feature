@mac_chrome
Feature: F12909 - Import report

  Scenario: [TC36826] Importing report with all data filtered out
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "Report with All data filtered out"
     Then I clicked Import button and see error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

      And I log out
