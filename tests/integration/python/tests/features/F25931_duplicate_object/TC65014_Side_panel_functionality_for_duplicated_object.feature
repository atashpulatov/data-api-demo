@mac_chrome
@ci
Feature: F25931 - Duplicate object

  Scenario: [TC65014] - Side panel functionality for duplicated object
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "100_report"
      And I clicked Import button
      And I closed all notifications


     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed last notification

     Then object number 1 should be called "100_report Copy"

     When I clicked on object 1
      And I changed object 1 name to "Incredible very long name of imported object" using icon

     Then name tooltip for object number 1 should display "Incredible very long name of imported object"
     
     When I clicked Refresh on object 1
      And I closed last notification

      And I removed object 1 using icon
      And I closed last notification

      And I log out
