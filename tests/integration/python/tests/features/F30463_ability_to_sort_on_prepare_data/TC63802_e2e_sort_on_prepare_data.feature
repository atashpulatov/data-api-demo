@mac_chrome
Feature: F30463 - Ability to sort on prepare data

  Scenario: [TC63802] - E2E Sort on prepare data
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found and selected object "Report with attributes and metrics to sort"
      And I clicked Prepare Data button
      And I verified that Columns & Filters Selection is visible

     Then attribute number 1 should be called "Age Range"

     When I changed sort order of "attributes" to ascending by click
     Then attribute number 1 should be called "Age Range"

     When I changed sort order of "attributes" to descending by click
     Then attribute number 1 should be called "Zip Code"

     When I changed sort order of "attributes" to default by click
     Then attribute number 1 should be called "Age Range"

     Then metric number 1 should be called "Average Revenue"
     When I changed sort order of "metrics" to ascending by click

     Then metric number 1 should be called "Average Revenue"

     When I changed sort order of "metrics" to descending by click
     Then metric number 1 should be called "Sales Rank"

     When I changed sort order of "metrics" to default by click
     Then metric number 1 should be called "Average Revenue"
      And filter number 1 should be called "Age Range"

     When I changed sort order of "filters" to ascending by click
     Then filter number 1 should be called "Age Range"

     When I changed sort order of "filters" to descending by click
     Then filter number 1 should be called "Zip Code"

     When I changed sort order of "filters" to default by click
     Then filter number 1 should be called "Age Range"

     When I searched for element called "Age"
      And I pressed tab until sorting "attributes" is focused
      And I changed sort order of "attributes" to ascending by pressing Enter

     Then attribute number 1 should be called "Age Range"

     When I changed sort order of "attributes" to descending by pressing Enter
     Then attribute number 1 should be called "Phone Usage"

     When I changed sort order of "attributes" to default by pressing Enter
      And I pressed tab until sorting "metrics" is focused
      And I changed sort order of "metrics" to ascending by pressing Enter

     Then metric number 1 should be called "Average Revenue"

     When I changed sort order of "metrics" to descending by pressing Enter
     Then metric number 1 should be called "Running Revenue Average"

     When I changed sort order of "metrics" to default by pressing Enter
      And I pressed tab until sorting "filters" is focused
      And I changed sort order of "filters" to ascending by pressing Enter

     Then filter number 1 should be called "Age Range"

     When I changed sort order of "filters" to descending by pressing Enter
     Then filter number 1 should be called "Phone Usage"

     When I changed sort order of "filters" to default by pressing Enter
      And I cleared the search for element with backspace
      And I selected "attributes" element number 1
      And I expanded attribute forms of attribute number 1

     Then attribute form number 1 of attribute number 1 should be called "DESC"

     When I collapsed attribute forms of attribute number 1
      And I deselected "attributes" element number 1
      And I changed sort order of "attributes" to descending by click
      And I scrolled into "attributes" element number 30
      And I selected "attributes" element number 30
      And I expanded attribute forms of attribute number 30

     Then attribute form number 1 of attribute number 30 should be called "DESC"

     When I collapsed attribute forms of attribute number 30
      And I deselected "attributes" element number 30
      And I changed sort order of "attributes" to default by click
      And I selected all attributes
      And I selected all metrics

     When I clicked Import button in Columns and Filters Selection
      And I closed last notification

      And I log out
