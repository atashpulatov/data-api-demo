#@ci_pipeline_daily_windows_desktop @ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@ci_pipeline_rv_windows_desktop @ci_pipeline_rv_windows_chrome
@ci_pipeline_rv_mac_chrome
@disabled_windows_desktop @disabled_windows_chrome @mac_chrome
@release_validation @ga_validation
Feature: F24398 - Import and refresh visualization

  Scenario: [TC53560] - Importing grid visualisations - basic scenario
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
     Then I verified that value for filter "Year" is "(2015 - 2016)"

     When I reset dossier
     Then I verified that value for filter "Year" is "(2014 - 2015)"

     When I selected dossier page or chapter 3
      And I selected visualization "Chart vis"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cells ["A2", "A3"] have values ["2020", "2021"]

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
      And I found and selected object "Dossier with basic grid vis, vis with totals and vis with crosstabs"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I opened Show Data panel for "Grid visualisation with subtotals and crosstabs"
      And I closed Show Data panel
      And I imported visualization "Grid visualisation with subtotals and crosstabs"
      And I closed last notification
     Then I verified that cells ["F2", "F3"] have values ["Metrics", "Brand"]

     When I selected cell "Z1"
      And I clicked Add Data button
      And I clicked Filters button
      And I clicked Application "MicroStrategy Tutorial"
      And I found and selected object "This is a very long name for a dossier so that we can test how we display long path to dossier visualisations"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "This is a very long name for a visualisation so that we can test how we display long name."
      And I closed last notification
     Then I verified that cells ["Z2", "Z3"] have values ["Winter 2011", "Winter 2011"]
      And I verified that path name for object number 1 displays "This is a very long name for a dossier so that we can test how we display long path to dossier visualisations > This is a very long name for a visualisation so that we can test how we display long name. > This is a very long name for a visualisation so that we can test how we display long name."

     When I selected cell "AE1"
      And I clicked Add Data button
      And I found and selected object "Dossier with compound grid"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "Visualization 1"
      And I closed last notification
     Then I verified that cells ["AE2", "AE3"] have values ["Atlanta", "San Diego"]

     When I selected cell "AI1"
      And I clicked Add Data button
      And I found and selected object "A_Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I waited for dossier to load successfully
      And I imported visualization "Visualization 1"
      And I closed last notification
     Then I verified that cells ["AI2", "AI3"] have values ["2014 Q1", "2014 Q1"]

     When I selected cell "AN1"
      And I clicked Add Data button
      And I found and selected object "Dossier with different custom visualizations"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "D3 WorldCloud"
      And I closed last notification
     Then I verified that cells ["AN2", "AN3"] have values ["USA", "Web"]

     When I selected cell "AR1"
      And I clicked Add Data button
      And I found and selected object "Dossier with different custom visualizations"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "Google Timeline"
      And I closed last notification
     Then I verified that cells ["AR2", "AR3"] have values ["Books", "Books"]

     When I selected cell "AX1"
      And I clicked Add Data button
      And I found and selected object "Dossier with different custom visualizations"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "Sequence Sunburst"
      And I closed last notification
     Then I verified that cells ["AX2", "AX3"] have values ["Books", "Electronics"]

     When I removed object 1 using icon
      And I closed last notification
     Then I verified that cells ["AX2", "AX3"] have values ["", ""]

      And I logged out
