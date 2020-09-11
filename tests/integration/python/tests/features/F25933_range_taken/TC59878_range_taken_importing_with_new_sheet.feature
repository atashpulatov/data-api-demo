@mac_chrome
@windows_chrome
Feature: F25933 - Range taken

  Scenario: [TC59878] - Importing objects with new sheet
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications

     Then number of worksheets should be 1

     When I selected cell "E4"
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I clicked Import button without checking results
      And I clicked OK button in Range Taken popup
      And I closed all notifications

     Then number of worksheets should be 2

     When I selected worksheet number 1
      And I selected cell "F5"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I clicked Import button without checking results
      And I clicked OK button in Range Taken popup

     Then number of worksheets should be 3

     When I selected worksheet number 1
      And I selected cell "H8"
      And I clicked Add Data button
      And I found and selected object "Dossier with basic grid vis, vis with totals and vis with crosstabs"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Grid visualisation with subtotals"
      And I clicked import dossier without waiting for results
      And I clicked OK button in Range Taken popup

     Then number of worksheets should be 4

      And I log out
