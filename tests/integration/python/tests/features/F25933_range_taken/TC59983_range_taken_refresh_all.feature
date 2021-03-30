@windows_desktop
@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC59983] - Refresh all objects
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I selected cell "P1"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I clicked Import button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I selected cell "AF1"
      And I clicked Add Data button
      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I removed 4 columns starting from column "AP"
      And I selected cell "AQ1"
      And I clicked Add Data button
      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications

     Then I verified that number of worksheets is 1

     When I refreshed all objects
      And I selected Active Cell option in Range Taken popup
      And I selected cell "BF1"
      And I clicked OK button in Range Taken popup
      And I closed all notifications

     Then I verified that number of worksheets is 1

      And I logged out
