import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Game } from '../components/Game';

describe('Question Component', () => {
  test('renders question and options', async () => {
    const { getByText, getAllByRole } = render(<Game goTo={() => {}} />);
    
    await waitFor(() => {
      
    });

    await waitFor(() => {
      expect(getAllByRole('listitem')).toHaveLength(4);
    });
  });

  test('selects an option and displays feedback', async () => {
    const { getByText, getAllByRole } = render(<Game goTo={() => {}} />);

    await waitFor(() => {
      
    });

    

    await waitFor(() => {
      
    });

  });

  test('handles clicking "Next" button', async () => {
    const { getByText, queryByText } = render(<Game goTo={() => {}} />);
    
    await waitFor(() => {
      
    });

  });
});
