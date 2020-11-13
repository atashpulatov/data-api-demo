@mac_chrome
@release_validation
@ga_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC62630] - [Privileges] Log in with different users with different permissions (Office, Library, Web)
    Given I pass

     When I logged in with username "b" and password "b"
     Then I verified that I saw "No MicroStrategy for Office privileges" message and I clicked Try Again

     When I logged in with username "c" and empty password
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "32765C5C11E79D5927C10080EF753106" and selected "Multinational Bank Dossier"
      # TODO Then I clicked Import button and saw global error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

     When I clicked Import Data button
#      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
      # TODO Then I clicked Import button and saw global error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

     When I clicked Import Data button
      And I found object by ID "13CFD83A458A68655A13CBA8D7C62CD5" and selected "01 Basic Report"
      And I clicked Import button
     Then cells ["A2", "C3"] should have values ["", ""]
      And I logged out

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "32765C5C11E79D5927C10080EF753106" and selected "Multinational Bank Dossier"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
     When I clicked Import Data button
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"

     When I clicked Import Data button
      And I found object by ID "13CFD83A458A68655A13CBA8D7C62CD5" and selected "01 Basic Report"
      And I clicked Import button
     Then cells ["A2", "C3"] should have values ["", ""]
      And I logged out



