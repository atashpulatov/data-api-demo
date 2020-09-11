@mac_chrome
@windows_chrome
Feature: F22955 - Refresh data already imported to the workbook (including prompt)

  Scenario: [TC48137] - Refresh an edited report with prompt
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

     When I found object by ID "33EE1C4B41568BF0346FCFADE7AA49D0" and selected "Report with prompt - Value prompt - Numeric (Year) | Required | Default answer"
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed last notification

     Then cells ["A1", "B2", "D3"] should have values ["Year", "Central", "$159,339"]

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
      And I unselected all attributes
      And I unselected all metrics
      And I clicked attribute "Region"
      And I clicked metric "Profit"
      And I selected filters { "Category": ["Books"] }
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

     Then cells ["A1", "B2", "D3"] should have values ["Region", "$21,190", ""]

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification

     Then cells ["A1", "B2", "D3"] should have values ["Region", "$21,190", ""]

      And I log out
