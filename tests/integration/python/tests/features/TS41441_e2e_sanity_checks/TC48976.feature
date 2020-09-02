@mac_chrome
Feature: TS41441 - Sanity checks

  Scenario: [TC48976] - Login | Privileges | Prepare Data Import | Rename | Refresh | Remove  | Sort on Prepare Data - Basic Functionality
    # Given I logged in as default user
    Given I wait 0
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found object "1,5M Sales Records.csv"
      And I cleared Search objects... field
      And I found and selected object "01 Basic Report"
      And I clicked Prepare Data button
