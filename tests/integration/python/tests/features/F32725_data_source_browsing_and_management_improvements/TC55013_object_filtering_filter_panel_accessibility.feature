Feature: F32725 - Data source browsing and management improvements

  Scenario: [TC55013] - Filter panel Accessibility
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I clicked Filters button

     When I pressed key Tab
     Then I verified that element "first checkbox in Applications" has focus

     When I pressed key Tab
     Then I verified that element "Applications All button" has focus

     When I pressed key Arrow Left
     Then I verified that element "View Selected switch" has focus

     When I pressed key Tab
     Then I verified that element "Search input" has focus

     When I pressed key Tab
     Then I verified that element "first checkbox in All Panel" has focus

     When I pressed key Tab
     Then I verified that element "Select All button in All Panel" has focus

     When I pressed key Arrow Right
     Then I verified that element "Applications All button" has focus

     When I pressed key Tab
     Then I verified that element "checkbox for Report" has focus

     When I pressed key Arrow Down
     Then I verified that element "checkbox for Dataset" has focus

     When I pressed key Arrow Down
     Then I verified that element "checkbox for Dossier" has focus

     When I pressed key Arrow Up
     Then I verified that element "checkbox for Dataset" has focus

     When I pressed key Arrow Left
     Then I verified that element "Select All button in All Panel" has focus

     When I pressed key Arrow Right
     Then I verified that element "checkbox for Dataset" has focus

     When I pressed key Tab
     Then I verified that element "checkbox for Certified" has focus

     When I pressed key Tab
     Then I verified that element "first checkbox in Owners" has focus

     When I pressed key Tab
     Then I verified that element "Owners All button" has focus

     When I pressed key Arrow Left
     Then I verified that element "View Selected switch" has focus

      And I logged out
