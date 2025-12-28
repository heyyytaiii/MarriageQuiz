export type ChoiceOption = {
  label: string
  value: string
}

export type Question = {
  id: number
  category: string
  type: 'choice' | 'essay'
  question: string
  options?: ChoiceOption[]
}
