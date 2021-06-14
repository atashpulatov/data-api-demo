@ci_pipeline_rv_windows_chrome
@ci_pipeline_rv_mac_chrome
@mac_chrome
@windows_chrome
@release_validation
Feature: F21402 - Support for prompted reports while importing data for Excel add-in

  Scenario: [TC62674] - E2E Editing all types of prompted reports, except nested
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "CDE36AFC11EA6220B17C0080EF054542" and selected "Report with all type of prompts (except nested)"

     When I clicked Prepare Data button
      And I waited for Run button to be enabled
      And I unselected "Subcategory" as an answer for "1. Objects" prompt - object prompt
      And I selected "Books" as an answer for "3. Category" prompt - object prompt
      And I typed "2015" for "4. Year" prompt - value prompt
      And I typed "1820" for "7. Big decimal" prompt - value prompt
      And I typed "12/12/2015" and ["08", "15", "00"] for "8. Date&Time" prompt - date prompt
      And I cleared input box for prompt "9. Number"
      And I typed "2015" for "9. Number" prompt - value prompt
      And I clicked Run button
     # Verify wheter next step can be reliably tested due to button being enabled with varying, usually short delays
     Then I verified Run button is disabled or not present
      And I verified that Columns & Filters Selection is visible
      And I verified popup title is "Report with all type of prompts (except nested)"
      And I verified that Import button is disabled

     When I selected all attributes
      And I clicked metric "Revenue"
     Then I verified that Import button is enabled

     When I selected filter "Year" with all elements
      And I selected filters { "Region": ["Central", "South"] }
     Then I verified that counter of "metrics" shows "1" of "3" selected
      And I verified that counter of "attributes" shows "3" of "3" selected
      And I verified that counter of "filters" shows "2" of "3" selected

     When I clicked Import button in Columns and Filters Selection
      And I closed last notification
     Then I verified that cells ["A2", "C3"] have values ["2015", "Books"]

     When I clicked Refresh on object 1
     Then I verified that cells ["A2", "C3", "E3"] have values ["2015", "Books", ""]

     When I clicked Edit object 1
      And I selected "Subcategory" as an answer for "1. Objects" prompt - object prompt
      And I selected "Movies" as an answer for "3. Category" prompt - object prompt
      And I cleared input box for prompt "4. Year"
      And I typed "2016" for "4. Year" prompt - value prompt
      And I cleared input box for prompt "9. Number"
      And I typed "2016" for "9. Number" prompt - value prompt
      And I clicked Run button
      # Verify wheter next step can be reliably tested due to button being enabled with varying, usually short delays
      Then I verified Run button is disabled or not present
      And I verified that Columns & Filters Selection is visible
      And I verified popup title is "Report with all type of prompts (except nested)"
      And I verified that counter of "metrics" shows "1" of "3" selected
      And I verified that counter of "attributes" shows "3" of "4" selected
      And I verified that counter of "filters" shows "1" of "4" selected
      And I verified that Import button is enabled

     When I clicked metric "Profit"
      And I clicked attribute "Subcategory"
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification
     Then I verified that cells ["A2", "C3", "E3"] have values ["2016", "Books", "$5,137"]

     When I clicked Refresh on object 1
      And I closed last notification
     Then I verified that cells ["A2", "C3", "E3"] have values ["2016", "Books", "$5,137"]

      And I logged out
