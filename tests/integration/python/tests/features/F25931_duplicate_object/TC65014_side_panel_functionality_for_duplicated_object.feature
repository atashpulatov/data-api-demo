Feature: F25931 - Duplicate object

  Scenario: [TC65014] - Side panel functionality for duplicated object
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      

      And I found and selected object "100_report"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
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
