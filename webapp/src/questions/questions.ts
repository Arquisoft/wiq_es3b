import { create } from 'zustand'
import { type Question } from './questionType'
import { persist, devtools } from 'zustand/middleware'

interface State {
  questions: Question[]
  currentQuestion: number
  fetchQuestions: (limit: number) => Promise<void>
  selectAnswer: (questionId: number, answer: string) => void
  goNextQuestion: () => void
}

export const useQuestionsStore = create<State>()(devtools(persist((set, get) => {
    return {
      loading: false,
      questions: [],
      currentQuestion: 0,
  
      fetchQuestions: async (limit: number) => {
        const res = await fetch(`http://localhost:8000/api/questions/create`)
        const json = await res.json()
  
        const questions = json.sort(() => Math.random() - 0.5).slice(0, limit)
        set({ questions }, false, 'FETCH_QUESTIONS')
      },

      selectAnswer: (questionId: number, answer: string) => {

        const { questions } = get()
        const newQuestions = structuredClone(questions)
        const questionIndex = newQuestions.findIndex(q => q.id === questionId)
        const questionInfo = newQuestions[questionIndex]
        const isCorrectUserAnswer = questionInfo.correctAnswer === answer
  
        newQuestions[questionIndex] = {
          ...questionInfo,
          isCorrectUserAnswer,
          userSelectedAnswer: answer
        }
        
        set({ questions: newQuestions }, false, 'SELECT_ANSWER')
      },

      goNextQuestion: () => {
        const { currentQuestion, questions } = get()
        const nextQuestion = currentQuestion + 1
  
        if (nextQuestion < questions.length) {
          set({ currentQuestion: nextQuestion }, false, 'GO_NEXT_QUESTION')
        }
      }
    }
},
{
  name: 'questions'
}
)))