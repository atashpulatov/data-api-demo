@mac_chrome
Feature: F25943 - Notifications side panel

  Scenario: [TC59108] - Display notifications for new workflows - E2E user journey
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "56A532DD11EA9A91D5440080EF853B57" and selected "50k columns report - pivoted"
     Then I clicked Import button and saw error "The table you try to import exceeds the worksheet limits."

     When I selected cell "A1"
      And I clicked Import Data button
      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
     Then I waited for object operation to complete successfully with message: "Import successful"
      And I closed last notification

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "4BF6385A11EA638B25610080EFC58CB1" and selected "Prompted report with subtotals"
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I waited for object operation to complete successfully with message: "Import successful"
      And I closed last notification

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "82991A3411E99CC7299C0080EFE5EB12" and selected "Report with crosstab (2 attributes on column axis)"
      And I clicked Import button
     Then I waited for object operation to complete successfully with message: "Import successful"
      And I closed last notification

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "31B3E1DE11EA6531B0020080EF95EB52" and selected "Dossier for certification"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I imported visualization "Visualization 1"
     Then I waited for object operation to complete successfully with message: "Import successful"
      And I closed last notification

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "942B7F4411E95F8730610080EF45E0F5" and selected "50k Sales Records.csv"
      And I clicked Import button without checking results
     Then object 1 action in progress name is "Importing"
      And object 1 action in progress is executed on total "50,000 rows"
      And object 1 action displays percentage progress
      And I waited for object operation to complete successfully with message: "Import successful"
      And I closed last notification
    
     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup without checking results
     Then object 1 action in progress name is "Duplicating"
      And object 1 action in progress is executed on total "50,000 rows"
      And object 1 action displays percentage progress
      And I waited for object operation to complete successfully with message: "Object duplicated"
      And I closed last notification

     When I selected 1 using object checkbox
      And I selected 2 using object checkbox
      And I selected 3 using object checkbox
      And I selected 4 using object checkbox
      And I selected 5 using object checkbox
      And I refreshed selected objects
     Then object 1 action in progress name is "Refreshing"
      And object 1 action in progress is executed on total "50,000 rows"
      And object 1 action displays percentage progress 
      And object 2 action is pending
      And object 3 action is pending
      And object 4 action is pending
      And object 5 action is pending

     When I canceled object 5 pending action
     Then object 5 tile has no popup displayed
      And I waited for object 4 to have message on succesful operation: "Refresh complete"
      And object 1 has displayed message "Refresh complete"
      And object 3 has displayed message "Refresh complete"
      And I closed all notifications

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "B5F496B011E977D300000080EF15F357" and selected "report 100k rows"
      And I clicked Import button
     Then I waited for object operation to complete successfully with message: "Import successful"
      And I closed last notification
    
     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed last notification    
      And I clicked Duplicate on object 4
      And I clicked Import button in Duplicate popup
      And I closed last notification
      And I clicked Duplicate on object 3
      And I clicked Import button in Duplicate popup
      And I closed last notification

     When I selected 1 using object checkbox
      And I selected 2 using object checkbox
      And I selected 3 using object checkbox
      And I selected 4 using object checkbox
      And I selected 5 using object checkbox
      And I selected 6 using object checkbox
      And I selected 7 using object checkbox
      And I removed selected objects
      And I canceled object 7 pending action
     Then object 7 tile has no popup displayed
      And I waited for object 6 to have message on succesful operation: "Object removed"
      And object 1 has displayed message "Object removed"
      And object 2 has displayed message "Object removed"
      And object 3 has displayed message "Object removed"
      And object 4 has displayed message "Object removed"
      And object 5 has displayed message "Object removed"
     Then I closed all notifications

     When I clicked clear data
      And I waited for Clear Data overlay to have title "Data Cleared!"
     Then object 1 tile has no popup displayed
      And object 2 tile has no popup displayed
      And object 3 tile has no popup displayed
      And object 4 tile has no popup displayed
      And Clear Data overlay displays message "MicroStrategy data has been removed from the workbook. Click 'View Data' to import it again."

      And I logged out
