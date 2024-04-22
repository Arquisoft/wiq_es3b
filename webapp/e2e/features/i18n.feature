Feature: i18n test

Scenario: The user is going to try different languages
  Given An unregistered user
  When I fill the data in the form, press submit and press langugae button
  Then A Classic Game message should be shown in different languages