import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { SessionContext } from '../SessionContext';
import { IntlProvider } from 'react-intl';
import Friends from '../components/Friends';
import MockAdapter from 'axios-mock-adapter';
import messages_en from '../messages/messages_en.json';

const mockAxios = new MockAdapter(axios);
const mockChangeLanguage = jest.fn();

describe('Friends', () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    test('renders the friend list', async () => {
        mockAxios.onGet('http://localhost:8000/friends/testUser').reply(200, 
        { friends: ['friend1', 'friend2', 'friend3', 'friend4'] }
    );
        render(
            <IntlProvider locale={"en"} messages={messages_en}>
                <SessionContext.Provider value={{ sessionData: { username: 'testUser', token: 'testToken' } }}>
                    <Friends goTo={(parameter) => {}} />
                </SessionContext.Provider>
            </IntlProvider>
        );



        // Wait for the friends to be fetched
        await screen.findByText('friend1');
        await screen.findByText('friend2');
        await screen.findByText('friend3');
        await screen.findByText('friend4');

        expect(screen.getByText('friend1')).toBeInTheDocument();
        expect(screen.getByText('friend2')).toBeInTheDocument();
        expect(screen.getByText('friend3')).toBeInTheDocument();
        expect(screen.getByText('friend4')).toBeInTheDocument();
    });

    test('adds a friend', async () => {
        render(
            <IntlProvider locale={"en"} messages={messages_en}>
                <SessionContext.Provider value={{ sessionData: { username: 'testUser', token: 'testToken' } }}>
                    <Friends goTo={(parameter) => {}} />
                </SessionContext.Provider>
            </IntlProvider>
        );
        mockAxios.onPost('http://localhost:8000/friends').reply(200, 
            { friends: ['friend1', 'friend2', 'friend3', 'friend4', 'newFriend'] }
        );

        const addButton = screen.getByText('Add friend');
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'newFriend' } });
        fireEvent.click(addButton);

        // Wait for the friends to be fetched
        await screen.findByText('friend1');
        await screen.findByText('friend2');
        await screen.findByText('friend3');
        await screen.findByText('friend4');
        await screen.findByText('newFriend');
    });

    test('deletes a friend', async () => {
        render(
            <IntlProvider locale={"en"} messages={messages_en}>
                <SessionContext.Provider value={{ sessionData: { username: 'testUser', token: 'testToken' } }}>
                    <Friends goTo={(parameter) => {}} />
                </SessionContext.Provider>
            </IntlProvider>
        );
        mockAxios.onPost('http://localhost:8000/friends').reply(200, 
            { friends: ['friend1'] }
        );
        const addButton = screen.getByText('Add friend');
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'friend1' } });
        fireEvent.click(addButton);

        // Wait for the friends to be fetched
        await screen.findByText('friend1');
        await mockAxios.reset();
        mockAxios.onDelete('http://localhost:8000/friends/friend1').reply(200, 
            { friends: [] }
        );
        

        const deleteButton = screen.getByText('Delete friend');

        fireEvent.click(deleteButton);
        await screen.findByText('Friend deleted successfully');
        // Wait for more than 6 seconds
        await new Promise((resolve) => setTimeout(resolve, 7000));

        expect(screen.queryByText('Friend deleted successfully')).toBeNull();
        
    },20000);
});
