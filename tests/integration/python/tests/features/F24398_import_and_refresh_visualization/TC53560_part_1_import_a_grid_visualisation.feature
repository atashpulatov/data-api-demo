@ci_pipeline_postmerge_windows_chrome
Feature: F24398 - Import and refresh visualization

  Scenario: [TC53560] - Importing grid visualisations part 1 - basic scenario
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Visualization manipulation"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I added dossier to Library if not yet added
      And I selected dossier page or chapter 1
      And I selected visualization "Visualization 1"
      And I selected dossier page or chapter 3
      And I selected visualization "Chart vis"
      And I created dossier bookmark "Test bookmark" if not exists
      And I selected dossier bookmark 1
      And I "increased" year filter value on dossier from "left" side
     Then I verified that value for filter "Year" is "(2021 - 2022)"

     When I reset dossier
     Then I verified that value for filter "Year" is "(2020 - 2021)"

     When I selected dossier page or chapter 3
      And I selected visualization "Chart vis"
      And I selected import type "Import Data" and clicked import
      And I closed last notification
     Then I verified that cells ["A3", "B3"] have values ["2021", "$3,641"]

     When I clicked Edit object 1
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Visualization 1"
      And I selected "Total" in Show Totals for "Year" attribute for visualization "Visualization 1"
      And I selected Drill by "Item" for "Catalog" attribute for visualization "Visualization 1"
      And I selected Exclude for "2020" element in "Year" attribute for visualization "Visualization 1"

      And I selected "Year" in Replace With for "Item" attribute for visualization "Visualization 1"
      And I selected sort "Ascending" for "Profit" metric for visualization "Visualization 1"
      And I selected sort "Descending" for "Revenue" metric for visualization "Visualization 1"
      And I clicked "Import Data" button after Edit
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["Total", "2021"]

     When I changed object 1 name to "Visualization-name" using icon
     Then I verified that object number 1 is called "Visualization-name"

     When I changed object 1 name to "Modified-visualization-name" using context menu
     Then I verified that object number 1 is called "Modified-visualization-name"

     When I clicked Refresh on object 1
      And I closed last notification
     Then I verified that object number 1 is called "Modified-visualization-name"
      And I verified that cells ["A2", "A3"] have values ["Total", "2021"]
      And I logged out
