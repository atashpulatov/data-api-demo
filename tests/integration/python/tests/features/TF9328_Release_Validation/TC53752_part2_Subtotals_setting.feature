#@ci_pipeline_postmerge_windows_chrome
Feature: TF9328 - Release Validation

  Scenario: [TC53752] - Part 2 [Subtotals settings] E2E Importing report with subtotals | Edit to import without subtotals
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      
      And I found and selected object "Report Totals Subtotals 1"
      And I clicked Prepare Data button
     Then I verified that Columns & Filters Selection is visible
      And I verified subtotal toggle is visible

     When I selected all attributes
      And I selected all metrics
      And I clicked Include Subtotals and Totals switch
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B3", "D2"] have values ["USA", "$157,963"]

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Prompted report with crosstab and subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I verified that Columns & Filters Selection is visible
      And I verified subtotal toggle is visible

     When I clicked Include Subtotals and Totals switch
      And I selected all attributes
      And I selected all metrics
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B7", "C4", "AV14"] have values ["USA", "", "$3,319,225"]

     When I refreshed all objects
      And I waited for all progress notifications to disappear
      And I closed all notifications
     Then I verified that cells ["B7", "C4", "AV14"] have values ["USA", "", "$3,319,225"]

     When I selected worksheet number 1
     Then I verified that cells ["B1", "J3", "A11"] have values ["Country", "", "Boston"]

     When I selected worksheet number 2
     Then I verified that cells ["B1", "D3", "M3"] have values ["Region", "Profit", "Cost"]

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Report without subtotals"
      And I clicked Prepare Data button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found and selected object "Report based on cube without subtotals"
      And I clicked Prepare Data button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found and selected object "Refresh prompted report"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found and selected object "Report with crosstab and without subtotals"
      And I clicked Prepare Data button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found and selected object "Category Performance Dataset"
      And I clicked Prepare Data button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found and selected object "Prompted report with attributes with and without subtotals"
      And I clicked Prepare Data button
      And I unselected "Category" as an answer for "1. Objects" prompt - object prompt
      And I selected "Subcategory" as an answer for "1. Objects" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I verified subtotal toggle is visible

     When I selected all attributes
      And I selected all metrics
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B1", "D2"] have values ["Avg (Item)", "$5,293,624"]
      And I verified that bold button is selected for cell "D2"
      And I verified that object number 1 is called "Prompted report with attributes with and without subtotals"

      And I logged out
