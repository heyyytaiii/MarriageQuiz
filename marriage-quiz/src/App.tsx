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
  Grid,
  Guidance,
  Option,
  OptionGroup,
  OptionRadio,
  OptionText,
  Page,
  PageHeader,
  Progress,
  Subtitle,
  TextAnswer,
  Title,
  StyledTextarea,
} from './design-system/components'
import { GlobalStyles } from './design-system/emotion-lite'
import { globalStyles } from './design-system/global-styles'

type BaseQuestion = {
  id: string
  prompt: string
  description: string
  type: 'single' | 'text'
}

type SingleChoiceQuestion = BaseQuestion & {
  type: 'single'
  options: string[]
  correctAnswer: string
}

type TextQuestion = BaseQuestion & {
  type: 'text'
  guidance: string
  keywords: string[]
}

type Question = SingleChoiceQuestion | TextQuestion

type AnswerResult =
  | { status: 'correct'; message: string }
  | { status: 'partial'; message: string }
  | { status: 'incorrect'; message: string }

const questions: Question[] = [
  {
    id: 'living-space',
    type: 'single',
    prompt: '결혼 초기에 어디에서 함께 지낼지 이미 합의했나요?',
    description:
      '거주 공간에 대한 기본 합의를 확인하고, 서로가 중요하게 생각하는 조건을 이야기해 보세요.',
    options: ['신혼집을 바로 구한다', '한쪽 부모님 댁에서 잠시 지낸다', '아직 정하지 않았다'],
    correctAnswer: '신혼집을 바로 구한다',
  },
  {
    id: 'finance-split',
    type: 'single',
    prompt: '생활비를 어떻게 나눌지 가장 현실적인 방식은 무엇이라고 생각하나요?',
    description:
      '부부 재정은 협력의 영역입니다. 서로의 상황을 듣고, 부담이 되지 않는 방식인지 확인하세요.',
    options: ['월급 비율에 맞춰 분담', '똑같이 50:50', '한 사람이 관리하고 나머지가 이체'],
    correctAnswer: '월급 비율에 맞춰 분담',
  },
  {
    id: 'family-holiday',
    type: 'text',
    prompt: '명절 방문 계획을 어떻게 조율할지 설명해 보세요.',
    description:
      '양가 방문 순서, 기간, 이동 방법 등 구체적인 조율 방식을 적어 보세요. 서로의 기대치를 맞추는 것이 핵심입니다.',
    guidance:
      '예: 첫 해는 양가 번갈아 방문, 이동 시간과 휴식 시간 확보, 교통비와 준비물 분담 방식 등',
    keywords: ['번갈아', '기간', '분담'],
  },
]

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
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, AnswerResult>>({})

  const completedCount = useMemo(
    () => questions.filter((question) => results[question.id]?.status === 'correct').length,
    [results],
  )

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckAnswers = () => {
    const nextResults = questions.reduce<Record<string, AnswerResult>>((acc, question) => {
      acc[question.id] = evaluateAnswer(question, answers[question.id] ?? '')
      return acc
    }, {})
    setResults(nextResults)
  }

  const handleReset = () => {
    setAnswers({})
    setResults({})
  }

  return (
    <>
      <GlobalStyles styles={globalStyles} />
      <Page>
        <PageHeader>
          <div>
            <Eyebrow>Marriage Quiz · 디자인 시스템</Eyebrow>
            <Title>예비 부부 모의고사</Title>
            <Subtitle>
              질문 데이터는 추후 연결됩니다. 지금은 객관식 · 주관식 정답 체크 흐름과 공통 UI를 살펴보세요.
            </Subtitle>
          </div>
          <Progress label="정답 확인" value={`${completedCount}/${questions.length}`} />
        </PageHeader>

        <Grid>
          {questions.map((question) => (
            <Card key={question.id}>
              <div>
                <Badge>{question.type === 'single' ? '객관식' : '주관식'}</Badge>
                <CardTitle>{question.prompt}</CardTitle>
                <Description>{question.description}</Description>
              </div>

              {question.type === 'single' ? (
                <OptionGroup>
                  {question.options.map((option) => (
                    <Option key={option} selected={answers[question.id] === option}>
                      <OptionRadio
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                      />
                      <OptionText>{option}</OptionText>
                    </Option>
                  ))}
                </OptionGroup>
              ) : (
                <TextAnswer>
                  <Guidance>{question.guidance}</Guidance>
                  <StyledTextarea
                    value={answers[question.id] ?? ''}
                    onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                    placeholder="합의 과정을 적어주세요"
                    rows={4}
                  />
                </TextAnswer>
              )}

              {results[question.id] && (
                <Feedback status={results[question.id].status}>
                  <FeedbackStatus>
                    {results[question.id].status === 'correct'
                      ? '정답'
                      : results[question.id].status === 'partial'
                        ? '보완 필요'
                        : '확인 필요'}
                  </FeedbackStatus>
                  <span>{results[question.id].message}</span>
                </Feedback>
              )}
            </Card>
          ))}
        </Grid>

        <Actions>
          <Button variant="secondary" type="button" onClick={handleReset}>
            모두 초기화
          </Button>
          <Button variant="primary" type="button" onClick={handleCheckAnswers}>
            정답 체크
          </Button>
        </Actions>
      </Page>
    </>
  )
}

export default App
