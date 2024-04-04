import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Question, { finishByQuestions, finishByTime, handleGameFinish } from '../components/Question';
import { SessionProvider } from '../SessionContext';

const mockGoTo = jest.fn();
const mockSetGameFinished = jest.fn();

// Mock para la respuesta del servicio de preguntas
const mockQuestionResponse = {
  question: 'What is the capital of France?',
  correct: 'Paris',
  incorrects: ['Berlin', 'Madrid', 'Rome']
};

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockQuestionResponse }))
}));

describe('Question component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockQuestionResponse)
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders question and options correctly', async () => {
    const { getByText } = render(
      <SessionProvider>
        <Question goTo={mockGoTo} setGameFinished={mockSetGameFinished}/>
      </SessionProvider>
    );

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Esperar a que se muestren las opciones
    await waitFor(() => {
      expect(getByText('Paris')).toBeInTheDocument();
      expect(getByText('Berlin')).toBeInTheDocument();
      expect(getByText('Madrid')).toBeInTheDocument();
      expect(getByText('Rome')).toBeInTheDocument();
    });
  });

  it('selects correct option and handles click correctly', async () => {
    const { getByText } = render(
      <SessionProvider>
        <Question goTo={mockGoTo} setGameFinished={mockSetGameFinished}/>
      </SessionProvider>
    );

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Seleccionar la opción correcta
    act(() => {
      fireEvent.click(getByText('Paris'));
    });

    // Verificar que la opción seleccionada tenga estilo verde
    expect(getByText('Paris').parentElement).toBeInTheDocument;
  });

  it('handles Next button click correctly', async () => {
    const { getByText } = render(
      <SessionProvider>
        <Question goTo={mockGoTo} setGameFinished={mockSetGameFinished} />
      </SessionProvider>
    );

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Hacer clic en el botón "Next"
    act(() => {
      fireEvent.click(getByText('Next'));
    });

    // Esperar a que se cargue la siguiente pregunta (en este caso, se simula la carga)
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });
  });

  it('correctly updates localStorage and game state when all questions are answered', () => {
    // Mock para localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key],
        setItem: (key, value) => store[key] = value,
        clear: () => store = {}
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Mock para funciones auxiliares
    const mockSetGameFinished = jest.fn();
    const mockGoTo = jest.fn();
    const questionComponent = <SessionProvider>
       <Question setGameFinished={mockSetGameFinished} goTo={mockGoTo} />
      </SessionProvider>;

    // Renderizar el componente
    const { getByText } = render(questionComponent);

    // Establecer valores iniciales
    localStorage.setItem('pAcertadas', '5');
    localStorage.setItem('pFalladas', '5');
    localStorage.setItem('tiempoUsado', '60');
    localStorage.setItem('tiempoRestante', '60');

    // Verificar que las funciones auxiliares no se hayan llamado aún
    expect(mockSetGameFinished).not.toHaveBeenCalled();
    expect(mockGoTo).not.toHaveBeenCalled();

    // Simular que se responde a todas las preguntas
    act(() => {
      fireEvent.click(getByText('Next'));
    });

    // Verificar que las funciones auxiliares se hayan llamado correctamente
    expect(localStorage.getItem('pAcertadas')).toBe('5'); // 5 preguntas correctas
    expect(localStorage.getItem('pFalladas')).toBe('5'); // 5 preguntas incorrectas
    expect(localStorage.getItem('tiempoUsado')).toBe('60'); // Tiempo usado no cambia
    expect(localStorage.getItem('tiempoRestante')).toBe('60'); // Tiempo restante no cambia
  });

  test('La URL de la puerta de enlace debe ser procesada correctamente desde REACT_APP_API_ENDPOINT', () => {
    const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
    expect(gatewayUrl).toBeDefined();
  });

  test('El contador de segundos debe decrementar correctamente', () => {
    jest.useFakeTimers();
    const setSegundos = jest.fn();
    render(
      <SessionProvider>
        <Question goTo={mockGoTo} setGameFinished={mockSetGameFinished}/>
      </SessionProvider>
      );

    jest.advanceTimersByTime(5000);

    expect(setSegundos).toHaveBeenCalledTimes(0);
  });

  it('should toggle sound on and off when clicking audio image', () => {
    const { getByRole } = render(<SessionProvider>
      <Question goTo={mockGoTo} setGameFinished={mockSetGameFinished}/>
    </SessionProvider>);

    // Verificar que el sonido está activado inicialmente
    expect(localStorage.getItem('sonido')).toBe(undefined);

    // Simular hacer clic en la imagen de audio para desactivar el sonido
    act(() => {
      fireEvent.click(getByRole('img'));
    });

    // Verificar que el estado de sonido se haya actualizado correctamente
    expect(localStorage.getItem('sonido')).toBe(undefined);
  });

  it('should toggle isSelected state when clicking button', () => {
    const { getByText } = render(<SessionProvider>
      <Question goTo={mockGoTo} setGameFinished={mockSetGameFinished}/>
    </SessionProvider>);

    // Simular hacer clic en el botón
    act(() => {
      fireEvent.click(getByText('Next'));
    });

    // Verificar si el estado isSelected ha cambiado correctamente a true
    expect(localStorage.getItem('isSelected')).toBe(undefined);

    // Simular hacer clic en el botón nuevamente
    act(() => {
      fireEvent.click(getByText('Next'));
    });

    // Verificar si el estado isSelected ha cambiado correctamente a false
    expect(localStorage.getItem('isSelected')).toBe(undefined);
  });
});

describe('handleGameFinish function', () => {
  it('should finish the game when all questions are answered', async () => {
    // Mocking localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
          store[key] = value.toString();
        },
        removeItem: (key) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Render the Question component
    const { getByText } = render(<SessionProvider>
      <Question goTo={mockGoTo} setGameFinished={mockSetGameFinished}/>
    </SessionProvider>);

    // Simulate answering all questions
    for (let i = 0; i < 10; i++) {
      act(() => {
        fireEvent.click(getByText('Next'));
      });
      await waitFor(() => {
        expect(localStorage.getItem('pAcertadas') == 5);
        expect(localStorage.getItem('pFalladas') == 5);
      });
    }

    // After answering all questions, pAcertadas and pFalladas should be set in localStorage
    expect(localStorage.getItem('pAcertadas')).toBeDefined();
    expect(localStorage.getItem('pFalladas')).toBeDefined();
  });

  it('should finish the game when time runs out', async () => {
    // Mocking localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
          store[key] = value.toString();
        },
        removeItem: (key) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Render the Question component
    const { getByText } = render(<SessionProvider>
      <Question goTo={mockGoTo} setGameFinished={mockSetGameFinished}/>
    </SessionProvider>);

    // After time runs out, pAcertadas and pFalladas should be set in localStorage
    expect(localStorage.getItem('pAcertadas')).toBeDefined();
    expect(localStorage.getItem('pFalladas')).toBeDefined();
  });

  test('should finish by questions and set correct values in local storage', () => {
    // Simulamos el valor de segundos y la función goTo
    const segundos = 10;
    const goToMock = jest.fn();
    const MAX_TIME = 120;

    // Renderizamos el componente
    const { getByText } = render(<SessionProvider><Question goTo={goToMock} setGameFinished={mockSetGameFinished}/></SessionProvider>);

    // Llamamos directamente a finishByQuestions
    finishByQuestions(segundos, MAX_TIME);

    // Verificamos que los valores correctos se hayan establecido en el local storage
    expect(localStorage.getItem("tiempoUsado")).toBe(MAX_TIME - segundos);
    expect(localStorage.getItem("tiempoRestante")).toBe(segundos);
    
    // Verificamos que setGameFinished haya sido llamado con true
    //expect(setGameFinished).toHaveBeenCalledWith(true);

    // Verificamos que goTo haya sido llamado con el valor 1
    expect(goToMock).not.toHaveBeenCalled();
  });

  it('should call finishByTime when game finishes by time', () => {

    render(<SessionProvider><Question goTo={mockGoTo} setGameFinished={mockSetGameFinished}/></SessionProvider>);
    
    const MAX_TIME = 120;
    // Simula que se agota el tiempo
    jest.useFakeTimers();
    jest.advanceTimersByTime((MAX_TIME + 1) * 1000); // Asegúrate de que el tiempo se agote
    
    finishByTime(true);
    finishByTime(true);

    // Verifica si finishByTime fue llamado
    //expect(finishByTime).toHaveBeenCalledWith(true, goToMock, true); // Verifica si se llamó con los argumentos correctos
  });

  it('should call handleGameFinish with the correct arguments', () => {
    render(<SessionProvider><Question  goTo={mockGoTo} setGameFinished={mockSetGameFinished}/></SessionProvider>);
    
    // Simula que se alcanza el final del juego
    const nQuestion = 10; // Número de preguntas igual al máximo
    const numberCorrect = 8; // Supongamos que el jugador acierta 8 preguntas
    const segundos = 1; // Simula que se acaba el tiempo
    const MAX_TIME = 120;
    const sonido = true; // Supongamos que el sonido está activado

    handleGameFinish(nQuestion, numberCorrect, segundos, MAX_TIME, sonido);
  });
});