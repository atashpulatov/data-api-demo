@mac_chrome
Feature: F30479 - Hardening of importing data from Dossier to Excel

Scenario: [TC65052] E2E Hardening of importing data from Dossier to Excel
  Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "9F0DB07111EA9605CE6A0080EFC5A96D" and selected "Dossier with filter"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Visualization 1"

      And I saved execution start time to "visualisation_1_import_duration"
      And I clicked import dossier
      And I saved execution end time to "visualisation_1_import_duration"
      And I closed last notification

     When I clicked Edit object 1
     And I waited for dossier to load successfully
   

    And I saved execution start time as "visualisation_2_import_duration"
    And I imported visualization ".*"
    And I saved execution end time as "visualisation_2_import_duration"

    And I verified that execution time "visualisation_2_import_duration" is similar to "visualisation_1_import_duration"