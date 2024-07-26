@ci_pipeline_postmerge_windows_chrome
Feature: TS41441 - Sanity checks

  Scenario: [TC49100] Part 2. - Import multiple objects | Refresh All
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Report with prompt - Attribute element prompt of Category | Required | Not default"

      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
    
    When I clicked Import with options button without checking results
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that object number 1 is called "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And I verified that cells ["A3", "B3"] have values ["2020", "Mid-Atlantic"]

     When I selected cell "G1"
      And I clicked Add Data button
      And I found and selected object "Report with a subtotal & prompt"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button without checking results

      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I closed last notification
     Then I verified that object number 1 is called "Report with a subtotal & prompt"
      And I verified that cells ["G8", "H8", "L8"] have values ["Jan 2020", "Audio Equipment", "$ 47,970"]

     When I selected cell "N1"
      And I clicked Add Data button
      And I found and selected object "Report with prompt - Object prompt | Required | Default answer"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button

      And I waited for Run button to be enabled
      And I selected "Year" as an answer for "1. Objects" prompt - object prompt
      And I unselected "Category" as an answer for "1. Objects" prompt - object prompt
      And I unselected "Subcategory" as an answer for "1. Objects" prompt - object prompt
      And I clicked Run button
      And I closed last notification
     Then I verified that object number 1 is called "Report with prompt - Object prompt | Required | Default answer"
      And I verified that cells ["N3", "O3", "P3"] have values ["2021", "$1,740,085", "$11,517,606"]

     When I selected cell "R1"
      And I clicked Add Data button
      And I found and selected object "Seasonal Report"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button

      And I selected cell "W1"
      And I clicked Add Data button
      And I found and selected object "Grid/graph"

      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button

      And I selected cell "AB1"
      And I clicked Add Data button
      And I found and selected object "Report with very long name - This is a very long text to know what happens when plugging is dealing with files with such a long name it is important to see if it will add three dots at the end or if it is going to display the whole text"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button

      And I selected cell "AR1"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button

      And I selected cell "BG1"
      And I clicked Add Data button
      And I found and selected object "100_dataset"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button

      And I refreshed all objects
      And I waited for all progress notifications to disappear
      And I closed all notifications

     Then I verified that cells ["A3", "B3", "G8", "H8", "L8", "R3", "W3", "AB3", "AR3", "BG3"] have values ["2020", "Mid-Atlantic", "Jan 2020", "Audio Equipment", "$ 47,970", "Feb 2020", "Central", "Central", "Angola", "Angola"]
      And I verified that object number 8 is called "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And I verified that object number 7 is called "Report with a subtotal & prompt"
      And I verified that object number 6 is called "Report with prompt - Object prompt | Required | Default answer"
      And I verified that object number 5 is called "Seasonal Report"
      And I verified that object number 4 is called "Grid/graph"
      And I verified that object number 3 is called "Report with very long name - This is a very long text to know what happens when plugging is dealing with files with such a long name it is important to see if it will add three dots at the end or if it is going to display the whole text"
      And I verified that object number 2 is called "100_dataset"
      And I verified that object number 1 is called "100_dataset"

     When I removed object 1 using context menu
      And I removed object 8 using context menu
      And I closed all notifications
     Then I verified that cells ["A1", "BG1"] have values ["", ""]

      And I logged out
