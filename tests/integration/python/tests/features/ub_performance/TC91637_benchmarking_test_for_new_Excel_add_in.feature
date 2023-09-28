@mac_chrome
@windows_chrome

Feature: Ability to perform UB testing

  Scenario: [TC91637] Benchmarking Test for New Excel Add-in

   Given I initialized Excel
     And I saved timestamp to "start_time"
     And I logged in as default user

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "10k report"
    Then I saved execution start time to "10K_import_time_1"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "10K_import_time_1"
     And I added a new worksheet

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "10k report"
    Then I saved execution start time to "10K_import_time_2"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "10K_import_time_2"
     And I added a new worksheet

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "10k report"
    Then I saved execution start time to "10K_import_time_3"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "10K_import_time_3"
     And I removed all objects

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "report 50k sales record"
    Then I saved execution start time to "50K_import_time_1"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "50K_import_time_1"
     And I added a new worksheet

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "report 50k sales record"
    Then I saved execution start time to "50K_import_time_2"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "50K_import_time_2"
     And I added a new worksheet

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "report 50k sales record"
    Then I saved execution start time to "50K_import_time_3"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "50K_import_time_3"
     And I removed all objects

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "100k_rows_report"
    Then I saved execution start time to "100K_import_time_1"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "100K_import_time_1"
     And I added a new worksheet

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "100k_rows_report"
    Then I saved execution start time to "100K_import_time_2"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "100K_import_time_2"
     And I added a new worksheet

    When I selected cell "A1"
     And I clicked Import Data button
     And I found object "100k_rows_report"
    Then I saved execution start time to "100K_import_time_3"
     And I clicked Import button
     And I waited for object to be imported successfully
    Then I saved execution duration to "100K_import_time_3"
     And I removed all objects

     And I saved timestamp to "end_time"
     And I logged performance data to csv file
     And I logged out