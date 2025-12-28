import { useCallback, useState } from 'react'

const PARTICIPATION_STORAGE_KEY = 'marriage-quiz-participated'

const readParticipation = () => {
  if (typeof window === 'undefined') {
    return false
  }
  return window.localStorage.getItem(PARTICIPATION_STORAGE_KEY) === 'true'
}

export const useParticipationStatus = () => {
  const [hasParticipated, setHasParticipated] = useState<boolean>(() => readParticipation())

  const markParticipated = useCallback(() => {
    setHasParticipated(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PARTICIPATION_STORAGE_KEY, 'true')
    }
  }, [])

  return { hasParticipated, markParticipated }
}
