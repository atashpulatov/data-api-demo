@mac_chrome
@windows_chrome
Feature: F25933 - Range taken

  Scenario: [TC59978] - Refresh object
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications

     Then number of worksheets should be 1

     When I removed 4 columns starting from column "K"
      And I selected cell "L1"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I clicked Import button
      And I closed all notifications

     Then number of worksheets should be 1

     When I clicked Refresh on object 2
      And I clicked OK button in Range Taken popup
      And I waited for object to be refreshed successfully
      And I closed all notifications

     Then number of worksheets should be 2

      And I logged out
