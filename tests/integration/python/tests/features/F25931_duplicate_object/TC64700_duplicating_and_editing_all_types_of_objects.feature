@windows_chrome
@mac_chrome
@release_validation
Feature: F25931 - Duplicate object

  Scenario: [TC64700] - Duplicating and editing all types of objects
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found object by ID "0DEF0B3346F3CE89858B41BFA5BD4915" and selected "Merged Header Report"
      And I clicked Import button
      And I closed last notification
     Then cell "A2" should have value "Books"

     When I added a new worksheet
      And I clicked Add Data button
      And MyLibrary Switch is OFF
      And I found object by ID "33978C7811E5B89504850080EF25B4FF" and selected "DATA_IMPORT_SQL_STATEMENT"
      And I clicked Import button
      And I closed last notification
     Then cell "A2" should have value "Atlanta"

     When I added a new worksheet
      And I clicked Add Data button
      And MyLibrary Switch is OFF
      And I found object by ID "E247019211E9DF8176990080EFB5ACD2" and selected "Dossier for interactive components"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected dossier page or chapter 2
      And I selected visualization "Visualization 1"
      And I clicked import dossier
      And I closed last notification
     Then cell "A2" should have value "Atlanta"

     When I selected worksheet number 1
      And I selected cell "E1"
      And I clicked Duplicate on object 3
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
      And I unselected all attributes
      And I unselected all metrics
      And I clicked attribute "Category"
      And I clicked metric "Cost"
      And I clicked Import button in Columns and Filters Selection to duplicate object
      And I closed last notification
     Then cell "E2" should have value "Books"

     When I selected worksheet number 2
      And I selected cell "H1"
      And I clicked Duplicate on object 3
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
      And I unselected all attributes
      And I unselected all metrics
      And I clicked attribute "Region" for dataset
      And I clicked metric "Avg Call Time"
      And I clicked Import button in Columns and Filters Selection to duplicate object
      And I closed last notification
     Then cell "H2" should have value "Northeast"

     When I selected worksheet number 3
      And I selected cell "G1"
      And I clicked Duplicate on object 3
      And I selected Active Cell option in Duplicate popup
      And I clicked Edit button in Duplicate popup
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 2"
      And I clicked import dossier to duplicate
      And I closed last notification
     Then cell "H4" should have value "$471,477"

      And I log out
