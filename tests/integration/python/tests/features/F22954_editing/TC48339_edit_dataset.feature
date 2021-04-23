@ci_pipeline_daily_windows_chrome
@ci_pipeline_daily_mac_chrome
@windows_desktop
@mac_chrome
@windows_chrome
Feature: F22954 - Edit dataset

  Scenario: [TC48339] Editing dataset
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "8738171C11E97AED00000080EF155102" and selected "100_dataset"

     When I clicked Import button
      And I closed last notification

     Then I verified that cells ["A1", "B2"] have values ["Country", "Clothes"]

     When I clicked Edit object 1
      And I unselected all attributes
      And I unselected all metrics
      And I clicked metric "Total Cost"
      And I clicked attribute "Region" for dataset
      And I selected filters { "Region": ["Asia", "Europe", "North America"] }
      And I clicked Import button in Columns and Filters Selection
      And I closed last notification

     Then I verified that cells ["A1", "B2"] have values ["Region", "15233245.15"]

      And I logged out
