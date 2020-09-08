@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC60145] - E2E
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications

     Then number of worksheets should be 1

     When I selected cell "E4"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I clicked Import button without checking results

     When I selected cell "B102"
      And I selected Active Cell option in Range Taken popup
      And I clicked OK button in Range Taken popup

     Then number of worksheets should be 1

      And I log out
