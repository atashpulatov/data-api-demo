@mac_chrome
@release_validation
@ga_validation
Feature: TS41441 - Sanity checks

  Scenario: [TC62630] - [Privileges] Log in with different users with different permissions (Office, Library, Web)
    Given I pass

     When I logged in with username "b" and password "b"
     Then I verified that I saw "No MicroStrategy for Office privileges" message and I clicked Try Again

     When I logged in with username "No library" and empty password
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "32765C5C11E79D5927C10080EF753106" and selected "Multinational Bank Dossier"
     Then I clicked Import button and saw global error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

     When I clicked Import Data button
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
     Then I clicked Import button and saw global error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

     When I clicked Import Data button
      And I found object by ID "13CFD83A458A68655A13CBA8D7C62CD5" and selected "01 Basic Report"
      And I clicked Import button
     Then cells ["A2", "C3"] should have values ["Central", "Loren"]
      And I logged out

     When I logged in as default user
      And I added a new worksheet
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "32765C5C11E79D5927C10080EF753106" and selected "Multinational Bank Dossier"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Actual Profit vs. Target Profit"
      And I clicked import dossier
      And I closed last notification
     Then cells ["A2", "D2"] should have values ["Metrics", "Profit Actual"]
      And object number 1 should be called "Actual Profit vs. Target Profit"

     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "300DBAFA4A1D8EC546AC6AB8CDE7834E" and selected "Report with a subtotal & prompt"
      And I clicked Import button without checking results
      And I waited for Run button to be enabled
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I closed last notification
     Then cells ["B1", "D2"] should have values ["Subcategory", "$1,419"]
      And object number 1 should be called "Report with a subtotal & prompt"


     When I added a new worksheet
      And I clicked Add Data button
      And I found object by ID "13CFD83A458A68655A13CBA8D7C62CD5" and selected "01 Basic Report"
      And I clicked Import button
     Then cells ["A2", "C3"] should have values ["Central", "Loren"]
      And I logged out



