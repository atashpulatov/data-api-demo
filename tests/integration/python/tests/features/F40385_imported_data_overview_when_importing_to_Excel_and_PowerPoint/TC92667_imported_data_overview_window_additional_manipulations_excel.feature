#@ci_pipeline_postmerge_windows_chrome
Feature: F40385 - Imported Data Overview when Importing to Excel & PowerPoint

  Scenario: [TC92667] - Imported Data Overview window additional manipulations in Excel
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
    #TODO: add steps for importing in separate worksheets in Page-by config window + general config, once Page-by TC's are done in US510006
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Bursting Report - Multiple attribute in page-by"
      And I clicked Import Data button

    #Import report 3: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I clicked Import Data button

    #Import report 4: Prompted report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Prompted report with subtotals"
      And I clicked Import Data button
      And I clicked Apply button

    #Import report 5: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Simple Report Display Sample Report"
      And I clicked Import Data button

    #Import report 6: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "report graph"
      And I clicked Import Data button

    #Import report 7: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Report with all subtotals"
      And I clicked Import Data button

    #Import report 8: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Report with Totals and Subtotals"
      And I clicked Import Data button

     When I clicked Imported Data Overview in Dots menu
     Then I verified Overview window is opened
      And I clicked Add Data button in Overview window
      And I found and selected object "01 Basic Report"
      And I clicked Import Data button
      And I selected New Sheet option in Range Taken popup
      And I clicked OK button in Range Taken popup
      And I found object "no_such_object" in Overview window
      And I cleared search box in Overview window
      And I found object "subtotals" in Overview window
      And I cleared search box in Overview window

     When I clicked select all checkbox in Overview window
     Then I verified "Refresh" button in Overview window is enabled
      And I verified "Delete" button in Overview window is enabled
      And I clicked "Refresh" button for select all in Overview window
      And I waited for ALL objects to be refreshed successfully

     When I selected object 1 using object checkbox in Overview window
     Then I verified "Reprompt" button in Overview window is enabled
      And I clicked "Reprompt" button in Overview window
      And I unselected "Books" as an answer for "1. Category" prompt - object prompt
      And I selected "Movies" as an answer for "1. Category" prompt - object prompt
      And I clicked Apply button

     When I selected object 3 using object checkbox in Overview window
     Then I verified "Duplicate" button in Overview window is enabled
      And I clicked "Duplicate" button in Overview window
      And I selected New Sheet option in Duplicate popup
      And I clicked Import button in Duplicate popup

     When I selected object 4 using object checkbox in Overview window
      And I selected object 6 using object checkbox in Overview window
      And I verified "Delete" button in Overview window is enabled
      And I clicked "Delete" button in Overview window
     Then I waited for ALL selected objects to be removed successfully

     When I clicked "Filter" button in Overview window
     Then I verified that Filter panel is visible in Overview window
      And I selected filter "Name" with all elements in Overview window
      And I selected filter "Project" with all elements in Overview window
      And I clicked Apply button in Filter panel
      And I verified that filter details are visible in Overview window

     When I clicked "Clear All" in filter details
     Then I verified that filter details are NOT visible in Overview window

     When I clicked "Go to Worksheet" for object 3 in Overview window
     Then I verified that Overview window is NOT visible
      And I verified that worksheet number 3 is selected

     When I clicked Imported Data Overview in Dots menu
      And I clicked select all checkbox in Overview window
      And I clicked Delete object 1 in Overview window
     Then I waited for ALL objects to be removed successfully
      And I clicked "Close" button

      And I logged out
