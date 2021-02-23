@todo_windows_desktop
Feature: F32725 - Data source browsing and management improvements

  Scenario: [TC55013] - Filter panel Accessibility
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I clicked Filters button

      And I pressed Tab key until element "first checkbox in Applications" has focus
      And I pressed Tab key until element "Applications All button" has focus

     When I pressed key Arrow Left
     Then element "View Selected switch" has focus

      And I pressed Tab key until element "Search input" has focus
      And I pressed Tab key until element "first checkbox in All Panel" has focus
      And I pressed Tab key until element "Select All button in All Panel" has focus

     When I pressed key Arrow Right
     Then element "Applications All button" has focus

      And I pressed Tab key until element "checkbox for Report" has focus

     When I pressed key Arrow Down
     Then element "checkbox for Dataset" has focus

     When I pressed key Arrow Down
     Then element "checkbox for Dossier" has focus

     When I pressed key Arrow Up
     Then element "checkbox for Dataset" has focus

     When I pressed key Arrow Left
     Then element "Select All button in All Panel" has focus

     When I pressed key Arrow Right
     Then element "checkbox for Dataset" has focus

      And I pressed Tab key until element "checkbox for Certified" has focus
      And I pressed Tab key until element "first checkbox in Owners" has focus
      And I pressed Tab key until element "Owners All button" has focus

     When I pressed key Arrow Left
     Then element "View Selected switch" has focus

      And I closed Import Data popup
      And I logged out
