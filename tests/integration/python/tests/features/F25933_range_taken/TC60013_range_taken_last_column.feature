@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC60013] - Import at the last column/row
    Given I logged in as default user
    And I clicked Import Data button
    And MyLibrary Switch is OFF

    And I found and selected object "100_report"
    And I clicked Import button
    And I closed all notifications

    Then number of worksheets should be 1

    When I selected cell "N1"
    And I clicked Add Data button
    And I found and selected object "100_dataset"
    And I clicked Import button without checking results
    And I clicked OK button in Range Taken popup

    Then number of worksheets should be 2

    When I selected worksheet number 1
    And I selected cell "A101"
    And I clicked Add Data button
    And I found and selected object "100_dataset"
    And I clicked Import button without checking results
    And I selected cell "B102"
    And I selected Active Cell option in Range Taken popup
    And I clicked OK button in Range Taken popup

    Then I closed all notifications

    And I log out
