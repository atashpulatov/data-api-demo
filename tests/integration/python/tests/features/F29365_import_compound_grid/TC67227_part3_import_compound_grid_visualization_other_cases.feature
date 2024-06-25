@ci_pipeline_postmerge_windows_chrome
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part 3 -Import compound grid visualization (other cases)
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Only one column set"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "E3" has value "180044.0035"

     When I selected cell "H6"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "two columns sets with different column headers dimensions"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

   #TODO add validation for defect DE197071 and DE197073

     Then I verified that cell "I10" has value "$311,597"

     When I selected cell "H40"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "with consolidations"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "K42" has value "1.584"

     When I selected cell "P49"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "with filter that returns no data in one of the column set"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "Q52" has value "$311,597"

     When I selected cell "X100"
      And I clicked Add Data button
      And I found and selected object "Kind of compound grids - Other cases"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 7
      And I selected visualization "with empy columset"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cell "Y107" has value "$260,381"

      And I logged out
