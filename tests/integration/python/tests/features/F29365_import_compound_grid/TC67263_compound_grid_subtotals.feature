@mac_chrome
@windows_chrome
Feature: F29365 - Import compound grid

  Scenario: [TC67263] - Import compound grid visualization with different cross type
    Given I logged in as default user
     When I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "A6349ADB11EABF0954E40080EF7549F1" and selected "Objects in compound grids - Show Total"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Kind of Subtotals | total, minimum, count, mode"
      And I clicked import dossier
      And I closed last notification

     Then cell "C6" should have value "$3"

     When I selected cell "G1"
      And I clicked Add Data button
      And I found object by ID "A6349ADB11EABF0954E40080EF7549F1" and selected "Objects in compound grids - Show Total"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 2
      And I selected visualization "Position of subtotal | left - bottom"
      And I clicked import dossier
      And I closed last notification

     Then cell "I5" should have value "$1,410,402"

     When I selected cell "G12"
      And I clicked Add Data button
      And I found object by ID "A6349ADB11EABF0954E40080EF7549F1" and selected "Objects in compound grids - Show Total"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Position of subtotal | right - top"
      And I clicked import dossier
      And I closed last notification

     Then cell "H20" should have value "$187,027"

      And I logged out
