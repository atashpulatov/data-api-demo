@mac_chrome
Feature: F21402 - Support for prompted reports while importing data for Excel add-in

  Scenario: [TC40359] - Navigation while importing prompted reports (Run, Back and Cancel buttons)
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found object by ID "6D70D06949B83CD9DBFAC0AF5FE0010E" and selected "Report with prompt - Object prompt | Required | Default answer"