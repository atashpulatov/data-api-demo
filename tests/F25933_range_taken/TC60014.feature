@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC60014] - Single cell is taken 
    Given I logged in as default user
      And I wrote text "abc" in cell "C1"
      And I selected cell "A1"

      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found and selected object "100_report"
      And I clicked Import button only

      And I clicked OK button in Range Taken popup
      And number of worksheets should be 2

      And I log out