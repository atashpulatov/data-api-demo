# @ci_pipeline_postmerge_windows_chrome 
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part 5 - Import compound grid visualization with Attribute forms
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Objects in compound grids - Attribute forms"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 2
      And I selected visualization "Simple forms"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["A1", "B2", "C3"] have values ["", "Profit", "$1,057,330"]

     When I selected cell "G1"
      And I clicked Add Data button
      And I found and selected object "Objects in compound grids - Attribute forms"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "Multiple forms"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["G1", "H2", "I3"] have values ["", "Subcategory ID", "$110,012"]

     When I selected cell "N1"
      And I clicked Add Data button
      And I found and selected object "Objects in compound grids - Attribute forms"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "Special handle - Compound ID attribute"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["N1", "O2", "Q5"] have values ["", "Distribution Center ID 1", "$176,759"]

     When I selected cell "V1"
      And I clicked Add Data button
      And I found and selected object "Objects in compound grids - Attribute forms"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 6
      And I selected visualization "Special handle - Geographic attribute"
      And I selected import type "Import Data" and clicked import
      And I closed last notification

     Then I verified that cells ["V1", "W2", "Y1"] have values ["", "Country Latitude", "Asia"]

      And I logged out
