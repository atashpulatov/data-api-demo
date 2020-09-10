@mac_chrome
Feature: F25949 - Display filters and prompts

  Scenario: [TC67533] - Update values on edit and refresh
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

     When I found object by ID "E659E86811E58C918D6F0080EF453539" and selected "Simple Report"
      And I clicked Import button
      And I closed last notification
      And I clicked toggle details button on object 1

     Then object 1 has id "E659E86811E58C918D6F0080EF453539"

     When I ensured object "E659E86811E58C918D6F0080EF453539" in Tutorial project is decertified
      And I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
      And I clicked toggle details button on object 1

     Then object 1 is NOT certified

     When I certified object "E659E86811E58C918D6F0080EF453539" in Tutorial project
      And I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
      And I clicked toggle details button on object 1

     Then object 1 is certified

     When I decertified object "E659E86811E58C918D6F0080EF453539" in Tutorial project
      And I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
      And I clicked toggle details button on object 1

     Then object 1 is NOT certified

     When I selected cell "F1"
      And I clicked Add Data button
      And I found object by ID "074DC2204EC5FC4C17387495F0FA953F" and selected "Subtotals"
      And I clicked Import button
      And I closed last notification
      And I clicked toggle details button on object 1

     Then for object 1 Totals and Subtotals is ON

     When I clicked Edit object 1
      And I clicked Include Subtotals and Totals switch
      And I clicked Import button
      And I closed last notification
      And I clicked toggle details button on object 1

     Then for object 1 Totals and Subtotals is OFF

    Given object 1 has "Attribute" list displayed
      And object 1 has "Attribute" with value "Quarter‎, Region, Employee"
      And object 1 has "Metric" list displayed
      And object 1 has "Metric" with value "Revenue, Cost, Profit"

     When I clicked Edit object 1
      And I clicked attribute "Employee"
      And I clicked metric "Revenue"
      And I selected filters { "Region" : ["Central", "Northwest"] }
      And I clicked Import button
      And I closed last notification
      And I clicked toggle details button on object 1

     Then object 1 has "Attribute" with value "Quarter‎, Region"
      And object 1 has "Metric" with value "Cost, Profit"
      And object 1 has "Filter" with value "Region (Central, Northwest)"

      And I log out
