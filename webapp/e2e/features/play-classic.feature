Feature: Play Classic Mode

Scenario: The user is going to play classic mode
  Given An unregistered user
  When I fill the data in the form, press submit, press Classic Mode button and play game
  Then A Game Over message should be shown in the screen