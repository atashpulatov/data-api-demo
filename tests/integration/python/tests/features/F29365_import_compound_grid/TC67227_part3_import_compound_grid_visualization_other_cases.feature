#@ci_pipeline_daily_windows_desktop @ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
@ci_pipeline_rv_windows_desktop @ci_pipeline_rv_windows_chrome
#@ci_pipeline_rv_mac_chrome
@windows_desktop @windows_chrome @mac_chrome
@release_validation @ga_validation
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part 3 -Import compound grid visualization (other cases)
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "E52F04E111EABC6C58230080EF75D638" and selected "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Only one column set"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "E4" has value "$180,044"

     When I selected cell "H6"
      And I clicked Add Data button
      And I found object by ID "E52F04E111EABC6C58230080EF75D638" and selected "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "two columns sets with different column headers dimensions"
      And I clicked import dossier
      And I closed last notification

   #TODO add validation for defect DE197071 and DE197073

     Then I verified that cell "I11" has value "$311,597"

     When I selected cell "H40"
      And I clicked Add Data button
      And I found object by ID "E52F04E111EABC6C58230080EF75D638" and selected "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "with consolidations"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "K43" has value "1.584"

     When I selected cell "P49"
      And I clicked Add Data button
      And I found object by ID "E52F04E111EABC6C58230080EF75D638" and selected "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "with filter that returns no data in one of the column set"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "Q53" has value "$311,597"

     When I selected cell "X100"
      And I clicked Add Data button
      And I found object by ID "E52F04E111EABC6C58230080EF75D638" and selected "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 7
      And I selected visualization "with empy columset"
      And I clicked import dossier
      And I closed last notification

     Then I verified that cell "Y108" has value "$260,381"

      And I logged out
