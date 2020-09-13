@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC60014] - Single cell is taken
    Given I logged in as default user
      And I wrote text "abc" in cell "C1"
      And I selected cell "A1"

      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"

     When I clicked Import button without checking results
      And I clicked OK button in Range Taken popup
      And I waited for object to be refreshed successfully
      And I closed all notifications

     Then number of worksheets should be 2

      And I log out
