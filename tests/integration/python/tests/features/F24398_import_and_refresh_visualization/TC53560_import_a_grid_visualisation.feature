@ci_pipeline_rv_windows_chrome
@ci_pipeline_rv_mac_chrome
@todo_windows_desktop
@mac_chrome
@windows_chrome
@release_validation
@ga_validation
Feature: F24398 - Import and refresh visualization

  Scenario: [TC53560] - Importing grid visualisations - basic scenario
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "7908177211E9DF8E76990080EFB5ACD2" and selected "Visualization manipulation"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I added dossier to Library if not yet added
      And I selected dossier page or chapter 1
      And I selected visualization "Visualization 1"
      And I selected dossier page or chapter 2
      And I selected visualization "Chart vis"
      And I created dossier bookmark "Test bookmark" if not exists
      And I selected dossier bookmark 1

      And I "increased" year filter value on dossier from "left" side
      And I verified that value for filter "Year" is "(2015 - 2016)"
      And I reset dossier
      And I verified that value for filter "Year" is "(2014 - 2015)"
      And I selected dossier page or chapter 2
      And I selected visualization "Chart vis"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["2014", "2015"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Visualization 1"
      And I selected "Total" in Show Totals for "Year" attribute for visualization "Visualization 1"
      And I selected Drill by "Item" for "Catalog" attribute for visualization "Visualization 1"
      And I selected Exclude for "2014" element in "Year" attribute for visualization "Visualization 1"
      And I selected "Year" in Replace With for "Item" attribute for visualization "Visualization 1"
      And I selected sort "Ascending" for "Profit" metric for visualization "Visualization 1"
      And I selected sort "Descending" for "Revenue" metric for visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["Total", "2015"]

     When I changed object 1 name to "Visualization-name" using icon
     Then I verified that object number 1 is called "Visualization-name"

     When I changed object 1 name to "Modified-visualization-name" using context menu
     Then I verified that object number 1 is called "Modified-visualization-name"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that object number 1 is called "Modified-visualization-name"
      And I verified that cells ["A2", "A3"] have values ["Total", "2015"]

     When I selected cell "F1"
      And I clicked Add Data button
      And I found object by ID "F806E5E811E9EFE33E340080EF65F66F" and selected "Dossier with basic grid vis, vis with totals and vis with crosstabs"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I opened Show Data panel for "Grid visualisation with subtotals"
      And I closed Show Data panel
      And I imported visualization "Grid visualisation with subtotals"
      And I closed last notification
     Then I verified that cells ["F2", "F3"] have values ["Total", "Al Hirschfeld"]
      And I verified that object number 1 is called "Grid visualisation with subtotals"

     When I removed object 1 using icon
      And I closed last notification
     Then I verified that cells ["F2", "F3"] have values ["", ""]

     When I removed object 1 using context menu
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["", ""]

      And I logged out

   #TODO upadte steps from rally
   