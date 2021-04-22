@release_validation
@ga_validation
Feature: F32651 - Enable authors to create information-rich dossiers with Panel Stacks

  Scenario: [TC75006] - [ACC] Importing visualisation from simple Panel Stack
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "5587CB0B11EB8297835E0080AFEB08B5" and selected "Panel Stack demo"
      And I clicked Import button to open Import Dossier
      And I selected dossier page or chapter 1
      And I selected Panel "1" for Panel Stack "Name"
      And I selected Visualization "Name" from Panel "1"
      And I clicked import dossier
      And I waited for object to be imported successfully
      And I closed last notification
   # TODO:update when functionality will be implemented
     #  Then I verified that cells [] have values []
      And I logged out

