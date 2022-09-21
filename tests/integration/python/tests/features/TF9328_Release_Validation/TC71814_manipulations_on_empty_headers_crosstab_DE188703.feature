#@ci_pipeline_daily_windows_chrome @ci_pipeline_daily_mac_chrome
#@ci_pipeline_rv_windows_chrome
@ci_pipeline_rv_mac_chrome
@disabled_windows_chrome @mac_chrome
Feature: TF9328 - Release Validation

  Scenario: [TC71814] - DE188703 - Table moved down after report refresh through Excel add-in - 11.3 GA
    Given I initialized Excel

     When I logged in as default user
      And I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "A6E8885611E99CC31A6E0080EFF50C15" and selected "Report with crosstab 123"
      And I clicked Import button
      And I closed last notification
     Then I verified that cells ["B3", "E5", "V6"] have values ["", "$ 7,382", "$1,405"]
      And I verified that object number 1 is called "Report with crosstab 123"

     When I entered text "123" into cell "C3" after selecting it
     Then I verified that cell "C3" has value "123"

     When I merged range from "L3" to "X3"
      And I entered text "=B3" into cell "B49" after selecting it
     Then I verified that cells ["B3", "B49"] have values ["", "0"]

     When I entered text "100" into cell "H3" after selecting it
      And I entered text "=SUM(H3:H39)" into cell "B43" after selecting it
     Then I verified that cell "H3" has value "100"
      And I verified that cell "B43" has value "400970.8"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then I verified that cells ["C3", "E5", "H3", "V6", "B43", "B49"] have values ["", "$ 7,382", "", "$1,405", "400870.8", "#REF!"]

     When I entered text "123" into cell "C3" after selecting it
     Then I verified that cell "C3" has value "123"

     When I merged range from "L3" to "X3"
      And I entered text "=B3" into cell "B49" after selecting it
     Then I verified that cells ["B3", "B49"] have values ["", "0"]

     When I entered text "100" into cell "H3" after selecting it
      And I entered text "=SUM(H3:H39)" into cell "B43" after selecting it
     Then I verified that cell "H3" has value "100"
      And I verified that cell "B43" has value "400970.8"

     When I clicked Edit object 1
      And I verified that Columns & Filters Selection is visible
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then I verified that cells ["B3", "E5", "H3", "V6", "B43", "B49"] have values ["", "$ 7,382", "", "$1,405", "400870.8", "#REF!"]

     When I entered text "123" into cell "C3" after selecting it
     Then I verified that cell "C3" has value "123"

     When I merged range from "L3" to "X3"
      And I entered text "=B3" into cell "B49" after selecting it
     Then I verified that cells ["B3", "B49"] have values ["", "0"]

     When I entered text "100" into cell "H3" after selecting it
      And I entered text "=SUM(H3:H39)" into cell "B43" after selecting it
     Then I verified that cell "H3" has value "100"
      And I verified that cell "B43" has value "400970.8"

     When I clicked clear data
     Then I verified that cells ["C3", "E5", "H3", "V6", "B43", "B49"] have values ["Column2", "", "Column7", "", "0", "#REF!"]

     When I clicked view data
      And I closed all notifications
     Then I verified that cells ["C3", "E5", "H3", "V6", "B43", "B49"] have values ["", "$ 7,382", "", "$1,405", "400870.8", "#REF!"]

     When I entered text "123" into cell "C3" after selecting it
     Then I verified that cell "C3" has value "123"

     When I merged range from "L3" to "X3"
      And I entered text "=B3" into cell "B49" after selecting it
     Then I verified that cells ["B3", "B49"] have values ["", "0"]

     When I entered text "100" into cell "H3" after selecting it
      And I entered text "=SUM(H3:H39)" into cell "B43" after selecting it
     Then I verified that cell "H3" has value "100"
      And I verified that cell "B43" has value "400970.8"

     When I removed object 1 using icon
      And I closed last notification
     Then I verified that cells ["C3", "E5", "H3", "V6", "B43", "B49"] have values ["", "", "", "", "0", "#REF!"]

     When I added a new worksheet
      And I clicked Import Data button
      And I found object by ID "A6E8885611E99CC31A6E0080EFF50C15" and selected "Report with crosstab 123"
      And I clicked Import button
      And I closed last notification
     Then I verified that cells ["B3", "E5", "V6"] have values ["", "$ 7,382", "$1,405"]
      And I verified that object number 1 is called "Report with crosstab 123"

     When I selected cell "A49"
      And I clicked Add Data button
      And I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
      And I clicked Import button
      And I closed last notification
      And I removed object 2 using icon
      And I closed notification on object 2
     Then I verified that cells ["B3", "E5", "H3", "V6"] have values ["", "", "", ""]

      And I logged out
