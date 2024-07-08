#@ci_pipeline_postmerge_windows_chrome
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75004] - [Panel Stack] E2E - Importing, Editing, Duplicating, Refreshing, Clear Data for Dossier with multiple pages and Panel Stack
   Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button

      And I found and selected object "Dossier with multiple Panel stacks, pages, chapters"
      And I clicked Import button to open Import Dossier
      And I selected dossier page or chapter 3

      And I selected panel stack "Panel 2"
      And I selected Visualization "Grid visualization on panel stack 2"
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B2", "B9"] have values ["GARDENA", "TAMPA"]

     When I clicked Edit object 1
      And I selected dossier page or chapter 1
      And I selected panel stack "Panel 3"
      And I selected Visualization "Pie chart on a panel stack"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["A1", "B1", "A20", "B20"] have values ["WEEK", "WEEKS OF COVER", "7/31/2011", "107"]

     When I selected cell "H1"
      And I clicked Duplicate on object 1
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
      And I selected dossier page or chapter 5
      And I selected panel stack "Panel 1"
      And I selected Visualization "Line chart on Panel stack 3"
      And I clicked import dossier to duplicate
      And I waited for object to be duplicated successfully
      And I closed last notification
     Then I verified that cells ["H1", "I20", "J20"] have values ["WEEK", "5564", "1935.99024"]
      And I verified that object number 1 is called "Line chart on Panel stack 3"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["H1", "I20", "J20"] have values ["WEEK", "5564", "1935.99024"]

     When I clicked clear data
     Then I verified that cells ["A1", "B1", "H2", "B20"] have values ["WEEK", "WEEKS OF COVER", "", ""]
      And I logged out

     When I logged in with username "Tim" and empty password
      And I clicked view data
      And I closed all notifications
     Then I verified that cells ["A1", "B1", "A20", "B20"] have values ["WEEK", "WEEKS OF COVER", "7/31/2011", "107"]
      And I logged out
