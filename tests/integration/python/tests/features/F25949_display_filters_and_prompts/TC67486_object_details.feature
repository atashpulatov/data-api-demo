@mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67486] - Imported objects details showing,  hiding and updating
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      
      And I found and selected object "Prompted report with subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button

      And I ensure that Columns & Filters Selection is visible
      And I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

    Given I added a new worksheet
      And I clicked Add Data button
      And MyLibrary Switch is OFF

      And I found and selected object "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier
      And I imported visualization "Visualization 1"
      And I closed last notification

      And number of worksheets should be 2

      And I log out
