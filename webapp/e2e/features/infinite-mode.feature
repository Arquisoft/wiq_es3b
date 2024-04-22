Feature: Play Infinite Mode

Scenario: The user is going to play infinite mode
  Given An unregistered user
  When I fill the data in the form, press submit, press Infinte Mode button and end game
  Then A Game Over message should be shown in the screen