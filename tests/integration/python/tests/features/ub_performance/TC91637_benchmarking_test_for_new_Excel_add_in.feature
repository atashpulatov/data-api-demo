Feature: Ability to perform UB testing

  Scenario: [TC91637] Benchmarking Test for New Excel Add-in

   Given I initialized Excel
     And I saved timestamp to "start_time"
     And I logged in as default user

    When I selected cell "A1"
     And I clicked Import Data button
    And I found and selected object "10k report"
    Then I saved execution start time to "10K_import_time_1"
     And I verified that Import with dropdown button is enabled
     And I clicked Import dropdown button
     And I verified that "Import Data" item in Import dropdown is enabled
     And I selected "Import Data" item in Import dropdown
     And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "10K_import_time_1"
     And I closed last notification 
     And I added a new worksheet

    When I selected cell "A2"
    And I clicked Add Data button
    And I found and selected object "10k report"
    Then I saved execution start time to "10K_import_time_2"
     And I verified that Import with dropdown button is enabled
     And I clicked Import dropdown button
     And I verified that "Import Data" item in Import dropdown is enabled
     And I selected "Import Data" item in Import dropdown
     And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "10K_import_time_2"
     And I closed last notification 
     And I added a new worksheet

    When I selected cell "A3"
    And I clicked Add Data button
    And I found and selected object "10k report"
    Then I saved execution start time to "10K_import_time_3"
     And I verified that Import with dropdown button is enabled
     And I clicked Import dropdown button
     And I verified that "Import Data" item in Import dropdown is enabled
     And I selected "Import Data" item in Import dropdown
     And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "10K_import_time_3"
     And I closed last notification 
     And I removed all objects

    When I selected cell "A4"
     And I clicked Add Data button
    And I found and selected object "report 50k sales record"
    Then I saved execution start time to "50K_import_time_1"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "50K_import_time_1"
     And I added a new worksheet

    When I selected cell "A5"
     And I clicked Add Data button
    And I found and selected object "report 50k sales record"
    Then I saved execution start time to "50K_import_time_2"
     And I verified that Import with dropdown button is enabled
     And I clicked Import dropdown button
     And I verified that "Import Data" item in Import dropdown is enabled
     And I selected "Import Data" item in Import dropdown
     And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "50K_import_time_2"
     And I added a new worksheet

    When I selected cell "A6"
     And I clicked Add Data button
     And I found and selected object "report 50k sales record"
    Then I saved execution start time to "50K_import_time_3"
     And I verified that Import with dropdown button is enabled
     And I clicked Import dropdown button
     And I verified that "Import Data" item in Import dropdown is enabled
     And I selected "Import Data" item in Import dropdown
     And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "50K_import_time_3"
     And I removed all objects

    When I selected cell "A7"
     And I clicked Add Data button
    And I found and selected object "100k_rows_report"
    Then I saved execution start time to "100K_import_time_1"
     And I verified that Import with dropdown button is enabled
     And I clicked Import dropdown button
     And I verified that "Import Data" item in Import dropdown is enabled
     And I selected "Import Data" item in Import dropdown
     And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "100K_import_time_1"
     And I added a new worksheet

    When I selected cell "A8"
     And I clicked Add Data button
    And I found and selected object "100k_rows_report"
    Then I saved execution start time to "100K_import_time_2"
     And I verified that Import with dropdown button is enabled
     And I clicked Import dropdown button
     And I verified that "Import Data" item in Import dropdown is enabled
     And I selected "Import Data" item in Import dropdown
     And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "100K_import_time_2"
     And I added a new worksheet

    When I selected cell "A9"
     And I clicked Add Data button
    And I found and selected object "100k_rows_report"
    Then I saved execution start time to "100K_import_time_3"
     And I verified that Import with dropdown button is enabled
     And I clicked Import dropdown button
     And I verified that "Import Data" item in Import dropdown is enabled
     And I selected "Import Data" item in Import dropdown
     And I clicked Import with dropdown button
     And I waited for object to be imported successfully
    Then I saved execution duration to "100K_import_time_3"
     And I removed all objects

     And I saved timestamp to "end_time"
     And I logged performance data to csv file
     And I logged out