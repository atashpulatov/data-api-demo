@mac_chrome
Feature: F32725 - Data source browsing and management improvements

  Scenario: [TC55013] - [Object filtering] Filter panel Accessibility
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF
      And I clicked Filters button

     When I pressed key Tab
     Then element "first checkbox in Applications category" has focus

     When I pressed key Tab
     Then element "Applications All button" has focus

     When I pressed key Arrow Left
     Then element "View Selected switch" has focus

     When I pressed key Tab
     Then element "Search" has focus

     When I pressed key Tab
     Then element "first checkbox in All Panel" has focus

     When I pressed key Arrow Right
     Then element "Applications All button" has focus

      And I log out
