#@ci_pipeline_daily_windows_chrome  @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@windows_desktop @windows_chrome @mac_chrome
@release_validation @ga_validation
Feature: F29365 - Import compound grid from dossier to Excel

  Scenario: [TC67227] - part 7 - Import compound grid visualization with Hyperlinks
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "A7F63DD511EABF0854E40080EFB5C8EF" and selected "Objects in compound grids - Hyperlinks"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Hyperlinks in rows"
      And I clicked import dossier
      And I closed all notifications

     Then I verified that cells ["C2", "C9", "C16"] have values ["CICE, S.A.", "Viesgo", "Grupo Printeos"]

      And I logged out
