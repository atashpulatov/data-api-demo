@mac_chrome
@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC53752] - [Subtotals settings] E2E Importing report with subtotals | without subtotals | edit to import without subtotals | refresh | refresh all | stability of the toggle | accessibility
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
      And for cell "H3" bold button should be selected
      And object number 1 should be called "Report based on cube with subtotals"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["B1", "J3", "H3"] have values ["Item Type", "81320.96", "Maximum"]
      And for cell "H3" bold button should be selected

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
      And for cell "D8" bold button should be selected
      And object number 1 should be called "Report with a subtotal & prompt"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["B1", "C7", "B8"] have values ["Subcategory", "$1,164", "Total"]
      And for cell "D8" bold button should be selected

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
      And for cell "W10" bold button should be selected
      And object number 1 should be called "Report with crosstab and subtotals"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["B1", "B7", "C4", "W9"] have values ["Region", "Total", "", "$1"]
      And for cell "W10" bold button should be selected

     When I clicked Edit object 1
     Then I verified that Columns & Filters Selection is visible

     When I clicked Include Subtotals and Totals switch
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B1", "B7", "C4", "W9"] have values ["Region", "USA", "", "$1,263,442"]

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "55F93DF611EA6378261F0080EF2572FC" and selected "Report Totals Subtotals 1"
      And I clicked Prepare Data button
     Then I verified that Columns & Filters Selection is visible
      And I verified subtotal toggle is visible

     When I selected all attributes
      And I selected all metrics
      And I clicked Include Subtotals and Totals switch
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B3", "D2"] have values ["USA", "$157,963"]

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "93E7685C11EA638E201A0080EF65CAAE" and selected "Prompted report with crosstab and subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I verified that Columns & Filters Selection is visible
      And I verified subtotal toggle is visible

     When I clicked Include Subtotals and Totals switch
      And I selected all attributes
      And I selected all metrics
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B7", "C4", "AV14"] have values ["USA", "", "$3,319,225"]

     When I refreshed all objects
      And I waited for all progress notifications to disappear
      And I closed all notifications
     Then I verified that cells ["B7", "C4", "AV14"] have values ["USA", "", "$3,319,225"]

     When I selected worksheet number 1
     Then I verified that cells ["B1", "J3", "H3"] have values ["Item Type", "2104134.98", "27/04/2011"]

     When I selected worksheet number 2
     Then I verified that cells ["B1", "C7", "B8"] have values ["Subcategory", "$1,164", "Art & Architecture"]

     When I selected worksheet number 3
     Then I verified that cells ["B1", "B7", "C4", "W9"] have values ["Region", "USA", "", "$1,263,442"]

     When I selected worksheet number 4
     Then I verified that cells ["B3", "D2"] have values ["USA", "$157,963"]

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "2EC1D90411EA637440E90080EF351110" and selected "Report without subtotals"
      And I clicked Prepare Data button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found object by ID "3150CF6211EA6389F4C20080EF450B10" and selected "Report based on cube without subtotals"
      And I clicked Prepare Data button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found object by ID "0CBC6BF611EA638A25610080EF55ABB0" and selected "Prompted report without subtotals"
      And I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I clicked Run button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found object by ID "AFED6AAC11EA6374261F0080EFC5B2FB" and selected "Report with crosstab and without subtotals"
      And I clicked Prepare Data button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
      And I clicked Prepare Data button
     Then I verified subtotal toggle is NOT visible

     When I clicked Back button
      And I cleared search box
      And I found object by ID "693833FC11EA64517EC80080EF0592AE" and selected "Prompted report with attributes with and without subtotals"
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
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B1", "D2"] have values ["Avg (Item)", "$5,293,624"]
      And for cell "D2" bold button should be selected
      And object number 1 should be called "Prompted report with attributes with and without subtotals"

      And I logged out
