@mac_chrome
@release_validation
@11.3.1
Feature: F21402 - Support for prompted reports while importing data for Excel add-in

  Scenario: [TC62676] - Editing prompted reports functionality while report contains nested prompts imported without Prepare Data
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I found object by ID "ABC9ACA2496777EE3FB81BA08A3CF9AD" and selected "Report with nested prompt"
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I clicked Run button
      And I waited for Run button to be enabled
      And I clicked Run button
      # TODO Then I verified Run button is disabled
      And I closed last notification
      And cells ["A2", "C3", "E3"] should have values ["2014", "Electronics", "$906,661"]

     When I clicked Refresh on object 1
     Then cells ["A2", "C3", "E3"] should have values ["2014", "Electronics", "$906,661"]

     When I clicked Edit object 1
      And I waited for Run button to be enabled
      And I clicked Run button
      And I waited for Run button to be enabled
      And I selected "Year" as an answer for "1. Choose from a list of attributes/hierarchies to define level." prompt - object prompt
      And I clicked Run button
      # TODO Then I verified Run button is disabled
      And I verified that Columns & Filters Selection is visible
      And I verified popup title is "Report with nested prompt"
      And I verified that counter of "metrics" shows "3" of "3" selected
      And I verified that counter of "attributes" shows "3" of "3" selected
      And I verified that counter of "filters" shows "0" of "3" selected

     When I clicked metric "Profit"
      And I clicked attribute "Region"
      And I selected filters { "Region": ["Central", "South"] }
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification
     Then cells ["A2", "C3", "E3"] should have values ["2014", "$1,891,551", ""]

      And I logged out
