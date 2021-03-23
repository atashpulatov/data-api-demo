@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC60014] - Single cell is taken
    Given I initialized Excel

     When I logged in as default user
      And I entered text "abc" into cell "C1" after selecting it
      And I selected cell "A1"

      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"

     When I clicked Import button without checking results
      And I clicked OK button in Range Taken popup
      And I waited for object to be imported successfully
      And I closed last notification

     Then I verified that number of worksheets is 2

      And I logged out
