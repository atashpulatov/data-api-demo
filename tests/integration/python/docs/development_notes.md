# Developer's notes

### Code formatting

1. Python code should be formatted according to
[PEP 8 - Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/) with maximum line length
of 120 characters.

1. Gherking code should be formatted as follows (please notice steps indentation):

```gherkin
Feature: FMMMM - Import object

  Scenario: [TCNNNNN] - Simple import object
    Given I logged in as default user
      And I clicked Import Data button
      And I found and selected object "report to be imported"
      
     When I clicked Import button
     
     Then number of worksheets should be 1
      And cell "A42" should have value "42"
```
