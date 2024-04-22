Feature: Closing a session

Scenario: The user is going to close the session
  Given An unregistered user
  When I fill the data in the form, press submit and press Logout button
  Then A title message should be shown in the screen