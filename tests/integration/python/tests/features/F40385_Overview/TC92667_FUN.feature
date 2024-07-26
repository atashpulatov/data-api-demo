@ci_pipeline_postmerge_windows_chrome
Feature: F40385 - Imported Data Overview when Importing to Excel & PowerPoint

  Scenario: [TC92667] - Imported Data Overview window additional manipulations in Excel
    Given I initialized Excel
     When I logged in as default user

    #Import object 1: Prompted report
      And I clicked Import Data button
      And I found and selected object "Prompted_report"
      And I selected import type "Import Data" and clicked import
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I waited for object to be imported successfully
      And I hover over import successfull message
      Then I verified that cell "F2" has value "Phillip"

    #Import object 2: Page-by report
    #TODO: add steps for importing in separate worksheets in Page-by config window + general config, once Page-by TC's are done in US510006
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Bursting Report - Multiple attribute in page-by"
      And I selected import type "Import Data" and clicked import
      And I clicked "Import" button
      And I waited for object to be imported successfully
      And I hover over import successfull message

    #Import object 3: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Report with Totals and Subtotals"
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
      And I hover over import successfull message
      Then I verified that cell "C17" has value "Total"

    #Import object 4: Dossier viz as Image
      And I added a new worksheet
      And I clicked Add Data button
      And I found object "User Embedded Dashboard"
      And I selected object "User Embedded Dashboard"
      And I clicked import dossier without waiting for results
      And I selected Visualization "Last 30 Days Trend"
      And I selected import type "Import Visualization" and clicked import
      And I waited for object to be imported successfully
      And I hover over import successfull message

    #Import object 5: Normal report
      And I added a new worksheet
      And I clicked Add Data button
      And I found object "User Embedded Dashboard"
      And I selected object "User Embedded Dashboard"
      And I clicked import dossier without waiting for results
      And I selected Visualization "Top 10 Objects by Total Runs for the Last 30 Days"
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
      And I hover over import successfull message
      Then I verified that cell "A2" has value "Not Applicable"

     # Overview window verification
      And I clicked Overview settings menu option
     Then I verified Overview window is opened
      And I clicked "Add Data" button in Overview window
      And I found and selected object "01 Basic Report"
      And I selected import type "Import Data" and clicked import
      And I clicked OK button in Range Taken popup in Overview window
      And I found object "no_such_object" in Overview window
      And I verified that object "no_such_object" is NOT visible
      And I cleared search box in Overview window
      And I found object "Subtotals" in Overview window
      And I verified that object "Subtotals" is visible
      And I cleared search box in Overview window

     When I clicked select all checkbox in Overview window
     Then I verified "Refresh" button in Overview window is enabled
      And I clicked "Refresh" button in Overview window
      And I waited for all objects to be refreshed successfully

     When I selected object "6" using object checkbox in Overview window
     Then I verified "Reprompt" button in Overview window is enabled
      And I clicked "Reprompt" button in Overview window
      And I unselected "Books" as an answer for "1. Category" prompt - object prompt
      And I selected "Movies" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I waited for object "6" to be imported successfully

     When I selected object "2" using object checkbox in Overview window
     Then I verified "Duplicate" button in Overview window is enabled
      And I clicked "Duplicate" button in Overview window
      And I verified that New Sheet is selected in Duplicate popup
      And I clicked Import button in Duplicate popup on overview

     When I selected object "4" using object checkbox in Overview window
      And I selected object "5" using object checkbox in Overview window
      And I verified "Delete" button in Overview window is enabled
      And I clicked "Delete" button in Overview window
      And I verified that Delete confirmation popup is visible
      And I clicked Delete button in confirmation popup

     When I verified "Filter" button in Overview window is visible
     And I clicked "Filter" button in Overview window
     Then I verified that Filter panel is visible in Overview window
      And I clicked "Name" filter in Filter panel
      And I selected "01 Basic Report" filter option
      And I selected "Prompted_report" filter option
      And I clicked Apply button in Filter panel
      And I verified that filter details are visible in Overview window

     When I clicked "Clear All" in filter details
     Then I verified that Filter panel is NOT visible in Overview window

     When I clicked select all checkbox in Overview window
      And I clicked "Delete" button in Overview window
     Then I verified that Delete confirmation popup is visible
      And I clicked Delete button in confirmation popup
      And I waited for all objects to be removed successfully
      And I clicked "Close" button in Overview window

      And I logged out
