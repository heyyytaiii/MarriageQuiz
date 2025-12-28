import { useMemo, useState } from 'react'
import {
  Actions,
  Badge,
  Button,
  Card,
  CardTitle,
  Description,
  Eyebrow,
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
import type { Question, QuestionSection } from './types'
import questionData from './mocks/mock-question.json'

type QuestionWithSection = Question & {
  sectionId: string
  sectionTitle: string
  sectionDescription: string
  orderInSection: number
  totalInSection: number
}

const flow: QuestionWithSection[] = (questionData.sections as QuestionSection[]).flatMap((section) =>
  section.questions.map((question, index) => ({
    ...question,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionDescription: section.description,
    orderInSection: index + 1,
    totalInSection: section.questions.length,
  })),
)

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

const answerMeta = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #475569;
  font-size: 14px;
`

const answeredDot = css`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2563eb;
`

const pendingDot = css`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e2e8f0;
`

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const answeredCount = useMemo(
    () => flow.filter((question) => (answers[question.id]?.trim() ?? '').length > 0).length,
    [answers],
  )

  const currentQuestion = flow[currentIndex]
  const isLastQuestion = currentIndex === flow.length - 1
  const currentSectionAnswered = useMemo(
    () =>
      flow.filter(
        (question) =>
          question.sectionId === currentQuestion.sectionId &&
          (answers[question.id]?.trim() ?? '').length > 0,
      ).length,
    [answers, currentQuestion.sectionId],
  )

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleNext = () => {
    if (isLastQuestion) return
    setCurrentIndex((prev) => Math.min(prev + 1, flow.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleBackToStart = () => {
    setCurrentIndex(0)
  }

  const sectionProgress = `${currentSectionAnswered}/${currentQuestion.totalInSection}`
  const questionProgress = `${currentIndex + 1}/${flow.length}`
  const hasAnswer = (answers[currentQuestion.id]?.trim() ?? '').length > 0

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
          <div className={answerMeta}>
            <span className={hasAnswer ? answeredDot : pendingDot} aria-hidden />
            {hasAnswer ? '답변이 저장되었습니다.' : '답변을 입력해 주세요.'}
          </div>
        </Card>

        <Actions>
          <Button variant="secondary" type="button" onClick={handlePrev} disabled={currentIndex === 0}>
            이전 질문
          </Button>
          <Button variant="primary" type="button" onClick={handleNext} disabled={isLastQuestion}>
            {isLastQuestion ? '마지막 질문' : '다음 질문으로'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handleBackToStart}
            disabled={currentIndex === 0}
          >
            처음 질문으로
          </Button>
        </Actions>
        <Subtitle>응답 완료: {answeredCount}/{flow.length}</Subtitle>
      </Page>
    </>
  );
}

export default App;
