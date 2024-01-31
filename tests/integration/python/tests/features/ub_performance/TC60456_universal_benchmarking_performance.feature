Feature: Ability to perform UB testing

  # This TC executes the ub_benchmarking test for specified number of hours
  # Exact number of hours is specified as parameter in step:
  # Then I executed stability test for "0.1" hours
  # To modify the workflow executed in this stability test edit the
  # 'steps_list' variable located in import_ub_performance_browser.py file
  Scenario: [TC60456] UB Testing

   Given I initialized Excel
     And I saved timestamp to "start_time"

    When I received environment name as command line parameter
    Then I generated manifest file
     And I clicked Insert Menu
     And I clicked Office Add-ins menu
     And I clicked Admin Managed menu
     And I clicked Upload My Add-in
     And I uploaded my Add-in file
     And I clicked Upload button
     And I clicked close Add-in popover
     And I clicked close Add-in button
     And I clicked "UB-Manifest" Add-in button
     And I clicked Enable button
     And I logged in as default user

   # Filters setup and first iteration
    When I selected cell "A1"
     And I clicked Import Data button
     And I switched off MyLibrary
     And I found object "Platform Analytics Cube"
     And I clicked Filters button
     And I opened All for Application category
     And I clicked "Platform Analytics" within Application All Panel
     And I clicked Filters button
     And I selected object "Platform Analytics Cube"
     And I clicked Prepare Data button
     And I selected "Session" in attribute selector
     And I selected "Account" in attribute selector
     And I clicked metric "Step Count"
     And I clicked metric "Execution Duration (ms)"
     And I clicked metric "Total Queue Duration (ms)"
     And I clicked metric "SQL Pass Count"
     And I clicked metric "Job CPU Duration (ms)"
     And I clicked metric "Initial Queue Duration (ms)"
     And I clicked metric "Prompt Answer Duration (ms)"

    When I clicked Import button
     And I saved execution start time to "import_time"
     And I closed last notification
     And I incremented execution timer named"import_time"
     And I removed all objects
     And I closed last notification

    Then I executed stability test for "1" hours
     And I saved timestamp to "end_time"
     And I logged performance data to csv file