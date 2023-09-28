#@ci_pipeline_daily_windows_desktop @ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_desktop @ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@windows_desktop @windows_chrome @mac_chrome
@release_validation @ga_validation
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part2 - Import compound grid visualization with different selectors
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Kind of compound grids - Selector relationship"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "filter panel"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "F7" has value "$539,383"

     When I selected cell "H6"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Selector relationship"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "template selector"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "M9" has value "$480,173"

     When I selected cell "P1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Selector relationship"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "in-canvas selector: element"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "Q4" has value "$370,161"

     When I selected cell "X1"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Selector relationship"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 6
      And I selected visualization "compound grid as source of the template selector"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "U4" has value "$480,173"

      And I logged out
