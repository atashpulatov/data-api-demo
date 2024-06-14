#@ci_pipeline_postmerge_windows_chrome
Feature: F39228 - Introduce Excel add-in formatting settings for importing as text and merged columns

  Scenario: [TC92492] - Preserving data formatting for attributes by importing all types of data as Text 
    Given I initialized Excel
     When I logged in as default user

      And I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
     Then I verified "Import data as text" setting is OFF
      And I verified "Merge columns" setting is ON

     When I click back button in Settings
      And I clicked Import Data button
      And I found and selected object "Date format report"
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
      And I closed notification for object 1 in group 1

    # Verify the state of imported grid with importAsText OFF
     Then I verified that cells ["A4", "A3", "A2"] have values ["12/30/2023", "30-Dec", "12.30.2023"]
      And I verified that cells ["A4", "A3", "A2"] have formats ["Date", "Custom", "General"]

      And I verified that cell "B4" has value "Jan-21"
      And I verified that cell "B4" has format "Custom"

      And I verified that cells ["C5", "C6"] have values ["Mai 2022", "Apr-22"]
      And I verified that cells ["C5", "C6"] have formats ["General", "Custom"]

    # Change the settings to import all data as text
     When I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
      And I toggled the "Import data as text" setting to "ON"
     Then I verified "Import data as text" setting is ON

     When I click back button in Settings
      And I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Date format report"
      And I selected import type "Import Data" and clicked import
      And I waited for object to be imported successfully
      And I closed notification for object 1 in group 2

    # Verify the state of imported grid with importAsText ON
     Then I verified that cells ["A4", "A3", "A2"] have values ["12/30/2023", "12/30", "12.30.2023"]
      And I verified that cells ["A4", "A3", "A2"] have formats ["Text", "Text", "Text"]

      And I verified that cell "B4" has value "January 2021"
      And I verified that cell "B4" has format "Text"

      And I verified that cells ["C5", "C6"] have values ["Mai 2022", "April 2022"]
      And I verified that cells ["C5", "C6"] have formats ["Text", "Text"]

    # Change the settings to importAsText OFF
     When I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
      And I toggled the "Import data as text" setting to "OFF"
     Then I verified "Import data as text" setting is OFF
      And I click back button in Settings
      And I closed all notifications

    # Edit the imported grid
     When I clicked Edit in options for object 1 in group 2
      And I clicked attribute "Date (en)"
      And I clicked Import button in Columns and Filters Selection without success check
      And I closed notification for object 1 in group 2

    # Verify the state of imported grid with importAsText OFF
     Then I verified that cells ["A4", "A3", "A2"] have values ["12/30/2023", "30-Dec", "12.30.2023"]
      And I verified that cells ["A4", "A3", "A2"] have formats ["Date", "Custom", "General"]

      And I verified that cells ["B5", "B6"] have values ["Mai 2022", "Apr-22"]
      And I verified that cells ["B5", "B6"] have formats ["General", "Custom"]

    # Change the settings to importAsText ON
     When I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
      And I toggled the "Import data as text" setting to "ON"
     Then I verified "Import data as text" setting is ON

    # Refresh and check the state of imported grid with importAsText ON
     When I click back button in Settings
      And I clicked Refresh for object 1 in group 2
      And I closed all notifications

    # Verify the state of imported grid with importAsText ON doesn't change after refresh
     Then I verified that cells ["A4", "A3", "A2"] have values ["12/30/2023", "30-Dec", "12.30.2023"]
      And I verified that cells ["A4", "A3", "A2"] have formats ["Date", "Custom", "General"]

      And I verified that cells ["B5", "B6"] have values ["Mai 2022", "Apr-22"]
      And I verified that cells ["B5", "B6"] have formats ["General", "Custom"]

    # Import "Shoe Size and tracking number Report" with importAsText ON
     When I selected cell "E1"
      And I clicked Add Data button
      And I found and selected object "Shoe Size and tracking number Report"
      And I selected import type "Import Data" and clicked import
      And I closed notification for object 1 in group 2

    # Verify the state of imported grid with importAsText ON
     Then I verified that cells ["E2", "E3", "E4", "F2", "F4", "G4", "H2", "H3", "H4"] have formats ["Text", "Text", "Text", "Text", "Text", "Text", "General", "General", "General"]

     # Change the settings to importAsText OFF
     When I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
      And I toggled the "Import data as text" setting to "OFF"
     Then I verified "Import data as text" setting is OFF

      # Duplicate the imported grid
     When I click back button in Settings
      And I selected cell "J1"
      And I clicked Duplicate in options for object 1 in group 2
      And I selected Active Cell option in Duplicate popup
      And I clicked Import button in Duplicate popup without checking results
      And I closed notification for object 1 in group 2

     # Verify the state of duplicated grid with importAsText OFF
     Then I verified that cells ["J2", "J3", "J4", "K2", "K4", "L4", "M2", "M3", "M4"] have formats ["Text", "Text", "Text", "Text", "Text", "Text", "General", "General", "General"]

     # Import the "Shoe Size and tracking number Report" with importAsText OFF
     When I selected cell "P1"
      And I clicked Add Data button
      And I found and selected object "Shoe Size and tracking number Report"
      And I selected import type "Import Data" and clicked import
      And I closed notification for object 1 in group 2

      # Verify the state of imported grid with importAsText OFF
     Then I verified that cell "P2" has format "General"
      And I verified that cell "P2" has value "1"

      And I verified that cell "Q2" has format "Custom"
      And I verified that cell "Q2" has value "9-Jul"

      And I verified that cell "R2" has format "Number"
      And I verified that cell "R2" has value "1,234,567,890,123,450,000,000,000"

      And I verified that cell "S2" has format "General"
      And I verified that cell "S2" has value "50"

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Signs report"
      And I selected import type "Import Data" and clicked import
      And I verified that object 1 in group 3 has displayed message "An error has occurred in Excel. The argument is invalid or missing or has an incorrect format."
      And I closed all warning notifications

      # Change the settings to importAsText ON
     When I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
      And I toggled the "Import data as text" setting to "ON"
     Then I verified "Import data as text" setting is ON
      And I click back button in Settings

     When I added a new worksheet
      And I clicked Add Data button
      And I found and selected object "Signs report"
      And I selected import type "Import Data" and clicked import
      And I closed notification for object 1 in group 3

      # Verify the state of imported grid with importAsText ON
     Then I verified that cells ["A2", "A3", "A14", "B4", "B8", "C8"] have formats ["Text", "Text", "Text", "Text", "Text", "General"]
      And I verified that cell "B8" is empty

     When I entered text "1" into cell "B8" after selecting it
     Then I verified that cell "B8" has value "1"

     When I open Settings in Dots Menu
      And I clicked "Import" section on Settings menu
      And I toggled the "Import data as text" setting to "OFF"
     Then I verified "Import data as text" setting is OFF

      And I logged out
