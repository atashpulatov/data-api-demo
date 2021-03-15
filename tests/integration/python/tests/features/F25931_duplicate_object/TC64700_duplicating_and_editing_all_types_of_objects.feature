@windows_chrome
@mac_chrome
@release_validation
@ga_validation

Feature: F25931 - Duplicate object

  Scenario: [TC64700] - [Duplicate object] [Range taken] - E2E
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "0DEF0B3346F3CE89858B41BFA5BD4915" and selected "Merged Header Report"
      And I clicked Import button
      And I closed last notification
     Then cell "A2" should have value "Books"

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "33978C7811E5B89504850080EF25B4FF" and selected "DATA_IMPORT_SQL_STATEMENT"
      And I clicked Import button
      And I closed last notification
     Then cell "A2" should have value "Atlanta"

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "E247019211E9DF8176990080EFB5ACD2" and selected "Dossier for interactive components"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
     Then cell "A2" should have value "Atlanta"

     When I clicked Edit object 3
      And I clicked metric "Profit"
      And I clicked Import button in Columns and Filters Selection
      And I closed notification on object 3
     Then cells ["A2", "B5", "C1"] should have values ["Books", "$3,713,323", ""]

     When I selected worksheet number 1
      And I selected cell "C1"
      And I clicked Duplicate on object 3
      And I selected Active Cell option in Duplicate popup
      And I clicked Import button in Duplicate popup
      And I closed last notification
     Then object number 1 should be called "Merged Header Report Copy"
      And cell "C2" should have value "Books"

     When I clicked Edit object 4
      And I clicked metric "Profit"
      And I clicked Import button in Columns and Filters Selection without success check
      And I selected cell "D1"
      And I selected Active Cell option in Range Taken popup
      And I clicked OK button in Range Taken popup
      And I selected cell "E1"
      And I clicked OK button in Range Taken popup
      And I closed notification on object 4
     Then cells ["B2", "E2", "F2", "G2"] should have values ["", "Books", "$2,070,816", "$569,278"]

     When I selected worksheet number 2
      And object number 3 should be called "DATA_IMPORT_SQL_STATEMENT"
      And I removed 1 columns starting from column "E"
      And I selected cell "E1"
      And I clicked Duplicate on object 3
      And I selected Active Cell option in Duplicate popup
      And I clicked Import button in Duplicate popup
      And I closed last notification
     Then cell "I2" should have value "1"
      And object number 1 should be called "DATA_IMPORT_SQL_STATEMENT Copy"

     When object number 4 should be called "DATA_IMPORT_SQL_STATEMENT"
      And I clicked Refresh on object 4
      And I selected cell "J1"
      And I selected Active Cell option in Range Taken popup
      And I clicked OK button in Range Taken popup
      And I closed last notification
     Then cells ["B2", "J2", "N2"] should have values ["", "Atlanta", "1"]

     When I selected worksheet number 3
      And I clicked Duplicate on object 3
      And I clicked Edit button in Duplicate popup
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 4
      And I selected visualization "Visualization 1"
      And I clicked import dossier to duplicate
      And I closed last notification
      And I selected worksheet number 4
     Then cell "H1" should have value "Milwaukee"

     When I added a new worksheet
      And I wrote text "abc" in cell "C3"
      And cell "C3" should have value "abc"
      And I selected cell "A1"
      And I clicked Add Data button
      And I found object by ID "0DEF0B3346F3CE89858B41BFA5BD4915" and selected "Merged Header Report"
      And I clicked Import button without checking results
   #TODO  I veryfied "New  Sheet" is selected
      And I clicked OK button in Range Taken popup
      And I closed last notification
     Then object number 1 should be called "Merged Header Report"
      And cell "A2" should have value "Books"
      And I selected worksheet number 5
      And cell "C3" should have value "abc"

     When object number 4 should be called "Merged Header Report Copy"
      And I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed last notification
     Then I selected worksheet number 6
      And cell "A2" should have value "Books"
      And object number 1 should be called "Merged Header Report Copy 2"

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "3901187911EAC1E161F30080EFF54765" and selected "Kind of compound grids - Special structure"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 4
      And I selected visualization "empty columnSets"
      And I clicked import dossier
      And I closed last notification
      And I clicked Duplicate on object 1
      And I clicked Edit button in Duplicate popup
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 3
      And I selected visualization "attributes and metrics in rows"
      And I clicked import dossier to duplicate
      And I closed last notification
      And I selected worksheet number 7
     Then cell "B2" should have value "Cost"
      And object number 1 should be called "attributes and metrics in rows"

      And I logged out
