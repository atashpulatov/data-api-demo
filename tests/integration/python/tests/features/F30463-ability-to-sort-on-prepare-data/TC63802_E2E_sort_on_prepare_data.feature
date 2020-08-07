@windows_desktop
@windows_chrome
@mac_chrome
Feature: F30463 - Ability to sort on prepare data

  Scenario: [TC63802] - E2E Sort on prepare data
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "Report with attributes and metrics to sort"
      And I clicked Prepare Data button
      And I ensure that Columns & Filters Selection is visible

     Then attribute number 1 should be called "Age Range"

     When I sorted "attributes" to ascending order by click
     Then attribute number 1 should be called "Age Range"

     When I sorted "attributes" to descending order by click
     Then attribute number 1 should be called "Zip Code"

     When I sorted "attributes" to default order by click
     Then attribute number 1 should be called "Age Range"

     Then metric number 1 should be called "Average Revenue"
     When I sorted "metrics" to ascending order by click
      
     Then metric number 1 should be called "Average Revenue"

     When I sorted "metrics" to descending order by click
     Then metric number 1 should be called "Sales Rank"

     When I sorted "metrics" to default order by click
     Then metric number 1 should be called "Average Revenue"
      And filter number 1 should be called "Age Range"

     When I sorted "filters" to ascending order by click
     Then filter number 1 should be called "Age Range"

     When I sorted "filters" to descending order by click
     Then filter number 1 should be called "Zip Code"

     When I sorted "filters" to default order by click
     Then filter number 1 should be called "Age Range"

     When I searched for element called "Age"
      And I pressed tab until sorting "attributes" is focused
      And I pressed Enter to sort "attributes" ascending order by keyboard
      
     Then attribute number 1 should be called "Age Range"

     When I pressed Enter to sort "attributes" descending order by keyboard
     Then attribute number 1 should be called "Phone Usage"

     When I pressed Enter to sort "attributes" default order by keyboard
      And I pressed tab until sorting "metrics" is focused
      And I pressed Enter to sort "metrics" ascending order by keyboard
      
     Then metric number 1 should be called "Average Revenue"

     When I pressed Enter to sort "metrics" descending order by keyboard
     Then metric number 1 should be called "Running Revenue Average"

     When I pressed Enter to sort "metrics" default order by keyboard
      And I pressed tab until sorting "filters" is focused
      And I pressed Enter to sort "filters" ascending order by keyboard
      
     Then filter number 1 should be called "Age Range"

     When I pressed Enter to sort "filters" descending order by keyboard
     Then filter number 1 should be called "Phone Usage"
      
     When I pressed Enter to sort "filters" default order by keyboard
      And I cleared the search for element with backspace
      And I selected "attributes" element number 1
      And I expanded attribute forms of attribute number 1
      
     Then attribute form number 1 of attribute number 1 should be called "DESC"

     When I collapsed attribute forms of attribute number 1
      And I deselected "attributes" element number 1
      And I sorted "attributes" to descending order by click
      And I scrolled into "attributes" element number 30
      And I selected "attributes" element number 30
      And I expanded attribute forms of attribute number 30
      
     Then attribute form number 1 of attribute number 30 should be called "DESC"

     When I collapsed attribute forms of attribute number 30
      And I deselected "attributes" element number 30
      And I sorted "attributes" to default order by click
      And I selected all attributes
      And I selected all metrics
      
     When I clicked Import button in Columns and Filters Selection
      And I closed last notification

      And I log out