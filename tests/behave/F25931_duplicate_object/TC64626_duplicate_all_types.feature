Feature: F25931 - Duplicate object

  Scenario: [TC64626] - Duplicate all types of objects
    Given I logged in as default user
    And I clicked Import Data button
    And MyLibrary Switch is OFF

    And I found and selected object 'Secure data - always working'
    And I clicked Import button

    And I added a new worksheet
    And I clicked Add Data button
    And I found and selected object '1k Sales Records.csv'
    And I clicked Import button

    And I added a new worksheet
    And I clicked Add Data button
    And I found and selected object 'Complex dossier (20 visualizations)'
    And I clicked Import button to open Import Dossier
    And I imported visualization having index 15

    And number of worksheets should be 3

    When I selected worksheet number 1
    And I selected cell 'G1'
    And I clicked Duplicate on object 3
    And I selected Active Cell option in Duplicate popup
    And I clicked Import button in Duplicate popup

    Then object number 1 should be called 'Secure data - always working Copy'

    When I selected worksheet number 2
    And I selected cell 'R1'
    And I clicked Duplicate on object 3
    And I selected Active Cell option in Duplicate popup
    And I clicked Import button in Duplicate popup

    Then object number 1 should be called '1k Sales Records.csv Copy'

    When I selected worksheet number 3
    And I selected cell 'A10'
    And I clicked Duplicate on object 3
    And I selected Active Cell option in Duplicate popup
    And I clicked Import button in Duplicate popup

    Then object number 1 should be called 'Bubble Chart Copy'

    And number of worksheets should be 3

    And I log out
