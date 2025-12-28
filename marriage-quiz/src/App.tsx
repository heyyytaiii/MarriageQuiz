
import { useMemo, useState } from 'react'
import {
  Actions,
  Badge,
  Button,
  Card,
  CardTitle,
  Description,
  Eyebrow,
  Feedback,
  FeedbackStatus,
  Guidance,
  Option,
  OptionGroup,
  OptionRadio,
  OptionText,
  Page,
  PageHeader,
  Progress,
  StyledTextarea,
  Subtitle,
  TextAnswer,
  Title,
} from './design-system/components'
import { GlobalStyles, css, cx } from './design-system/emotion-lite'
import { globalStyles } from './design-system/global-styles'
import type { Question } from './mockQuestions'
import { questionSections } from './mockQuestions'

type AnswerResult =
  | { status: 'correct'; message: string }
  | { status: 'partial'; message: string }
  | { status: 'incorrect'; message: string }

type QuestionWithSection = Question & {
  sectionId: string
  sectionTitle: string
  sectionDescription: string
  orderInSection: number
  totalInSection: number
}

const flow: QuestionWithSection[] = questionSections.flatMap((section) =>
  section.questions.map((question, index) => ({
    ...question,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionDescription: section.description,
    orderInSection: index + 1,
    totalInSection: section.questions.length,
  })),
)

const sectionMeta = css`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`

const sectionProgressText = css`
  color: #0f172a;
  font-weight: 700;
  font-size: 14px;
`

const questionHeader = css`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
`

const wideHeader = css`
  align-items: center;
  justify-content: space-between;
`

function evaluateAnswer(question: Question, answer: string): AnswerResult {
  if (!answer.trim()) {
    return { status: 'incorrect', message: '답변을 입력하거나 선택해 주세요.' }
  }

  if (question.type === 'single') {
    return answer === question.correctAnswer
      ? { status: 'correct', message: '합의한 방식과 일치합니다.' }
      : {
          status: 'incorrect',
          message: '다시 이야기해 보세요. 서로의 상황에 맞는 선택인지 점검하세요.',
        }
  }

  const normalizedAnswer = answer.toLowerCase()
  const matchedKeywords = question.keywords.filter((keyword) =>
    normalizedAnswer.includes(keyword.toLowerCase()),
  )

  if (matchedKeywords.length === question.keywords.length) {
    return { status: 'correct', message: '핵심 요소를 모두 담았습니다.' }
  }

  if (matchedKeywords.length > 0) {
    return {
      status: 'partial',
      message: `좋아요. "${question.keywords
        .filter((keyword) => !matchedKeywords.includes(keyword))
        .join(', ')}"에 대한 합의도 추가해 주세요.`,
    }
  }

  return {
    status: 'incorrect',
    message: '조율 기준과 분담 방식이 보이지 않아요. 조금 더 구체적으로 작성해 주세요.',
  }
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, AnswerResult>>({})

  const completedCount = useMemo(
    () => flow.filter((question) => results[question.id]?.status === 'correct').length,
    [results],
  )

  const currentQuestion = flow[currentIndex]
  const isLastQuestion = currentIndex === flow.length - 1

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setResults((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleCheckAnswer = () => {
    if (!currentQuestion) return
    const result = evaluateAnswer(currentQuestion, answers[currentQuestion.id] ?? '')
    setResults((prev) => ({ ...prev, [currentQuestion.id]: result }))
  }

  const handleNext = () => {
    if (isLastQuestion) return
    setCurrentIndex((prev) => Math.min(prev + 1, flow.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleReset = () => {
    setAnswers({})
    setResults({})
    setCurrentIndex(0)
  }

  const sectionProgress = `${currentQuestion.orderInSection}/${currentQuestion.totalInSection}`
  const questionProgress = `${currentIndex + 1}/${flow.length}`
  const hasResult = Boolean(results[currentQuestion.id])

  return (
    <>
      <GlobalStyles styles={globalStyles} />
      <Page>
        <PageHeader>
          <div>
            <Eyebrow>Marriage Quiz · 디자인 시스템</Eyebrow>
            <Title>예비 부부 모의고사</Title>
            <Subtitle>{currentQuestion.sectionDescription}</Subtitle>
          </div>
          <div className={sectionMeta}>
            <Badge>{currentQuestion.sectionTitle}</Badge>
            <span className={sectionProgressText}>섹션 진행 {sectionProgress}</span>
            <Progress label="전체 진행" value={questionProgress} />
          </div>
        </PageHeader>

        <Card>
          <div className={cx(questionHeader, currentQuestion.type === 'text' && wideHeader)}>
            <Badge>{currentQuestion.type === 'single' ? '객관식' : '주관식'}</Badge>
            <div>
              <CardTitle>{currentQuestion.prompt}</CardTitle>
              <Description>{currentQuestion.description}</Description>
            </div>
          </div>

          {currentQuestion.type === 'single' ? (
            <OptionGroup>
              {currentQuestion.options.map((option) => (
                <Option key={option} selected={answers[currentQuestion.id] === option}>
                  <OptionRadio
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(event) => handleAnswerChange(currentQuestion.id, event.target.value)}
                  />
                  <OptionText>{option}</OptionText>
                </Option>
              ))}
            </OptionGroup>
          ) : (
            <TextAnswer>
              <Guidance>{currentQuestion.guidance}</Guidance>
              <StyledTextarea
                value={answers[currentQuestion.id] ?? ''}
                onChange={(event) => handleAnswerChange(currentQuestion.id, event.target.value)}
                placeholder="합의 과정을 적어주세요"
                rows={4}
              />
            </TextAnswer>
          )}

          {results[currentQuestion.id] && (
            <Feedback status={results[currentQuestion.id].status}>
              <FeedbackStatus>
                {results[currentQuestion.id].status === 'correct'
                  ? '정답'
                  : results[currentQuestion.id].status === 'partial'
                    ? '보완 필요'
                    : '확인 필요'}
              </FeedbackStatus>
              <span>{results[currentQuestion.id].message}</span>
            </Feedback>
          )}
        </Card>

        <Actions>
          <Button variant="secondary" type="button" onClick={handlePrev} disabled={currentIndex === 0}>
            이전 질문
          </Button>
          <Button variant="primary" type="button" onClick={handleCheckAnswer}>
            정답 체크
          </Button>
          <Button variant="primary" type="button" onClick={handleNext} disabled={!hasResult || isLastQuestion}>
            {isLastQuestion ? '마지막 질문' : '다음 질문'}
          </Button>
          <Button variant="secondary" type="button" onClick={handleReset}>
            전체 리셋
          </Button>
        </Actions>
        <Subtitle>
          정답 확인 완료: {completedCount}/{flow.length}
        </Subtitle>
      </Page>
    </>
  );
}

export default App;
