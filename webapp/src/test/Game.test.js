import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Game } from '../components/Game'; // Importamos el componente correcto

describe('Question Component', () => {

  test('fetches and displays a question with options', async () => {
    const { getByText, getAllByRole } = render(<Game goTo={() => {}} />); // Renderizamos el componente correcto y simulamos la función goTo

    // Esperamos a que se muestre la pregunta
    await waitFor(() => {
      expect(getByText('Question: 1')).toBeInTheDocument();
    });

    // Esperamos a que se muestren las opciones
    await waitFor(() => {
      expect(getAllByRole('listitem')).toHaveLength(4); // Asumimos que hay 4 opciones (la pregunta más 3 opciones incorrectas)
    });
  });

  test('selects an option and displays feedback', async () => {
    const { getByText, getAllByRole } = render(<Game goTo={() => {}} />); // Renderizamos el componente correcto y simulamos la función goTo

    // Esperamos a que se muestre la pregunta
    await waitFor(() => {
      expect(getByText('Question: 1')).toBeInTheDocument();
    });

    // Seleccionamos una opción (simulamos hacer clic)
    const options = getAllByRole('listitem');
    fireEvent.click(options[0]); // Suponemos que la primera opción es la correcta

    // Esperamos a que se muestre el botón Next
    await waitFor(() => {
      expect(getByText('Next')).toBeInTheDocument();
    });

  });

  // Agrega más tests según sea necesario para cubrir otros comportamientos del componente
});

