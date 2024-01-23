Feature: F25946 - Details panel

  Scenario: [TC59756] - [Object Details] Expanded view for Table of Objects
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF

     When I clicked Filters button
      And I clicked Application "MicroStrategy Tutorial"
      And I clicked Type "Dataset"
      And I clicked Filters button
     Then I found object "single_attribute"

     When I displayed details for object number 3
     Then I verified that the details of the first expanded object displayed "type" as "Dataset"
      And I verified that the details of the first expanded object displayed "id" as "EB7B0A4711EA8A5EC5020080EF658AEC"
      And I verified that the details of the first expanded object displayed "created" as "4/29/2020 9:18 PM"
      And I verified that the details of the first expanded object displayed "location" as "MicroStrategy Tutorial > Public Objects > Reports > DS Objects"
      And I verified that the details of the first expanded object displayed "description" as "some description"
      And I verified that copying the details to clipboard works correctly

     When I displayed details for object number 2
     Then I verified that the details of the first expanded object displayed "type" as "Dataset"
      And I verified that the details of the first expanded object displayed "id" as "D5798B4D11EAB497A9EC0080EF9503F3"
      And I verified that the details of the first expanded object displayed "created" as "6/22/2020 2:51 PM"
      And I verified that the details of the first expanded object displayed "location" as "MicroStrategy Tutorial > Public Objects > Reports > DS Objects > Cubes for Create Testing"
      And I verified that the details of the first expanded object displayed "description" as "some description"

     When I displayed details for object number 1
     Then I verified that the details of the first expanded object displayed "type" as "Dataset"
      And I verified that the details of the first expanded object displayed "id" as "CED9B2FF11EA8AF275CF0080EF6555DF"
      And I verified that the details of the first expanded object displayed "created" as "4/30/2020 2:56 PM"
      And I verified that the details of the first expanded object displayed "location" as "MicroStrategy Tutorial > Profiles > MSTR User (mstr) > My Reports"



     When I selected object "single_attribute"
      And I clicked Import button
      And I waited for object operation to complete successfully with message "Import successful"
     Then I closed last notification
      And I verified that cells ["A1", "A2", "B2"] have values ["Id", "1", "1"]

      And I logged out
