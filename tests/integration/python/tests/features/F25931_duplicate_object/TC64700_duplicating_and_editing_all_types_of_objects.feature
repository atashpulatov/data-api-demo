#@ci_pipeline_daily_windows_desktop @ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@ci_pipeline_rv_windows_desktop
@ci_pipeline_rv_windows_chrome @ci_pipeline_rv_mac_chrome
@disabled_windows_desktop @windows_chrome @mac_chrome
Feature: F25931 - Duplicate object

  Scenario: [TC64700] - [Duplicate object] [Range taken] - E2E
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "0DEF0B3346F3CE89858B41BFA5BD4915" and selected "Merged Header Report"
      And I clicked Import button
      And I closed last notification
     Then I verified that cell "A2" has value "Books"

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "33978C7811E5B89504850080EF25B4FF" and selected "DATA_IMPORT_SQL_STATEMENT"
      And I clicked Import button
      And I closed last notification
     Then I verified that cell "A2" has value "Atlanta"

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "E247019211E9DF8176990080EFB5ACD2" and selected "Dossier for interactive components"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 1
      And I selected visualization "Basic Grid"
      And I clicked import dossier
      And I closed last notification
     Then I verified that cell "A2" has value "2014"

     When I clicked Edit object 3
      And I clicked metric "Profit"
      And I clicked Import button in Columns and Filters Selection
      And I closed notification on object 3
     Then I verified that cells ["A2", "B5", "C1"] have values ["Books", "$3,713,323", ""]

     When I selected worksheet number 1
      And I selected cell "C1"
      And I clicked Duplicate on object 3
      And I selected Active Cell option in Duplicate popup
      And I clicked Import button in Duplicate popup
      And I closed last notification
     Then I verified that object number 1 is called "Merged Header Report Copy"
      And I verified that cell "C2" has value "Books"

     When I clicked Edit object 4
      And I clicked metric "Profit"
      And I clicked Import button in Columns and Filters Selection without success check
      And I selected cell "D1"
      And I selected Active Cell option in Range Taken popup
      And I clicked OK button in Range Taken popup
      And I selected cell "E1"
      And I clicked OK button in Range Taken popup
      And I closed notification on object 4
     Then I verified that cells ["B2", "E2", "F2", "G2"] have values ["", "Books", "$2,070,816", "$569,278"]

     When I selected worksheet number 2
      And I verified that object number 3 is called "DATA_IMPORT_SQL_STATEMENT"
      And I removed 1 columns starting from column "E"
      And I selected cell "E1"
      And I clicked Duplicate on object 3
      And I selected Active Cell option in Duplicate popup
      And I clicked Import button in Duplicate popup
      And I closed last notification
     Then I verified that cell "I2" has value "1"
      And I verified that object number 1 is called "DATA_IMPORT_SQL_STATEMENT Copy"

     When I verified that object number 4 is called "DATA_IMPORT_SQL_STATEMENT"
      And I clicked Refresh on object 4
      And I selected cell "J1"
      And I selected Active Cell option in Range Taken popup
      And I clicked OK button in Range Taken popup
      And I closed last notification
     Then I verified that cells ["B2", "J2", "N2"] have values ["", "Atlanta", "1"]

     When I selected worksheet number 3
      And I clicked Duplicate on object 3
      And I clicked Edit button in Duplicate popup
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 4
      And I selected visualization "Visualization 1"
      And I clicked import dossier to duplicate
      And I closed last notification
      And I selected worksheet number 4
     Then I verified that cell "H1" has value "Milwaukee"

     When I added a new worksheet
      And I entered text "abc" into cell "C3" after selecting it
      And I verified that cell "C3" has value "abc"
      And I selected cell "A1"
      And I clicked Add Data button
      And I found object by ID "0DEF0B3346F3CE89858B41BFA5BD4915" and selected "Merged Header Report"
      And I clicked Import button without checking results
      And I verified that New Sheet is selected
      And I clicked OK button in Range Taken popup
      And I closed last notification
     Then I verified that object number 1 is called "Merged Header Report"
      And I verified that cell "A2" has value "Books"
      And I selected worksheet number 5
      And I verified that cell "C3" has value "abc"

     When I verified that object number 4 is called "Merged Header Report Copy"
      And I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed last notification
     Then I selected worksheet number 6
      And I verified that cell "A2" has value "Books"
      And I verified that object number 1 is called "Merged Header Report Copy 2"

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
     Then I verified that cell "B2" has value "Cost"
      And I verified that object number 1 is called "attributes and metrics in rows"

      And I logged out
