@ci_pipeline_postmerge_windows_chrome
Feature: F24398 - Import and refresh visualization

  Scenario: [TC53560] - Importing grid visualisations part 2- basic scenario
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Dossier with basic grid vis, vis with totals and vis with crosstabs"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I opened Show Data panel for "Grid visualisation with subtotals and crosstabs"
      And I closed Show Data panel
      And I selected visualization "Grid visualisation with subtotals and crosstabs"
      And I selected import type "Import Data" and clicked import
      And I hover over import successfull message
     Then I verified that cells ["F2", "F3"] have values ["Cost", "$7,253,683"]

     When I selected cell "Z1"
      And I clicked Add Data button
      And I found and selected object "This is a very long name for a dossier so that we can test how we display long path to dossier visualisations"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "This is a very long name for a visualisation so that we can test how we display long name."
      And I selected import type "Import Data" and clicked import
      And I hover over import successfull message
     Then I verified that cells ["Z2", "Z3"] have values ["Winter 2011", "Winter 2011"]
      And I verified that path name for object number 1 displays "This is a very long name for a dossier so that we can test how we display long path to dossier visualisations > This is a very long name for a visualisation so that we can test how we display long name. > This is a very long name for a visualisation so that we can test how we display long name."

     When I selected cell "AE1"
      And I clicked Add Data button
      And I found and selected object "Dossier with compound grid"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I selected import type "Import Data" and clicked import
      And I hover over import successfull message
     Then I verified that cells ["AE2", "AE3"] have values ["Atlanta", "San Diego"]

     When I selected cell "AI1"
      And I clicked Add Data button
      And I found and selected object "Prompted dossier"
      And I clicked Import button to open Import Dossier
      And I clicked Run button for prompted dossier if prompts not already answered
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"
      And I selected import type "Import Data" and clicked import
      And I hover over import successfull message
     Then I verified that cells ["AI2", "AI3"] have values ["2020 Q1", "2020 Q1"]

     When I selected cell "AN1"
      And I clicked Add Data button
      And I found and selected object "Dossier with different custom visualizations"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "D3 WorldCloud"
      And I selected import type "Import Data" and clicked import
      And I hover over import successfull message
     Then I verified that cells ["AN2", "AN3"] have values ["USA", "Web"]

     When I selected cell "AR1"
      And I clicked Add Data button
      And I found and selected object "Dossier with different custom visualizations"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Google Timeline"
      And I selected import type "Import Data" and clicked import
      And I hover over import successfull message
     Then I verified that cells ["AR2", "AR3"] have values ["Books", "Books"]

     When I selected cell "AX1"
      And I clicked Add Data button
      And I found and selected object "Dossier with different custom visualizations"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Sequence Sunburst"
      And I selected import type "Import Data" and clicked import
      And I hover over import successfull message
     Then I verified that cells ["AX2", "AX3"] have values ["Books", "Electronics"]

     When I removed object 1 using context menu
      And I closed last notification
     Then I verified that cells ["AX2", "AX3"] have values ["", ""]

      And I logged out
