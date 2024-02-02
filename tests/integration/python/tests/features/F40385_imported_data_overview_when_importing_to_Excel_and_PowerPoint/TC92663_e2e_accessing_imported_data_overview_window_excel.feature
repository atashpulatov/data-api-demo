#@ci_pipeline_postmerge_windows_chrome
Feature: F40385 - Imported Data Overview when Importing to Excel & PowerPoint

  Scenario: [TC92663] - Accessing Imported Data Overview window in Excel
    Given I initialized Excel

     When I logged in as default user

    #Import report 1: Prompted report
      And I clicked Import Data button
      And I found and selected object "Prompted_report"
      And I clicked Import button
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I clicked Apply button

    #Import report 2: Page-by report
    #To DO: add steps for importing in separate worksheets in Page-by config window + general config, once Page-by TC's are done in US510006
      And I clicked Add Data button
      And I found and selected object "Bursting Report - Multiple attribute in page-by"
      And I clicked Import button

    #Import report 3: Normal report
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I clicked Import button

    #Import report 4: Prompted report
      And I clicked Add Data button
      And I found and selected object "Prompted report with subtotals"
      And I clicked Import button
      And I clicked Apply button

    #Import report 5: Normal report
      And I clicked Add Data button
      And I found and selected object "Simple Report Display Sample Report"
      And I clicked Import button

    #Import report 6: Normal report
      And I clicked Add Data button
      And I found and selected object "report graph"
      And I clicked Import button

    #Import report 7: Normal report
      And I clicked Add Data button
      And I found and selected object "Report with all subtotals"
      And I clicked Import button

    #Import report 8: Normal report
      And I clicked Add Data button
      And I found and selected object "Report with Totals and Subtotals"
      And I clicked Import button

     When I clicked Imported Data Overview in Dots menu
     Then I verified Overview window is opened
      And I verified "Add Data" button in Overview window is enabled
      And I verified "Refresh" button in Overview window is visible
      And I verified "Refresh" button in Overview window is disabled
      And I verified "Reprompt" button in Overview window is visible
      And I verified "Reprompt" button in Overview window is disabled
      And I verified "Duplicate" button in Overview window is visible
      And I verified "Duplicate" button in Overview window is disabled
      And I verified "Delete" button in Overview window is visible
      And I verified "Delete" button in Overview window is disabled
      And I verified "Filter" button in Overview window is visible
      And I verified "Filter" button in Overview window is enabled
      And I verified "Close" button in Overview window is visible
      And I verified "Close" button in Overview window is enabled

     When I clicked select all checkbox in Overview window
     Then I verified "Refresh" button in Overview window is enabled
      And I verified "Reprompt" button in Overview window is disabled
      And I verified "Duplicate" button in Overview window is disabled
      And I verified "Delete" button in Overview window is enabled

     When I clicked "Refresh" button for select all in Overview window
     Then I waited for ALL objects to be refreshed successfully

      And I logged out

