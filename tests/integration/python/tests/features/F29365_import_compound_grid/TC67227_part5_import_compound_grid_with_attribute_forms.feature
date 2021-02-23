@mac_chrome
@windows_chrome
@release_validation
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part 5 - Import compound grid visualization with Attribute forms
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "2F1922D211EABF0355790080EFD509F0" and selected "Objects in compound grids - Attribute forms"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 2
      And I selected visualization "Simple forms"
      And I clicked import dossier
      And I closed last notification

     Then cells ["A1", "B2", "C4"] should have values ["", "Profit", "$1,057,330"]

     When I selected cell "G1"
      And I clicked Add Data button
      And I found object by ID "2F1922D211EABF0355790080EFD509F0" and selected "Objects in compound grids - Attribute forms"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "Multiple forms"
      And I clicked import dossier
      And I closed last notification

     Then cells ["G1", "H3", "I4"] should have values ["", "Subcategory ID", "$110,012"]

     When I selected cell "N1"
      And I clicked Add Data button
      And I found object by ID "2F1922D211EABF0355790080EFD509F0" and selected "Objects in compound grids - Attribute forms"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "Special handle - Compound ID attribute"
      And I clicked import dossier
      And I closed last notification

     Then cells ["N1", "O3", "Q6"] should have values ["", "Distribution Center ID 1", "$176,759"]

     When I selected cell "V1"
      And I clicked Add Data button
      And I found object by ID "2F1922D211EABF0355790080EFD509F0" and selected "Objects in compound grids - Attribute forms"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 6
      And I selected visualization "Special handle - Geographic attribute"
      And I clicked import dossier
      And I closed last notification

     Then cells ["V1", "W3", "Y1"] should have values ["", "Country Latitude", "Asia"]

      And I logged out
