export interface Question {
    id: number
    question: string
    code: string
    answers: string[]
    correctAnswer: string
    userSelectedAnswer?: string
    isCorrectUserAnswer?: boolean
}