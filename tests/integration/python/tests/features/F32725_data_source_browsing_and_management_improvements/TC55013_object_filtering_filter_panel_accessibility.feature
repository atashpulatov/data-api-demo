@mac_chrome
Feature: F32725 - Data source browsing and management improvements

  Scenario: [TC55013] - Filter panel Accessibility
    Given I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I clicked Filters button

     When I pressed key Tab
     Then element "first checkbox in Applications" has focus

     When I pressed key Tab
     Then element "Applications All button" has focus

     When I pressed key Arrow Left
     Then element "View Selected switch" has focus

     When I pressed key Tab
     Then element "Search input" has focus

     When I pressed key Tab
     Then element "first checkbox in All Panel" has focus

     When I pressed key Tab
     Then element "Select All button in All Panel" has focus

     When I pressed key Arrow Right
     Then element "Applications All button" has focus

     When I pressed key Tab
     Then element "checkbox for Report" has focus

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

     When I pressed key Tab
     Then element "checkbox for Certified" has focus

     When I pressed key Tab
     Then element "first checkbox in Owners" has focus

     When I pressed key Tab
     Then element "Owners All button" has focus

     When I pressed key Arrow Left
     Then element "View Selected switch" has focus

      And I log out
