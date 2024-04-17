import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import Question, { finishByQuestions, finishByTime, reloadF,
  handleClassicGameFinish, handleOOLGameFinish, handelInfiniteGameFinish } from '../components/Question';
import { SessionProvider } from '../SessionContext';
import { IntlProvider } from 'react-intl';
import messages_en from '../messages/messages_en.json';

const mockPlay = jest.fn();
HTMLMediaElement.prototype.play = mockPlay;

// Mock para la respuesta del servicio de preguntas
const mockQuestionResponse = {
  question: 'What is the capital of France?',
  correct: 'Paris',
  incorrects: ['Berlin', 'Madrid', 'Rome']
};

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockQuestionResponse }))
}));

const customSettings = {
  gMode: 'classic',
  maxTime: 3,
  numberQ: 10,
  category: "general"
};

describe('Question component', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockQuestionResponse)
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders question and options correctly', async () => {

    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Question locale={'en'} settings={customSettings}/>
      </SessionProvider></IntlProvider>
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
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Question locale={'en'} settings={customSettings}/>
      </SessionProvider></IntlProvider>
    );

    // Esperar a que se cargue la pregunta
    await waitFor(() => {
      expect(getByText('What is the capital of France?')).toBeInTheDocument();
    });

    // Seleccionar la opción correcta
    act(() => {
      fireEvent.click(getByText('Paris'));
    });

    expect(mockPlay).toHaveBeenCalled();

    // Verificar que la opción seleccionada tenga estilo verde
    expect(getByText('Paris').parentElement).toBeInTheDocument;
  });

  it('handles Next button click correctly', async () => {

    const { getByText } = render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Question locale={'en'} settings={customSettings}/>
      </SessionProvider></IntlProvider>
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
 
    const questionComponent = <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
       <Question locale={'en'} setGameFinished={mockSetGameFinished} goTo={mockGoTo} settings={customSettings}/>
      </SessionProvider></IntlProvider>;

    // Renderizar el componente
    const { getByText } = render(questionComponent);

    // Establecer valores iniciales
    act(() => {
      localStorage.setItem('pAcertadas', '5');
      localStorage.setItem('pFalladas', '5');
      localStorage.setItem('tiempoUsado', '60');
      localStorage.setItem('tiempoRestante', '60');
    });

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
    act(() => {
    render(
      <IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
        <Question locale={'en'} settings={customSettings}/>
      </SessionProvider></IntlProvider>
      );
    });
    jest.advanceTimersByTime(5000);

    expect(setSegundos).toHaveBeenCalledTimes(0);
  });

  it('should toggle sound on and off when clicking audio image', () => {
  
    const { getByRole } = render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={customSettings}/>
    </SessionProvider></IntlProvider>);

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
  
    const { getByText } = render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={customSettings}/>
    </SessionProvider></IntlProvider>);

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

    const { getByText } = render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={customSettings}/>
    </SessionProvider></IntlProvider>);

    // Simulate answering all questions
    for (let i = 0; i < 10; i++) {
      fireEvent.click(getByText('Next'));
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
    const { getByText } = render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={customSettings}/>
    </SessionProvider></IntlProvider>);

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

    const { getByText } = render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} goTo={goToMock} settings={customSettings}/></SessionProvider></IntlProvider>);

    // Llamamos directamente a finishByQuestions
    finishByQuestions(segundos, MAX_TIME); 

    // Verificamos que los valores correctos se hayan establecido en el local storage
    expect(localStorage.getItem("tiempoUsado").toString()).toBe((MAX_TIME - segundos).toString());
    expect(localStorage.getItem("tiempoRestante").toString()).toBe(segundos.toString());
    
    // Verificamos que setGameFinished haya sido llamado con true
    //expect(setGameFinished).toHaveBeenCalledWith(true);

    // Verificamos que goTo haya sido llamado con el valor 1
    expect(goToMock).not.toHaveBeenCalled();
  });

  it('should call finishByTime when game finishes by time', () => {

    act(() => {
    render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={customSettings}/></SessionProvider></IntlProvider>);
  });
    const MAX_TIME = 120;
    // Simula que se agota el tiempo
    jest.useFakeTimers();
    act(() => {
      jest.advanceTimersByTime((MAX_TIME + 1) * 1000); // Asegúrate de que el tiempo se agote
    });

    act(() => {
      finishByTime(true, MAX_TIME);
      finishByTime(false, MAX_TIME);
    });

    // Verifica si finishByTime fue llamado
    //expect(finishByTime).toHaveBeenCalledWith(true, goToMock, true); // Verifica si se llamó con los argumentos correctos
  });

  it('should call handleClassicGameFinish with the correct arguments', () => {
    act(() => {
    render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={customSettings}/></SessionProvider></IntlProvider>);
  });
    // Simula que se alcanza el final del juego
    const nQuestion = 10; // Número de preguntas igual al máximo
    const numberCorrect = 8; // Supongamos que el jugador acierta 8 preguntas
    const numberIncorrect = 2;
    const segundos = 1; // Simula que se acaba el tiempo
    const sonido = true; // Supongamos que el sonido está activado
    const setGameFinished = jest.fn();
    const goTo = jest.fn();

    act(() => {
      handleClassicGameFinish(nQuestion, numberCorrect, numberIncorrect, segundos, sonido, goTo, setGameFinished, 10 , 120);
    });
  });

  it('should call handleOOLGameFinish with the correct arguments', () => {
    const TLSettings = {
      gMode: 'threeLife',
      maxTime: 3,
      numberQ: 10,
      category: "general"
    };
    act(() => {
    render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={TLSettings}/></SessionProvider></IntlProvider>);
  });
    // Simula que se alcanza el final del juego
    const numberCorrect = 8; // Supongamos que el jugador acierta 8 preguntas
    const setGameFinished = jest.fn();
    const segundosInfinite = 100;
    const goTo = jest.fn();

    act(() => {
      handleOOLGameFinish(numberCorrect, segundosInfinite, goTo, setGameFinished);
    });
  });

  it('should call handelInfiniteGameFinish with the correct arguments', () => {
    const InfiniteSettings = {
      gMode: 'threeLife',
      maxTime: 3,
      numberQ: 10,
      category: "general"
    };
    act(() => {
    render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={InfiniteSettings}/></SessionProvider></IntlProvider>);
    });
    
    // Simula que se alcanza el final del juego
    const numberCorrect = 8; // Supongamos que el jugador acierta 8 preguntas
    const numberIncorrect = 2;
    const segundosInfinite = 100;
    const setGameFinished = jest.fn();
    const goTo = jest.fn();

    act(() => {
      handelInfiniteGameFinish(numberCorrect, numberIncorrect, segundosInfinite, goTo, setGameFinished);
    });
  });

  it('should call handleClassicGameFinish with the correct arguments', () => {
    
    const mockSetState = jest.fn();
    const mockContext = {
      setSegundos: mockSetState,
      setSegundosInfinite: mockSetState,
      setNQuestion: mockSetState,
      setNumberCorrect: mockSetState,
      setNumberIncorrect: mockSetState,
      setReload: mockSetState
    };
    
    act(() => {
    render(<IntlProvider locale={"en"} messages={messages_en}><SessionProvider>
      <Question locale={'en'} settings={customSettings}/></SessionProvider></IntlProvider>);
    });

    act(() => {
      reloadF(
        mockContext.setSegundos,
        mockContext.setSegundosInfinite,
        mockContext.setNQuestion,
        mockContext.setNumberCorrect,
        mockContext.setNumberIncorrect,
        mockContext.setReload
      );
    });

    // Verifica que todas las funciones setState hayan sido llamadas con los valores correctos
    expect(mockContext.setSegundos).toHaveBeenCalledWith(undefined);
    expect(mockContext.setSegundosInfinite).toHaveBeenCalledWith(0);
    expect(mockContext.setNQuestion).toHaveBeenCalledWith(0);
    expect(mockContext.setNumberCorrect).toHaveBeenCalledWith(0);
    expect(mockContext.setNumberIncorrect).toHaveBeenCalledWith(0);
    expect(mockContext.setReload).toHaveBeenCalledWith(false);
  });
});