import { useCallback, useState } from 'react'

const PARTICIPATION_STORAGE_KEY = 'marriage-quiz-participated'

const readParticipation = () =>
  typeof window !== 'undefined' && window.localStorage.getItem(PARTICIPATION_STORAGE_KEY) === 'true'

export const useParticipationStatus = () => {
  const [hasParticipated, setHasParticipated] = useState<boolean>(() => readParticipation())

  const markParticipated = useCallback(() => {
    setHasParticipated(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PARTICIPATION_STORAGE_KEY, 'true')
    }
  }, [])

  const resetParticipation = useCallback(() => {
    setHasParticipated(false)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(PARTICIPATION_STORAGE_KEY)
    }
  }, [])

  return { hasParticipated, markParticipated, resetParticipation }
}
