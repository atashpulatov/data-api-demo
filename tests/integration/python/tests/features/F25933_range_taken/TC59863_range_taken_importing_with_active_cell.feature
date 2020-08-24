@mac_chrome
Feature: F25933 - Range taken

  Scenario: [TC59863] - Importing objects with active cell
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "100_report"
      And I clicked Import button

     Then I closed all notifications

     When I selected cell "E4"
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I clicked Import button without checking results
      And I selected Active Cell option in Range Taken popup
      And I selected cell "P2"
      And I clicked OK button in Range Taken popup

     Then I closed all notifications

     When I selected worksheet number 1
      And I selected cell "F5"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I clicked Import button without checking results
      And I selected Active Cell option in Range Taken popup
      And I selected cell "W2"
      And I clicked OK button in Range Taken popup

     Then I closed all notifications

     When I selected worksheet number 1
      And I selected cell "H8"
      And I clicked Add Data button
      And I found and selected object "Dossier with basic grid vis, vis with totals and vis with crosstabs"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Grid visualisation with subtotals"
      And I clicked import dossier without waiting for results
      And I selected Active Cell option in Range Taken popup
      And I selected cell "AN1"
      And I clicked OK button in Range Taken popup

     Then I closed all notifications

      And I log out
