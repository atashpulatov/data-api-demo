@ci_pipeline_postmerge_windows_chrome
Feature: TS41441 - Sanity checks

  Scenario: [TC49100] Part 1. - Import Prompted Reports | Import multiple objects | Refresh | Edit - Prompts
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I found and selected object "Report with prompt - Attribute element prompt of Category | Required | Not default"

     When I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I selected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
     Then I verified that Columns & Filters Selection is visible
      And I verified popup title is "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And I verified that counter of "attributes" shows "0" of "3" selected
      And I verified that counter of "metrics" shows "0" of "2" selected
      And I verified that counter of "filters" shows "0" of "3" selected

      And I verified that Data Preview button in Columns and Filters Selection is disabled
      And I verified that Import button in Columns and Filters Selection is disabled
      And I verified that Back button in Columns and Filters Selection is visible

     When I clicked metric "Revenue"
     Then I verified that Data Preview button in Columns and Filters Selection is enabled
      And I verified that Import with options button is enabled

     When I clicked metric "Revenue"
     Then I verified that Data Preview button in Columns and Filters Selection is disabled
      And I verified that Import button in Columns and Filters Selection is disabled

     When I selected all attributes
      And I ensured attribute is selected and I clicked forms { "Category": ["ID"] }
      And I clicked metric "Revenue"
      And I selected filter "Year" with all elements
      And I selected filters { "Region" : ["Central", "Southwest", "South", "Northeast"] }

     Then I verified that Data Preview button in Columns and Filters Selection is enabled
      And I clicked Data Preview button
      And I clicked Close Preview button
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
     
     When I selected "Import Data" option in options dropdown
      And I clicked Import with options button
      And I waited for object to be imported successfully
      And I closed last notification 
     Then I verified that object number 1 is called "Report with prompt - Attribute element prompt of Category | Required | Not default"
      And I verified that cells ["A3", "B3"] have values ["2020", "Northeast"]

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

     When I hovered over Refresh button on object 2
      And I clicked Refresh on object 2
     Then I verified that cells ["A3", "B3"] have values ["2020", "Northeast"]


     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I selected "Music" as an answer for "1. Category" prompt - object prompt
      And I unselected "Electronics" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I verified that Columns & Filters Selection is visible

     Then I verified that counter of "metrics" shows "4" of "4" selected
      And I verified that counter of "attributes" shows "2" of "2" selected
      And I verified that counter of "filters" shows "0" of "2" selected

     When I clicked attribute "Month"
      And I clicked metric "Profit"
      And I ensured attribute is selected and I clicked forms { "Subcategory": ["ID"] }
      And I selected filters { "Subcategory" : ["Alternative", "Pop"] }

     Then I verified that counter of "metrics" shows "3" of "4" selected
      And I verified that counter of "attributes" shows "1" of "2" selected
      And I verified that counter of "filters" shows "1" of "2" selected
     
     When I clicked "Import Data" button after Edit
      And I closed last notification 
     Then I verified that cells ["G4", "H4", "I8", "K4"] have values ["", "Total", "", "$ 1,197,222"]

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Report with prompt - Object prompt | Required | Default answer"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button without checking results
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed last notification

     When I clicked Edit in options for object 1 in group 2
      And I unselected "Subcategory" as an answer for "1. Objects" prompt - object prompt
      And I unselected "Category" as an answer for "1. Objects" prompt - object prompt
      And I selected "Year" as an answer for "1. Objects" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button

      And I verified that Columns & Filters Selection is visible
      And I clicked metric "Profit"
      And I clicked metric "Profit"

     When I clicked "Import Data" button after Edit
      And I closed last notification 
     Then I verified that cells ["A1", "B4", "D1"] have values ["Year", "$2,249,397", ""]

      And I logged out
