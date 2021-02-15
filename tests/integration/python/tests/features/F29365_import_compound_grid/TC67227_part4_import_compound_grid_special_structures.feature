@mac_chrome
@windows_chrome
@release_validation
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - part 4 - Import Compound Grid visualization with special structures
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "3901187911EAC1E161F30080EFF54765" and selected "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Only one attribute in rows"
      And I clicked import dossier
      And I closed last notification

     Then cell "A3" should have value "Electronics"

     When I selected cell "C1"
      And I clicked Add Data button
      And I found object by ID "3901187911EAC1E161F30080EFF54765" and selected "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "attributes and metrics in rows"
      And I clicked import dossier
      And I closed last notification

     Then cells ["C6", "E9", "F14", "H14"] should have values ["Books - Miscellaneous", "", "4181261.167", ""]

     When I selected cell "J1"
      And I clicked Add Data button
      And I found object by ID "3901187911EAC1E161F30080EFF54765" and selected "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 4
      And I selected visualization "empty columnSets"
      And I clicked import dossier
      And I closed last notification

     Then cell "L10" should have value "$3,149,663"

     When I selected cell "P1"
      And I clicked Add Data button
      And I found object by ID "3901187911EAC1E161F30080EFF54765" and selected "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 5
      And I selected visualization "attribute in rows and only metrics in columnSets"
      And I clicked import dossier
      And I closed last notification

     Then cells ["Q1", "T1", "R6"] should have values ["Subcategory", "Cost", "$811,787"]

      And I logged out
