@mac_chrome
Feature: F24398 - Import and refresh visualization

  Scenario: [TC53560] - Importing grid visualisations - basic scenario
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found and selected object "Dossier with vis that can be moved to different pages / chapters"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I added dossier to Library if not yet added
      And I selected visualization "Visualization 1"
      And I selected dossier page or chapter 4
      And I selected dossier page or chapter 3
      And I selected dossier bookmark 1
      And I "increased" year filter value on dossier from "left" side
      And I reset dossier
      And I selected visualization "Visualization 1"
     Then I clicked import dossier
      And I closed last notification

    Given I selected cell "H1"
      And I clicked Add Data button
      And I found and selected object "Visualization manipulation"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I selected "Total" in Show Totals for "Year" attribute
      And I selected sort "Ascending" for "Profit" metric
      And I selected sort "Descending" for "Revenue" metric
      And I selected Drill by "Category" for "Year" attribute
     Then I clicked import dossier
      And I closed last notification

    Given I changed object 1 name to "Visualization-name" using icon
      And I changed object 1 name to "Modified-visualization-name" using context menu
     Then I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification

    Given I selected cell "N1"
      And I clicked Add Data button
      And I found and selected object "Visualization manipulation"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I opened Show Data panel for "Visualization 1"
      And I closed Show Data panel

      And I imported visualization "Visualization 1"

     Then I removed object 1 using icon
      And I closed last notification
      And I removed object 1 using context menu
      And I closed last notification

      And I logged out
