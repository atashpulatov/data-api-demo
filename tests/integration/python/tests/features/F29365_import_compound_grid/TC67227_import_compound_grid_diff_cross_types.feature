@mac_chrome
@windows_chrome
Feature: F29365 - Import compound grid

  Scenario: [TC67227] - Import compound grid visualization with different cross type
    Given I logged in as default user
     When I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "DD7D695411EABC3E93B50080EF65835E" and selected "Kind of compound grids - Cross type"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 2
      And I selected visualization "tabular"
      And I clicked import dossier
      And I closed last notification
    
     Then cells ["A1", "B2", "C3"] should have values ["Category", "$2,070,816", "$4,289,603"]

     When I selected cell "F1"
      And I clicked Add Data button
      And I found object by ID "DD7D695411EABC3E93B50080EF65835E" and selected "Kind of compound grids - Cross type"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "crosstab"
      And I clicked import dossier
      And I closed last notification

     Then cells ["G1", "G2", "G4"] should have values ["Books", "Art & Architecture", "370160.583"]

     When I selected cell "AG1"
      And I clicked Add Data button
      And I found object by ID "DD7D695411EABC3E93B50080EF65835E" and selected "Kind of compound grids - Cross type"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 4
      And I selected visualization "combination crosstab and tabular"
      And I clicked import dossier
      And I closed last notification

     Then cells ["AG3", "AH2", "AL4"] should have values ["Subcategory", "Cost", "$480,173"]

      And I logged out
