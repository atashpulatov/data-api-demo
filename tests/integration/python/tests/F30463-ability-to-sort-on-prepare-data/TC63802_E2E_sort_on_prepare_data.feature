@windows_desktop
@windows_chrome
@mac_chrome
Feature: F30463 - Ability to sort on prepare data

  Scenario: [TC63802] - E2E Sort on prepare data
    #Given I logged in as default user
    Given I pass
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "Report with attributes and metrics to sort"
      And I clicked Prepare Data button
      And I ensure that Columns & Filters Selection is visible

      Then attribute number 1 should be called "Age Range"
      And I sort "attributes" to ascending order by click
      Then attribute number 1 should be called "Age Range"
      And I sort "attributes" to descending order by click
      Then attribute number 1 should be called "Zip Code"
      And I sort "attributes" to default order by click
      Then attribute number 1 should be called "Age Range"

      Then metric number 1 should be called "Average Revenue"
      And I sort "metrics" to ascending order by click
      Then metric number 1 should be called "Average Revenue"
      And I sort "metrics" to descending order by click
      Then metric number 1 should be called "Sales Rank"
      And I sort "metrics" to default order by click
      Then metric number 1 should be called "Average Revenue"

      Then filter number 1 should be called "Age Range"
      And I sort "filters" to ascending order by click
      Then filter number 1 should be called "Age Range"
      And I sort "filters" to descending order by click
      Then filter number 1 should be called "Zip Code"
      And I sort "filters" to default order by click
      Then filter number 1 should be called "Age Range"

      And I search for element called "Age"
      And I press tab until sorting "attributes" is focused
      And I press Enter to sort "attributes" ascending order by keyboard
      Then attribute number 1 should be called "Age Range"
      And I press Enter to sort "attributes" descending order by keyboard
      Then attribute number 1 should be called "Phone Usage"
      And I press Enter to sort "attributes" default order by keyboard

      And I press tab until sorting "metrics" is focused
      And I press Enter to sort "metrics" ascending order by keyboard
      Then metric number 1 should be called "Average Revenue"
      And I press Enter to sort "metrics" descending order by keyboard
      Then metric number 1 should be called "Running Revenue Average"
      And I press Enter to sort "metrics" default order by keyboard

      And I press tab until sorting "filters" is focused
      And I press Enter to sort "filters" ascending order by keyboard
      Then filter number 1 should be called "Age Range"
      And I press Enter to sort "filters" descending order by keyboard
      Then filter number 1 should be called "Phone Usage"
      And I press Enter to sort "filters" default order by keyboard

      And I clear the search for element with backspace
      And I select "attributes" element number 1
      And I "expand" attribute forms of attribute number 1
      Then attribute form number 1 of attribute number 1 should be called "DESC"
      And I "collapse" attribute forms of attribute number 1
      And I select "attributes" element number 1
      And I sort "attributes" to descending order by click
      And I scroll into "attributes" element number 30
      And I select "attributes" element number 30
      And I "expand" attribute forms of attribute number 30
      Then attribute form number 1 of attribute number 30 should be called "DESC"
      And I "collapse" attribute forms of attribute number 30
      And I deselect "attributes" element number 30
      And I sort "attributes" to default order by click

      And I selected all attributes
      And I selected all metrics

      And I log source
      When I clicked Import button in Columns and Filters Selection
      And I closed last notification

      And I log out