@release_validation @ga_validation
@mac_chrome
@windows_chrome
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75004] - [Panel Stack] E2E - Importing, Editing, Duplicating, Refreshing, Clear Data for Dossier with multiple pages and Panel Stack
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "6E803B546A48D2CC225C02A2FE0E9782" and selected "Multiple Pages with Panel Stack"
      And I clicked Import button to open Import Dossier
      And I selected dossier page or chapter 6

      And I selected panel stack "Panel 3"
      And I selected Visualization "Panel 3 Visualization 1"
      And I clicked import dossier
      And I waited for object to be imported successfully
     Then I verified that cells ["B2", "B9"] have values ["121.366", "93.909"]

     When I clicked Edit object 1
      And I selected dossier page or chapter 1
      And I selected panel stack "Panel 2"
      And I selected Visualization "Panel 2 Visualization 2"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["C2", "C17"] have values ["764322.7691", "3319224.515"]

     When I selected cell "H1"
      And I clicked Duplicate on object 1
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
      And I selected dossier page or chapter 6
      And I selected panel stack "Panel 2"
      And I selected Visualization "Panel 2 Visualization 1"
      And I clicked import dossier to duplicate
      And I waited for object to be duplicated successfully
      And I closed last notification
     Then I verified that cells ["K2", "H16", "K35"] have values ["163910.665", "Hollywood", "583537.5348"]
      And I verified that object number 1 is called "Panel 2 Visualization 1"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["K2", "H16", "K35"] have values ["163910.665", "Hollywood", "583537.5348"]

     When I clicked clear data
     Then I verified that cells ["B1", "B2", "H1", "H2"] have values ["Metrics", "", "Employee Last Name", ""]
      And I logged out

     When I logged in with username "Tim" and empty password
      And I clicked view data
      And I closed all notifications
     Then I verified that cells ["K2", "H16", "K35"] have values ["163910.665", "Hollywood", "583537.5348"]
      And I logged out
