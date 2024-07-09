Feature: F25933 - Range taken

  Scenario: [TC60014] - Single cell is taken
    Given I initialized Excel

     When I logged in as default user
      And I entered text "abc" into cell "C1" after selecting it
      And I selected cell "A1"

      And I clicked Import Data button
      
      And I found and selected object "100_report"

      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
    When I clicked Import with options button without checking results
      And I clicked OK button in Range Taken popup
      And I waited for object to be imported successfully
      And I closed last notification

     Then I verified that number of worksheets is 2

      And I logged out
