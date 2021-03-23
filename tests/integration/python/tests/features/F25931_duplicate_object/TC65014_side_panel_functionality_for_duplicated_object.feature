@windows_chrome
@mac_chrome
Feature: F25931 - Duplicate object

  Scenario: [TC65014] - Side panel functionality for duplicated object
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

      And I found object by ID "B7743F5A11E97AED00000080EF257000" and selected "100_report"
      And I clicked Import button
      And I closed all notifications

     When I clicked Duplicate on object 1
      And I clicked Import button in Duplicate popup
      And I closed last notification

     Then I verified that object number 1 is called "100_report Copy"

     When I clicked on object 1

  # TODO Add scrolling or zooming of Excel sheet to check whole range of selection
     Then I verified that columns ["A", "B"] are selected
      And I verified that rows ["1", "2"] are selected

     When I changed object 1 name to "Incredible very long name of imported object Incredible very long name of imported object" using icon
     Then I verified that name tooltip for object number 1 displays "Incredible very long name of imported object Incredible very long name of imported object"

     When I clicked Refresh on object 1
      And I closed last notification

      And I removed object 1 using icon
      And I closed last notification

      And I logged out
