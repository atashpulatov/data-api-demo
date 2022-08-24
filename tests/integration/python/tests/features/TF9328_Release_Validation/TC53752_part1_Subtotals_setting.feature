#@ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@ci_pipeline_rv_windows_chrome
#@ci_pipeline_rv_mac_chrome
@todo_windows_desktop @disabled_windows_chrome @disabled_mac_chrome
@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC53752] - Part 1 [Subtotals settings] E2E Importing report with subtotals | without subtotals | refresh | refresh all
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "51DB6FC611EA638917E80080EFD5ACB1" and selected "Report based on cube with subtotals"
      And I clicked Prepare Data button
     Then I verified that Columns & Filters Selection is visible
      And I verified subtotal toggle is visible

     When I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification
     Then I verified that cells ["B1", "J3", "H3"] have values ["Item Type", "81320.96", "Maximum"]
      And I verified that bold button is selected for cell "H3"
      And I verified that object number 1 is called "Report based on cube with subtotals"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["B1", "J3", "H3"] have values ["Item Type", "81320.96", "Maximum"]
      And I verified that bold button is selected for cell "H3"

     When I clicked Edit object 1
     Then I verified that Columns & Filters Selection is visible

     When I clicked Include Subtotals and Totals switch
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B1", "J3", "H3"] have values ["Item Type", "2104134.98", "27/04/2011"]

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
     Then I verified that Columns & Filters Selection is visible
      And I verified subtotal toggle is visible

     When I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B1", "C7", "B8"] have values ["Subcategory", "$1,164", "Total"]
      And I verified that bold button is selected for cell "D8"
      And I verified that object number 1 is called "Report with a subtotal & prompt"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["B1", "C7", "B8"] have values ["Subcategory", "$1,164", "Total"]
      And I verified that bold button is selected for cell "D8"

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I verified that Columns & Filters Selection is visible

     When I clicked Include Subtotals and Totals switch
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B1", "C7", "B8"] have values ["Subcategory", "$1,164", "Art & Architecture"]

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "B570B68011EA637625CE0080EF65F1FA" and selected "Report with crosstab and subtotals"
      And I clicked Prepare Data button
     Then I verified that Columns & Filters Selection is visible
      And I verified subtotal toggle is visible

     When I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B1", "B7", "C4", "W9"] have values ["Region", "Total", "", "$1"]
      And I verified that bold button is selected for cell "W10"
      And I verified that object number 1 is called "Report with crosstab and subtotals"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["B1", "B7", "C4", "W9"] have values ["Region", "Total", "", "$1"]
      And I verified that bold button is selected for cell "W10"

     When I clicked Edit object 1
     Then I verified that Columns & Filters Selection is visible

     When I clicked Include Subtotals and Totals switch
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B1", "B7", "C4", "W9"] have values ["Region", "USA", "", "$1,263,442"]

      And I logged out
