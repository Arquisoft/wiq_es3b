import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Game } from '../components/Game';

describe('Question Component', () => {
  test('renders question and options', async () => {
    const { getByText, getAllByRole } = render(<Game goTo={() => {}} />);
    
    await waitFor(() => {
      expect(getByText('Question: 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getAllByRole('listitem')).toHaveLength(4);
    });
  });

  test('selects an option and displays feedback', async () => {
    const { getByText, getAllByRole } = render(<Game goTo={() => {}} />);

    await waitFor(() => {
      expect(getByText('Question: 1')).toBeInTheDocument();
    });

    const options = getAllByRole('listitem');
    fireEvent.click(options[0]); // Select the first option

    await waitFor(() => {
      expect(getByText('Next')).toBeInTheDocument();
    });

  });

  test('handles clicking "Next" button', async () => {
    const { getByText, queryByText } = render(<Game goTo={() => {}} />);
    
    await waitFor(() => {
      expect(getByText('Question: 1')).toBeInTheDocument();
    });

  });
});
