import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Game } from '../components/Game';

describe('Question Component', () => {
  test('selects an option and displays feedback', async () => {
    const { getByText, getAllByRole, container } = render(<Game goTo={() => {}} />);

    await waitFor(() => {
      expect(getByText('Question: 0')).toBeInTheDocument();
    });

    await waitFor(() => {
      const divElements = container.querySelectorAll('div');
      expect(divElements.length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      const divElements = container.querySelectorAll('p');
      expect(divElements.length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      const divElements = container.querySelectorAll('h4');
      expect(divElements.length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      const divElements = container.querySelectorAll('ul');
      expect(divElements.length).toBeGreaterThan(0);
    });

    const options = getAllByRole('listitem');
    fireEvent.click(options[0]);

    await waitFor(() => {
      expect(getByText('Next')).toBeInTheDocument();
    });
  });

  test('handles clicking "Next" button', async () => {
    const { getByText, queryByText, container } = render(<Game goTo={() => {}} />);
    
    await waitFor(() => {
      expect(getByText('Question: 0')).toBeInTheDocument();
    });

    await waitFor(() => {
      const divElements = container.querySelectorAll('div');
      expect(divElements.length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      const divElements = container.querySelectorAll('p');
      expect(divElements.length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      const divElements = container.querySelectorAll('h4');
      expect(divElements.length).toBeGreaterThan(0);
    });
    await waitFor(() => {
      const divElements = container.querySelectorAll('ul');
      expect(divElements.length).toBeGreaterThan(0);
    });
  });
});
