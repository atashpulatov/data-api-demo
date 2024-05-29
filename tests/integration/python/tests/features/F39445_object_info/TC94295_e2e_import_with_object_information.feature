Feature: F39445 - Display object related information on the Excel sheet when importing data with the Excel Add-in

  Scenario: [TC94295] - Importing reports and visualizations with Object Information settings enabled
    Given I initialized Excel
     When I logged in as default user

      And I open Settings in Dots Menu
      And I clicked "Object Information" section on Settings menu

# Check for default side panel settings
      And I hovered over info icon for "Side panel details"
     Then I verified that tooltip for info icon shows message "Always visible on the side panel: Object Name, Source Name, Type, Attributes, Metrics, Filters, Table Size, Page-By Information"
      And I verified "Side panel details" parent setting is ON
      And I verified "Imported By" child setting is ON
      And I verified "Owner" child setting is ON
      And I verified "Date Modified" child setting is ON
      And I verified "Date Created" child setting is OFF
      And I verified "Description" child setting is OFF
      And I verified "Location" child setting is ON
      And I verified "Version" child setting is OFF
      And I verified "ID" child setting is ON

# Check for default worksheet settings
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

# Change settings
     When I toggle the draggable "Name" child setting to ON
      And I toggle the draggable "Description" child setting to ON
      And I toggle the draggable "Filter" child setting to ON
      And I toggle the draggable "Date Modified" child setting to ON
      And I closed Settings

# Import report with prompt
      And I clicked Import Data button
      And I found object "Report with prompt"
      And I opened All objects list
      And I selected object "Report with prompt"
      And I clicked Import button
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed all notifications

# Verify import with set settings
     Then I verified that cells ["A1", "A3", "A4", "A6", "A9", "A12", "A15"] have values ["Report with prompt", "Description", "-", "Report Filter", "Report Limits", "View Filter", "Date Modified"]
     When I clicked toggle details button on object 1
     Then I verified that object 1 has field "Imported by"
      And I verified that object 1 has field "Owner"
      And I verified that object 1 has field "Date modified"
      And I verified that object 1 has field "Report Filter"
      And I verified that object 1 has field "Report Limits"
      And I verified that object 1 has field "Location"
      And I verified that object 1 has field "ID"

      And I logged out
