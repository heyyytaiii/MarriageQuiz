export type BaseQuestion = {
  id: string
  prompt: string
  description: string
  type: 'single' | 'text'
}

export type SingleChoiceQuestion = BaseQuestion & {
  type: 'single'
  options: string[]
}

export type TextQuestion = BaseQuestion & {
  type: 'text'
  guidance: string
  keywords?: string[]
}

export type Question = SingleChoiceQuestion | TextQuestion

export type QuestionSection = {
  id: string
  title: string
  description: string
  questions: Question[]
}
