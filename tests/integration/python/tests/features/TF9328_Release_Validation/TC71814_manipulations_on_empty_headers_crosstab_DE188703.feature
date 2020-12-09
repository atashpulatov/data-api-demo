@windows_chrome
@mac_chrome
@release_validation
Feature: TF9328 - Release Validation

  Scenario: [TC71814] - DE188703 - Table moved down after report refresh through Excel add-in - 11.3 GA
    Given I logged in as default user

     When I clicked Import Data button
      And I ensured that MyLibrary Switch is OFF
      And I found object by ID "A6E8885611E99CC31A6E0080EFF50C15" and selected "Report with crosstab 123"
      And I clicked Import button
      And I closed last notification
     Then cells ["B3", "E5", "V6"] should have values ["", "$ 7,382", "$1,405"]
      And object number 1 should be called "Report with crosstab 123"

     When I wrote text "123" in cell "C3"
     Then cell "C3" should have value "123"

     When I merged range from "L3" to "X3"
      And I wrote text "=B3" in cell "B49"
     Then cells ["B3", "B49"] should have values ["", "0"]

     When I wrote text "100" in cell "H3"
      And I wrote text "=SUM(H3:H39)" in cell "B43"
     Then cell "H3" should have value "100"
      And cell "B43" should have value "400970.8"

     When I clicked Refresh on object 1
      And I waited for object to be refreshed successfully
      And I closed last notification
     Then cells ["C3", "E5", "H3", "V6", "B43", "B49"] should have values ["", "$ 7,382", "", "$1,405", "400870.8", "#REF!"]

     When I wrote text "123" in cell "C3"
     Then cell "C3" should have value "123"

     When I merged range from "L3" to "X3"
      And I wrote text "=B3" in cell "B49"
     Then cells ["B3", "B49"] should have values ["", "0"]

     When I wrote text "100" in cell "H3"
      And I wrote text "=SUM(H3:H39)" in cell "B43"
     Then cell "H3" should have value "100"
      And cell "B43" should have value "400970.8"

     When I clicked Edit object 1
      And I verified that Columns & Filters Selection is visible
      And I clicked Import button in Columns and Filters Selection
      And I waited for object to be imported successfully
      And I closed last notification
     Then cells ["B3", "E5", "H3", "V6", "B43", "B49"] should have values ["", "$ 7,382", "", "$1,405", "400870.8", "#REF!"]

     When I wrote text "123" in cell "C3"
     Then cell "C3" should have value "123"

     When I merged range from "L3" to "X3"
      And I wrote text "=B3" in cell "B49"
     Then cells ["B3", "B49"] should have values ["", "0"]

     When I wrote text "100" in cell "H3"
      And I wrote text "=SUM(H3:H39)" in cell "B43"
     Then cell "H3" should have value "100"
      And cell "B43" should have value "400970.8"

     When I clicked clear data
     Then cells ["C3", "E5", "H3", "V6", "B43", "B49"] should have values ["Column2", "", "Column7", "", "0", "#REF!"]

     When I clicked view data
      And I closed all notifications
     Then cells ["C3", "E5", "H3", "V6", "B43", "B49"] should have values ["", "$ 7,382", "", "$1,405", "400870.8", "#REF!"]

     When I wrote text "123" in cell "C3"
     Then cell "C3" should have value "123"

     When I merged range from "L3" to "X3"
      And I wrote text "=B3" in cell "B49"
     Then cells ["B3", "B49"] should have values ["", "0"]

     When I wrote text "100" in cell "H3"
      And I wrote text "=SUM(H3:H39)" in cell "B43"
     Then cell "H3" should have value "100"
      And cell "B43" should have value "400970.8"

     When I removed object 1 using icon
      And I closed last notification
     Then cells ["C3", "E5", "H3", "V6", "B43", "B49"] should have values ["", "", "", "", "0", "#REF!"]

     When I added a new worksheet
      And I clicked Import Data button
      And I found object by ID "A6E8885611E99CC31A6E0080EFF50C15" and selected "Report with crosstab 123"
      And I clicked Import button
      And I closed last notification
     Then cells ["B3", "E5", "V6"] should have values ["", "$ 7,382", "$1,405"]
      And object number 1 should be called "Report with crosstab 123"

     When I selected cell "A49"
      And I clicked Add Data button
      And I found object by ID "F3DA2FE611E75A9600000080EFC5B53B" and selected "Seasonal Report"
      And I clicked Import button
      And I closed last notification
      And I removed object 2 using icon
      And I closed notification on object 2
     Then cells ["B3", "E5", "H3", "V6"] should have values ["", "", "", ""]

      And I logged out
