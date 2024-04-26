Feature: Add friend

Scenario: The user is going to add a friend
  Given An unregistered user
  When I fill the data in the form, press submit, press Friends and adds a friend
  Then The friend will be added
Scenario: The user is going to remove a friend
    Given A registered user with one friend
    When I am in Friends page and select the friend to remove
    Then The friend will be removed from the user's friend list