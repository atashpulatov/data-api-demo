#@ci_pipeline_daily_windows_desktop @ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_desktop @ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@windows_desktop @windows_chrome @mac_chrome
@release_validation @ga_validation
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part 6 - Import compound grid visualization with totals/subtotals
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Objects in compound grids - Show Total"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Kind of Subtotals | total, minimum, count, mode"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "C6" has value "$3"

     When I selected cell "G1"
      And I clicked Add Data button
      And I found and selected object "Objects in compound grids - Show Total"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "Position of subtotal | left - bottom"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "I5" has value "$1,410,402"

     When I selected cell "G12"
      And I clicked Add Data button
      And I found and selected object "Objects in compound grids - Show Total"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Position of subtotal | right - top"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "H20" has value "$187,027"

      And I logged out
