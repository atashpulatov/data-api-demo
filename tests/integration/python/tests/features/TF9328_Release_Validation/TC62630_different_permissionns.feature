#@ci_pipeline_postmerge_windows_chrome
Feature: TF9328 - Release Validation

  Scenario: [TC62630] - [Privileges] Log in with different users with different permissions (Office, Library, Web)
    Given I initialized Excel

     When I logged in with username "b" and password "b"
     Then I verified that I saw "No MicroStrategy for Office privileges" message and I clicked Try Again

     When I logged in with username "No library" and empty password
      And I clicked Import Data button

      And I found and selected object "Multinational Bank Dossier"
     Then I clicked Import button and saw global error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

     When I clicked Import Data button
      And I found and selected object "Report with a subtotal & prompt"
     Then I clicked Import button and saw global error "This object cannot be imported. Either you do not have necessary permissions to view it, or it is empty."

     When I clicked Import Data button
      And I found and selected object "01 Basic Report"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
     Then I verified that cells ["A2", "C3"] have values ["Central", "Loren"]
      And I logged out

     When I logged in as default user
      And I added a new worksheet
      And I clicked Add Data button

      And I found and selected object "Multinational Bank Dossier"
      And I clicked Import button to open Import Dossier
      And I waited for dossier to load successfully
      And I selected visualization "Actual Profit vs. Target Profit"
      And I selected import type "Import Data" and clicked import
      And I closed last notification
     Then I verified that cells ["A2", "D2"] have values ["Metrics", "Profit Actual"]
      And I verified that object number 1 is called "Actual Profit vs. Target Profit"

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Report with a subtotal & prompt"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button without checking results
      And I waited for Run button to be enabled
      And I selected "Books" as an answer for "1. Category" prompt - object prompt
      And I clicked Run button
      And I closed last notification
     Then I verified that cells ["B1", "D2"] have values ["Subcategory", "$1,419"]
      And I verified that object number 1 is called "Report with a subtotal & prompt"

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "01 Basic Report"
      And I verified that Import with dropdown button is enabled
      And I clicked Import dropdown button
      And I verified that "Import Data" item in Import dropdown is enabled
      And I selected "Import Data" item in Import dropdown
      And I clicked Import with dropdown button
     Then I verified that cells ["A2", "C3"] have values ["Central", "Loren"]

      And I logged out
