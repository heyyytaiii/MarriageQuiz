import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GlobalStyles } from './design-system/emotion-lite'
import { globalStyles } from './design-system/global-styles'
import IntroPage from './pages/IntroPage'
import QuizPage from './pages/QuizPage'

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles styles={globalStyles} />
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
