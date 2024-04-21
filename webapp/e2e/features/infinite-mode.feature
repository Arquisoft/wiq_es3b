Feature: Playing infinite mode

Scenario: The user is going to play infinite mode
  Given An unregistered user
  When I fill the data in the form, press submit and press infinite mode button
  Then A Game Over message should be shown in the screen