#@ci_pipeline_postmerge_windows_chrome
Feature: F40385 - Imported Data Overview when Importing to Excel & PowerPoint

  Scenario: [TC92663] - Accessing Imported Data Overview window in Excel
    Given I initialized Excel
     When I logged in as default user

    #Import report 1: Prompted report
      And I clicked Import Data button
      And I found and selected object "Prompted_report"
      And I clicked import dossier without waiting for results
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I clicked Apply button
      And I waited for object to be imported successfully

    #Import report 2: Page-by report
    #TODO: add steps for importing in separate worksheets in Page-by config window + general config, once Page-by TC's are done in US510006
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Bursting Report - Multiple attribute in page-by"
      And I clicked import dossier without waiting for results

    #Import report 3: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I clicked import dossier without waiting for results

    #Import report 4: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Report with all subtotals"
      And I clicked import dossier without waiting for results
      And I waited for object to be imported successfully

    # Overview window verification
      And I clicked Imported Data Overview settings menu option
     Then I verified Overview window is opened
      And I verified "Add Data" button in Overview window is enabled
      And I verified "Refresh" button in Overview window is visible
      And I verified "Refresh" button in Overview window is disabled
      And I verified "Re-Prompt" button in Overview window is visible
      And I verified "Re-Prompt" button in Overview window is disabled
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
      And I verified "Re-Prompt" button in Overview window is enabled
      And I verified "Duplicate" button in Overview window is disabled
      And I verified "Delete" button in Overview window is enabled

     When I clicked "Refresh" button in Overview window
     Then I waited for all objects to be refreshed successfully
      And I clicked "Close" button in Overview window

      And I logged out
