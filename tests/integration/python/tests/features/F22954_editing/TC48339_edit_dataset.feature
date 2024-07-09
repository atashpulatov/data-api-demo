Feature: F22954 - Edit dataset

  Scenario: [TC48339] Editing dataset
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      
      And I found and selected object "Category Performance Dataset"

      And I verified that Import with options button is enabled
      And I clicked options button
      And I verified that "Import Data" option is enabled in options dropdown
      And I selected "Import Data" option in options dropdown
      When I clicked Import with options button

      And I closed last notification
     Then I verified that cell "A2" has value "Central"

     When I clicked Edit object 1
      And I unselected all attributes
      And I unselected all metrics
      And I clicked metric "Revenue"
      And I clicked attribute "Region"
      And I selected filters { "Region": ["Asia", "Europe", "North America"] }
      And I clicked Import Data button in Columns and Filters Selection without success check
      And I closed last notification

     Then I verified that cells ["A1", "B2"] have values ["Region", "15233245.15"]

      And I logged out
