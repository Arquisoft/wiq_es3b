Feature: Login

Scenario: Login
  Given A registered user
  When I fill the data in the form, press submit
  Then The user must be logged