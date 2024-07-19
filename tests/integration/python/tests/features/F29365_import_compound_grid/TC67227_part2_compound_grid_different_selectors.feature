# @ci_pipeline_postmerge_windows_chrome 
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part2 - Import compound grid visualization with different selectors
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Kind of compound grids - Selector relationship"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "filter panel"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "F6" has value "$539,383"

     When I selected cell "H6"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Selector relationship"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "template selector"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "M8" has value "$480,173"

     When I selected cell "P1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Selector relationship"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "in-canvas selector: element"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "Q3" has value "$370,161"

     When I selected cell "X1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Selector relationship"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 6
      And I selected visualization "compound grid as source of the template selector"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "U3" has value "$480,173"

      And I logged out
