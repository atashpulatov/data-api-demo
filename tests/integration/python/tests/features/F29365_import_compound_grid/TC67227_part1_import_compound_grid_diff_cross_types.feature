@ci_pipeline_postmerge_windows_chrome 
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part 1 -Import compound grid visualization with different cross type
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Kind of compound grids - Cross type"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 2
      And I selected visualization "tabular"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["A1", "B2", "C3"] have values ["Category", "$2,070,816", "$4,289,603"]

     When I selected cell "F1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Cross type"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "crosstab"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["G1", "G2", "G3"] have values ["Books", "Art & Architecture", "370160.583"]

     When I selected cell "AG1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Cross type"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 4
      And I selected visualization "combination crosstab and tabular"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["AG2", "AH2", "AL3"] have values ["Subcategory", "Cost", "$480,173"]

      And I logged out
