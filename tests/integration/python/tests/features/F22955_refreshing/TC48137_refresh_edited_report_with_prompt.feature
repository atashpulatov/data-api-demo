Feature: F22955 - Refresh data already imported to the workbook (including prompt)

  Scenario: [TC48137] - Refresh an edited report with prompt
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      

     When I found and selected object "Report with prompt - Value prompt - Numeric (Year) | Required | Default answer"
      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      And I clicked Import with options button without checking results
      And I selected "2021" as an answer for "1. Select Year" prompt - object prompt
      And I waited for Run button to be enabled
      And I clicked Run button
      And I closed last notification

     Then I verified that cell "D3" has value "Electronics"

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
      And I unselected all attributes
      And I unselected all metrics
      And I clicked attribute "Region"
      And I clicked metric "Profit"
      And I selected filters { "Category": ["Books"] }
      And I clicked Import Data button in Columns and Filters Selection without success check
      And I closed last notification

     Then I verified that cells ["A1", "B2", "D3"] have values ["Region", "$21,190", ""]

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification

     Then I verified that cells ["A1", "B2", "D3"] have values ["Region", "$21,190", ""]

      And I logged out
