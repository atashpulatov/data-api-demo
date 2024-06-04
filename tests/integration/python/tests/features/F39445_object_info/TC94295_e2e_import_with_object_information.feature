Feature: F39445 - Display object related information on the Excel sheet when importing data with the Excel Add-in

  Scenario: [TC94295] - Importing reports and visualizations with Object Information settings enabled
    Given I initialized Excel
     When I logged in as default user

      And I open Settings in Dots Menu
      And I clicked "Object Information" section on Settings menu

# Verify default side panel settings
      And I verified "Side panel details" parent setting is ON 
      And I verified "Imported By" child setting is ON
      And I verified "Owner" child setting is ON
      And I verified "Date Modified" child setting is ON
      And I verified "Date Created" child setting is OFF
      And I verified "Description" child setting is OFF
      And I verified "Location" child setting is ON
      And I verified "Version" child setting is OFF
      And I verified "ID" child setting is ON

# Verify default worksheet settings
      And I verified "Worksheet details" parent setting is OFF
      And I verified draggable "Name" child setting is OFF
      And I verified draggable "Owner" child setting is OFF
      And I verified draggable "Description" child setting is OFF
      And I verified draggable "Filter" child setting is OFF
      And I verified draggable "Imported By" child setting is OFF
      And I verified draggable "Date Modified" child setting is OFF
      And I verified draggable "Date Created" child setting is OFF
      And I verified draggable "ID" child setting is OFF
      And I verified draggable "Page-By Information" child setting is OFF

# Toggle some of the worksheet settings
     When I toggle the draggable "Name" child setting to "ON"
      And I toggle the draggable "Description" child setting to "ON"
      And I toggle the draggable "Filter" child setting to "ON"
      And I toggle the draggable "Date Modified" child setting to "ON"
      And I click back button in Settings

# Import prompted report and verify state of the worksheet
     When I clicked Import Data button
      And I found object "Report with prompt - Object prompt | Required | Default answer"
      And I opened All objects list
      And I selected first found object from the objects list
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications
     Then I verified that cells ["A1", "A3", "A4", "A6", "A9", "A12", "A15"] have values ["Report with prompt - Object prompt | Required | Default answer", "Description", "-", "Report Filter", "Report Limits", "View Filter", "Date Modified"]

# Verify object details in side panel
     When I clicked toggle details button on object 1
     Then I verified that object 1 has field "Imported by"
      And I verified that object 1 has field "Owner"
      And I verified that object 1 has field "Date Modified"
      And I verified that object 1 has field "Report Filter"
      And I verified that object 1 has field "Report Limits"
      And I verified that object 1 has field "Location"
      And I verified that object 1 has field "ID"

# Import report with prompt and page-by
     When I selected cell "F15"
      And I clicked Add Data button
      And I found object "Report with Prompt and Page by"
      And I opened All objects list
      And I selected object "Report with Prompt and Page by"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
      And I selected all attributes
      And I selected all metrics
      And I clicked Import button without checking results
      And I clicked Page-by "Subcategory" dropdown
      And I selected "Business" attribute element
      And I selected "Literature" attribute element
      And I closed Page-by "Subcategory" dropdown
      And I clicked "Add" button     
      And I clicked "Import" button
      And I closed all notifications

# Verify state of the worksheets
     When I selected worksheet number 2
     Then I verified that cells ["A1", "A3", "A4", "A6", "A9", "A12", "A15"] have values ["Report with Prompt and Page by", "Description", "-", "Report Filter", "Report Limits", "View Filter", "Date Modified"]

     When I selected worksheet number 3
     Then I verified that cell "A1" has value "Report with Prompt and Page by"
      
     When I selected worksheet number 4
     Then I verified that cell "A6" has value "Report Filter"

# Toggle all worksheet settings and refresh
     When I open Settings in Dots Menu
      And I clicked "Object Information" section on Settings menu
      And I toggle the "Worksheet details" parent setting to "OFF"
      And I toggle the "Worksheet details" parent setting to "ON"
      And I click back button in Settings
      And I clicked select all checkbox
      And I clicked Refresh button for select all
      And I waited for all progress notifications to disappear

# Verify state of the worksheets
     When I selected worksheet number 2
     Then I verified that cells ["A1", "A3", "A4", "A6", "A9", "A12", "A15", "A18", "A21", "A24", "A27", "A30"] have values ["Report with Prompt and Page by", "Owner", "Administrator", "Description", "Report Filter", "Report Limits", "View Filter", "Imported By", "Date Modified", "Date Created", "ID", "Paged-By"]

     When I selected worksheet number 3
     Then I verified that cell "A30" has value "Paged-By"

     When I selected worksheet number 4
     Then I verified that cell "A27" has value "ID"

# Toggle all side panel details settings
     When I open Settings in Dots Menu
      And I clicked "Object Information" section on Settings menu
      And I toggle the "Side panel details" parent setting to "OFF"
      And I toggle the "Side panel details" parent setting to "ON"
      And I click back button in Settings

# Import visualization
     When I added a new worksheet
      And I clicked Add Data button
      And I found object "User Embedded Dashboard"
      And I selected object "User Embedded Dashboard"
      And I clicked import dossier without waiting for results
      And I selected Visualization "Top 10 Objects by Total Runs for the Last 30 Days"
      And I selected import type "Import Data" and clicked import
      And I closed all notifications
     Then I verified that cells ["A24", "B24"] have values ["Object", "Application"]

# Verify dashboard details in side panel
      And I closed all notifications
     When I clicked toggle details button on object 1
     Then I verified that object 1 has field "Imported by"
      And I verified that object 1 has field "Owner"
      And I verified that object 1 has field "Date Modified"
      And I verified that object 1 has field "Date Created"
      And I verified that object 1 has field "Description"
      And I verified that object 1 has field "Location"
      And I verified that object 1 has field "Version"
      And I verified that object 1 has field "ID"

# Turn off all details settings and refresh
     When I open Settings in Dots Menu
      And I clicked "Object Information" section on Settings menu
      And I toggle the "Side panel details" parent setting to "OFF"
      And I toggle the "Worksheet details" parent setting to "OFF"
      And I click back button in Settings
      And I clicked select all checkbox
      And I clicked Refresh button for select all
      And I closed all notifications

# Verify report details in side panel
     When I clicked toggle details button on object 1
     Then I verified that object 1 doesn't have field "ID"

# Go back to default settings after finished
     When I open Settings in Dots Menu
      And I clicked "Object Information" section on Settings menu
      And I toggle the "Side panel details" parent setting to "OFF"
      And I toggle the "Side panel details" parent setting to "ON"
      And I toggle the "Date Created" child setting to "OFF"
      And I toggle the "Description" child setting to "OFF"
      And I toggle the "Version" child setting to "OFF"
      And I toggle the "Worksheet details" parent setting to "OFF"
      And I click back button in Settings
      And I logged out
