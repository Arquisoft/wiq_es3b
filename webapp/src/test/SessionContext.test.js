import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SessionProvider, SessionContext } from '../SessionContext';

describe('SessionProvider Component', () => {
  test('sets initial session data from localStorage if available', () => {
    const storedData = { username: 'testUser' };
    localStorage.setItem('sessionData', JSON.stringify(storedData));

    const TestComponent = () => {
      const { sessionData } = React.useContext(SessionContext);
      return <div>{sessionData.username}</div>;
    };

    const { getByText } = render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    expect(getByText('testUser')).toBeInTheDocument();
  });

  test('saves session data to localStorage when updated', () => {
    const TestComponent = () => {
      const { saveSessionData } = React.useContext(SessionContext);
      const handleClick = () => {
        saveSessionData({ username: 'newUser' });
      };
      return <button onClick={handleClick}>Save Data</button>;
    };

    const { getByText } = render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    fireEvent.click(getByText('Save Data'));

    const storedData = localStorage.getItem('sessionData');
    expect(JSON.parse(storedData).username).toEqual('newUser');
  });

  test('clears session data from localStorage when cleared', () => {
    const TestComponent = () => {
      const { clearSessionData } = React.useContext(SessionContext);
      const handleClick = () => {
        clearSessionData();
      };
      return <button onClick={handleClick}>Clear Data</button>;
    };

    localStorage.setItem('sessionData', JSON.stringify({ username: 'testUser' }));

    const { getByText } = render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    fireEvent.click(getByText('Clear Data'));

    const storedData = localStorage.getItem('sessionData');
    expect(storedData).toBeNull();
  });
});
