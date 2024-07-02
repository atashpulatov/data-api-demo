#@ci_pipeline_postmerge_windows_chrome
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part 4 - Import Compound Grid visualization with special structures
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Only one attribute in rows"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "A3" has value "Electronics"

     When I selected cell "C1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "attributes and metrics in rows"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["C5", "E9", "F13", "H14"] have values ["Books - Miscellaneous", "", "4181261.167", ""]

     When I selected cell "J1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 4
      And I selected visualization "empty columnSets"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "L9" has value "$3,149,663"

     When I selected cell "P1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "attribute in rows and only metrics in columnSets"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["Q1", "T1", "R6"] have values ["Subcategory", "Cost", "$811,787"]

      And I logged out
