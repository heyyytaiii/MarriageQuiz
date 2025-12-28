import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Actions,
  Badge,
  Button,
  Card,
  CardTitle,
  Description,
  Eyebrow,
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
} from '../design-system/components'
import { css, cx } from '../design-system/emotion-lite'
import type { Question } from '../types'
import { MOCK_QUESTION } from '../mocks/mock-question'
import { useParticipationStatus } from '../hooks/useParticipationStatus'

type QuestionWithSection = Question & {
  sectionId: string
  sectionTitle: string
  orderInSection: number
  totalInSection: number
}

const groupQuestionsByCategory = (questions: Question[]): QuestionWithSection[] => {
  const categoryOrder: string[] = []
  const grouped = questions.reduce<Record<string, Question[]>>((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
      categoryOrder.push(question.category)
    }
    acc[question.category].push(question)
    return acc
  }, {})

  return categoryOrder.flatMap((category) =>
    grouped[category].map((question, index) => ({
      ...question,
      sectionId: category,
      sectionTitle: category,
      orderInSection: index + 1,
      totalInSection: grouped[category].length,
    })),
  )
}

const flow: QuestionWithSection[] = groupQuestionsByCategory(MOCK_QUESTION)

const questionHeader = css`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
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

const dotBase = css`
  width: 10px;
  height: 10px;
  border-radius: 50%;
`

const answeredDot = cx(
  dotBase,
  css`
    background: #2563eb;
  `,
)

const pendingDot = cx(
  dotBase,
  css`
    background: #e2e8f0;
  `,
)

function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const { hasParticipated, markParticipated, resetParticipation } = useParticipationStatus()
  const navigate = useNavigate()

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

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleNext = () => {
    if (!hasAnswer) return
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
  const isComplete = answeredCount === flow.length && flow.length > 0

  useEffect(() => {
    if (!hasParticipated && isComplete) {
      markParticipated()
    }
  }, [hasParticipated, isComplete, markParticipated])

  const handleRetake = () => {
    resetParticipation()
    setAnswers({})
    setCurrentIndex(0)
  }

  const questionTypeLabel = currentQuestion.type === 'choice' ? '객관식' : '서술형'

  if (hasParticipated) {
    return (
      <Page>
        <PageHeader>
          <div>
            <Eyebrow>Marriage Quiz · 안내</Eyebrow>
            <Title>이미 참여하셨습니다</Title>
            <Subtitle>응시 기록을 초기화하고 재응시하거나 소개 페이지로 돌아가세요.</Subtitle>
          </div>
        </PageHeader>
        <Card>
          <CardTitle>재응시하기</CardTitle>
          <Description>
            이전 응시 기록을 지우고 처음부터 다시 진행합니다. 초기화 후에는 바로 첫 질문으로 이동합니다.
          </Description>
          <Actions>
            <Button variant="primary" type="button" onClick={handleRetake}>
              재응시하기
            </Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/')}>
              소개 페이지로
            </Button>
          </Actions>
        </Card>
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <Eyebrow>Marriage Quiz · 디자인 시스템</Eyebrow>
          <Title>예비 부부 모의고사</Title>
          <Subtitle>{currentQuestion.sectionTitle} 섹션 진행 중</Subtitle>
        </div>
        <div className={sectionMeta}>
          <Badge>{currentQuestion.sectionTitle}</Badge>
          <span className={sectionProgressText}>섹션 진행 {sectionProgress}</span>
          <Progress label="전체 진행" value={questionProgress} />
        </div>
      </PageHeader>

      <Card>
        <div className={questionHeader}>
          <Badge>{questionTypeLabel}</Badge>
          <div>
            <CardTitle>{currentQuestion.question}</CardTitle>
            <Description>카테고리 · {currentQuestion.category}</Description>
          </div>
        </div>

        {currentQuestion.type === 'choice' && currentQuestion.options ? (
          <OptionGroup>
            {currentQuestion.options.map((option) => (
              <Option key={option.value} selected={answers[currentQuestion.id] === option.value}>
                <OptionRadio
                  name={String(currentQuestion.id)}
                  value={option.value}
                  checked={answers[currentQuestion.id] === option.value}
                  onChange={(event) => handleAnswerChange(currentQuestion.id, event.target.value)}
                />
                <OptionText>{option.label}</OptionText>
              </Option>
            ))}
          </OptionGroup>
        ) : (
          <TextAnswer>
            <StyledTextarea
              value={answers[currentQuestion.id] ?? ''}
              onChange={(event) => handleAnswerChange(currentQuestion.id, event.target.value)}
              placeholder="생각을 자유롭게 적어주세요"
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
        <Button variant="primary" type="button" onClick={handleNext} disabled={!hasAnswer || isLastQuestion}>
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
      <Subtitle>
        응답 완료: {answeredCount}/{flow.length}
      </Subtitle>
    </Page>
  )
}

export default QuizPage
