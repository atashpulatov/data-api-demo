Feature: F25933 - Range taken

  Scenario: [TC60145] - E2E
    Given I initialized Excel
    When I logged in as default user
    And I clicked Import Data button
    
    And I found and selected object "100_report"
    And I verified that Import with dropdown button is enabled
    And I clicked Import dropdown button
    And I verified that "Import Data" item in Import dropdown is enabled
    And I selected "Import Data" item in Import dropdown
    And I clicked Import with dropdown button
    And I closed all notifications
    Then I verified that number of worksheets is 1
    When I selected cell "E4"
    And I clicked Add Data button
    And I found and selected object "Category Performance Dataset"
    And I verified that Import with dropdown button is enabled
    And I clicked Import dropdown button
    And I verified that "Import Data" item in Import dropdown is enabled
    And I selected "Import Data" item in Import dropdown
    And I clicked Import with dropdown button without checking results
    When I selected cell "B102"
    And I selected Active Cell option in Range Taken popup
    And I clicked OK button in Range Taken popup
    Then I verified that number of worksheets is 1
    And I logged out
