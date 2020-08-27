@mac_chrome
Feature: F22954 - Edit dataset

  Scenario: [TC48339] Editing dataset
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"

     When I clicked Import button
      And I closed last notification
     Then cells ["A1", "B2"] should have values ["Country", "Clothes"]

      And I clicked Edit object 1
      And I unselected all attributes
      And I unselected all metrics      
      And I clicked metric "Total Cost"
      And I clicked attribute for dataset "Region"
      And I selected filters { "Region" : ["Asia", "Europe", "North America"] }


     When I clicked Import button in Columns and Filters Selection
      And I closed last notification
     Then cells ["A1", "B2"] should have values ["Region", "15233245.15"]

      And I log out
