@mac_chrome
Feature: F25949 - Imported object details

  Scenario: [TC67533] - Update values on edit and refresh
    Given I logged in as default user
      And I clicked Import Data button
      And MyLibrary Switch is OFF

      And I found and selected object "100_report"
      And I clicked Import button
      And I closed last notification
      And I clicked toggle details button on object 1

     Then Object 1 has id "B7743F5A11E97AED00000080EF257000"

    Given I decertify object "B7743F5A11E97AED00000080EF257000" in Tutorial project
      And I clicked Refresh on object 1
      And I closed last notification
      And I clicked toggle details button on object 1
      And Object 1 is NOT certified

     When I certify object "B7743F5A11E97AED00000080EF257000" in Tutorial project
      And I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
      And I clicked toggle details button on object 1

     Then Object 1 is certified

     When I decertify object "B7743F5A11E97AED00000080EF257000" in Tutorial project
      And I clicked Refresh on object 1
      And I closed last notification
      And I clicked toggle details button on object 1
     Then Object 1 is NOT certified

     When I selected cell "P1"
      And I clicked Add Data button
      And I found and selected object "Subtotals"
      And I clicked Import button
      And I closed last notification
      And I clicked toggle details button on object 1

     Then totals and subtotals for object 1 are turned ON

     When I clicked Edit object 1
      And I clicked Include Subtotals and Totals switch
      And I clicked Import button
      And I closed last notification
      And I clicked toggle details button on object 1

     Then totals and subtotals for object 1 are turned OFF

    Given attributes list for object 1 contains attribute "Region"
      And metrics list for object 1 contains metric "Revenue"

     When I clicked Edit object 1
      And I clicked attribute "Region"
      And I clicked metric "Revenue"
      And I clicked Import button
      And I closed last notification
      And I clicked toggle details button on object 1

     Then attributes list for object 1 does NOT contain attribute "Region"
      And metrics list for object 1 does NOT contain metric "Revenue"

      And I log out
