@mac_chrome
@release_validation
@ga_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC48976] - E2E Basic Functionality
    Given I pass

     When I logged in with username "wrong_user_name" and password "wrong_password"
     Then I verified that I saw authentication error and I clicked OK

     When I closed Log In popup
      And I logged in with username "b" and empty password
     Then I verified that I saw "No MicroStrategy for Office privileges" message and I clicked Try Again

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object "Seasonal"
      And I cleared search box
      And I found object "no_such_object"
      And I cleared search box
      And I found object by ID "13CFD83A458A68655A13CBA8D7C62CD5" and selected "01 Basic Report"
      And I clicked Prepare Data button
     
     Then I verified that Columns & Filters Selection is visible
      And I verified popup title is "01 Basic Report"
      And I verified that counter of "attributes" shows "0" of "2" selected
      And I verified that counter of "metrics" shows "0" of "3" selected
      And I verified that counter of "filters" shows "0" of "2" selected

     When I selected all attributes
      And I clicked attribute "Employee"
     Then I verified that counter of "attributes" shows "1" of "2" selected

     When I selected all metrics
      And I clicked metric "Profit"
      And I clicked metric "Cost"

     Then I verified that counter of "metrics" shows "1" of "3" selected
      And I verified that counter of "filters" shows "0" of "2" selected

     When I selected filter "Region" with all elements
     Then I verified that counter of "filters" shows "1" of "2" selected
      And I searched for element called "c"
      And I searched for element called "cc"
      And I cleared the search for element with backspace
      And I changed sort order of "attributes" to ascending by click
      And I changed sort order of "metrics" to ascending by click
      And I changed sort order of "filters" to ascending by click
      And attribute number 1 should be called "Employee"
      And attribute number 2 should be called "Region"
      And metric number 1 should be called "Cost"
      And metric number 2 should be called "Profit"
      And metric number 3 should be called "Revenue"
      And filter number 1 should be called "Employee"

      And I changed sort order of "attributes" to descending by click
      And I changed sort order of "metrics" to descending by click
      And I changed sort order of "filters" to descending by click
      And attribute number 1 should be called "Region"
      And attribute number 2 should be called "Employee"
      And metric number 1 should be called "Revenue"
      And metric number 2 should be called "Profit"
      And metric number 3 should be called "Cost"
      And filter number 2 should be called "Employee"
      And I changed sort order of "attributes" to default by click
      And I changed sort order of "metrics" to default by click
      And I changed sort order of "filters" to default by click
      And attribute number 1 should be called "Region"
      And attribute number 2 should be called "Employee"
      And metric number 1 should be called "Revenue"
      And metric number 2 should be called "Cost"
      And metric number 3 should be called "Profit"
      And filter number 2 should be called "Employee"
      And I verified that counter of "attributes" shows "1" of "2" selected
      And I verified that counter of "metrics" shows "1" of "3" selected
      And I verified that counter of "filters" shows "1" of "2" selected

     When I selected all attributes
      And I selected all metrics
      And I selected filter "Region" with all elements
      And I clicked Data Preview button
      And I clicked Close Preview button
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification
      And I selected cell "H1"
      And I clicked Add Data button
      And I found object "100_dataset"
      And I found object "100_report"
      And I cleared search box
      And I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"
     Then I verified that the background color of the first object is "rgba(240, 247, 254, 1)"

     When I clicked Prepare Data button
     Then I verified that Columns & Filters Selection is visible
      And I verified popup title is "100_dataset"
      And I verified that counter of "attributes" shows "0" of "8" selected
      And I verified that counter of "metrics" shows "0" of "7" selected
      And I verified that counter of "filters" shows "0" of "8" selected

     When I selected all metrics
      And I clicked metric "Row Count - 100 Sales Records.csv"
      And I clicked metric "Total Profit"
      And I clicked metric "Total Cost"
      And I clicked metric "Total Revenue"
     Then I verified that counter of "metrics" shows "3" of "7" selected

     When I selected all attributes
      And I clicked attribute "Ship Date" for dataset
      And I clicked attribute "Order ID" for dataset
      And I clicked attribute "Order Date" for dataset
      And I clicked attribute "Order Priority" for dataset
      And I clicked attribute "Sales Channel" for dataset
     Then I verified that counter of "attributes" shows "3" of "8" selected
      And I verified that counter of "filters" shows "0" of "8" selected

     When I selected filter "Region" with all elements
     Then I verified that counter of "filters" shows "1" of "8" selected

     When I searched for element called "f"
      And I searched for element called "ff"
      And I cleared the search for element with backspace
     Then I verified that counter of "attributes" shows "3" of "8" selected
      And I verified that counter of "metrics" shows "3" of "7" selected
      And I verified that counter of "filters" shows "1" of "8" selected

     When I clicked Data Preview button
      And I clicked Close Preview button
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification
      And I clicked on object 2
     Then columns ["A", "B", "C"] are selected
      And rows ["1", "2", "3"] are selected

     When I clicked Refresh on object 2
      And I closed last notification
      And I clicked on object 1
     Then columns ["H", "I", "J"] are selected
      And rows ["1", "2", "3"] are selected

     When I clicked Edit object 1
     Then I verified that Columns & Filters Selection is visible
      And I verified popup title is "100_dataset"
      And I verified that counter of "attributes" shows "3" of "8" selected
      And I verified that counter of "metrics" shows "3" of "7" selected
      And I verified that counter of "filters" shows "1" of "8" selected

     When I clicked attribute "Item Type" for dataset
      And I clicked metric "Unit Cost"
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification
      And I clicked on object 1
     Then columns ["H", "I", "J"] are selected
      And rows ["1", "2", "3"] are selected

     When I removed object 2 using icon
      And I closed last notification
      And I removed object 1 using icon
      And I closed all notifications
      And I logged out