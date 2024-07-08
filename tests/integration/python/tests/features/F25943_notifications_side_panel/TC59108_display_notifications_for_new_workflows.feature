# This script for the TC59108 verifies that correct notifications are displayed on objects when an operation is in
# progress and when operation is completed. Due to different operation performance on different machines and inertia in
# the automation framework, the script might be failing. For instance, when operation run fast some elements might
# disappear before the step using the element will be executed. In such case script might be modified to use different
# object, which will have operation running longer or shorter, depending on the physical machine performance.
#
# When deciding when the script should be run the above should be considered. It is suggested to not execute the script
# for each build, but rather once a week or during release validation.
#
# It might be difficult to enable the script for Windows Desktop platform due to very slow WinAppDriver performance.
# In such case testing for Windows Desktop should be executed manually.

Feature: F25943 - Notifications side panel

  Scenario: [TC59108] - Display notifications for new workflows - E2E user journey
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      
      And I found and selected object "50k columns report - pivoted"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found and selected object "100_report"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
     Then I waited for object operation to complete successfully with message "Import successful"
      And I closed last notification

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Prompted report with subtotals"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button without checking results
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I waited for object operation to complete successfully with message "Import successful"
      And I closed last notification

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Report with crosstab (2 attributes on column axis)"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
     Then I waited for object operation to complete successfully with message "Import successful"
      And I closed last notification

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Dossier for certification"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "Visualization 1"
     Then I waited for object operation to complete successfully with message "Import successful"
      And I closed last notification

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "report 50k sales records"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button without checking results
     Then I verified that the object 1 action in progress name is "Importing"
      And I verified that the object 1 action in progress is executed on total "50,000 rows"
      And I verified that the object 1 action displayed percentage progress
      And I waited for object operation to complete successfully with message "Import successful"
      And I closed last notification

     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup without checking results
     Then I verified that the object 1 action in progress name is "Duplicating"
      And I verified that the object 1 action in progress is executed on total "50,000 rows"
      And I verified that the object 1 action displayed percentage progress
      And I waited for object operation to complete successfully with message "Object duplicated"
      And I closed last notification

     When I selected object 1 using object checkbox
      And I selected object 3 using object checkbox
      And I selected object 4 using object checkbox
      And I selected object 5 using object checkbox
      And I refreshed selected objects
     Then I verified that the object 1 action in progress name is "Refreshing"
      And I verified that the object 1 action in progress is executed on total "50,000 rows"
      And I verified that the object 1 action displayed percentage progress
      And I verified that the object 3 action is pending
      And I verified that the object 4 action is pending
      And I verified that the object 5 action is pending

     When I canceled object 5 pending action
     Then I verified that the object 5 tile has no popup displayed
      And I waited for object 4 to have message on successful operation: "Refresh complete"
      And I verified that the object 1 has displayed message "Refresh complete"
      And I verified that the object 3 has displayed message "Refresh complete"
      And I closed all notifications

     When I selected object 1 using object checkbox
      And I selected object 2 using object checkbox
      And I selected object 4 using object checkbox
      And I removed selected objects
     Then I waited for object 4 to have message on successful operation: "Object removed"
      And I verified that the object 1 has displayed message "Object removed"
      And I verified that the object 2 has displayed message "Object removed"
      And I closed all notifications

     When I clicked clear data
      And I waited for Clear Data overlay to have title "Data Cleared!"
     Then I verified that the object 1 tile has no popup displayed
      And I verified that the object 2 tile has no popup displayed
      And I verified that the object 3 tile has no popup displayed
      And I verified that the Clear Data overlay displayed message "MicroStrategy data has been removed from the workbook. Click 'View Data' to import it again."

      And I logged out
