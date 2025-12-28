import { useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Description,
  Eyebrow,
  Feedback,
  FeedbackStatus,
  Grid,
  Page,
  PageHeader,
  Subtitle,
  Title,
} from '../design-system/components'
import { css } from '../design-system/emotion-lite'
import { useParticipationStatus } from '../hooks/useParticipationStatus'

const hero = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 720px;
`

const heroActions = css`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`

const helperText = css`
  color: #475569;
  margin: 0;
  line-height: 1.6;
`

const list = css`
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #334155;
`

const badgeRow = css`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

function IntroPage() {
  const navigate = useNavigate()
  const { hasParticipated, resetParticipation } = useParticipationStatus()

  const handleStart = () => {
    navigate('/quiz')
  }

  const handleRetake = () => {
    resetParticipation()
    navigate('/quiz')
  }

  return (
    <Page>
      <PageHeader>
        <div className={hero}>
          <Eyebrow>Marriage Quiz · 시작하기</Eyebrow>
          <Title>두 사람이 함께 준비하는 예비 부부 모의고사</Title>
          <Subtitle>
            커플 스페이스 안에서만 서로의 답변을 비교하며 대화를 이어갈 수 있어요. 지금 바로
            질문을 풀고, 중요한 이야기를 정리해 보세요.
          </Subtitle>
          <div className={heroActions}>
            <Button variant="primary" type="button" onClick={handleStart} disabled={hasParticipated}>
              응시하기
            </Button>
            {hasParticipated && (
              <Button variant="secondary" type="button" onClick={handleRetake}>
                재응시하기
              </Button>
            )}
          </div>
          <div className={badgeRow}>
            {hasParticipated && (
              <Feedback status="correct">
                <FeedbackStatus>참여 완료</FeedbackStatus>
                이미 참여하셨습니다. 답변을 다시 확인하거나 이어서 진행할 수 있어요.
              </Feedback>
            )}
            <Badge>커플 스페이스 전용</Badge>
            <Badge>비공개 · 보안 유지</Badge>
          </div>
        </div>
      </PageHeader>

      <Grid>
        <Card>
          <CardTitle>이렇게 진행돼요</CardTitle>
          <Description>간단한 절차로 질문을 풀고 서로의 생각을 비교할 수 있습니다.</Description>
          <ol className={list}>
            <li>응시하기를 눌러 바로 질문을 풀기 시작하세요.</li>
            <li>답변은 커플 스페이스 내부에만 저장되어 안전하게 공유됩니다.</li>
            <li>모든 답변을 마치면 서로 다른 답변을 중심으로 대화를 이어가세요.</li>
          </ol>
        </Card>
        <Card>
          <CardTitle>준비된 질문 살펴보기</CardTitle>
          <Description>재정, 가족, 생활습관 등 결혼 후 필요한 주제를 담았어요.</Description>
          <ul className={list}>
            <li>객관식과 서술형 질문이 섞여 있어 생각을 정리하기 좋아요.</li>
            <li>각 섹션 진행도를 확인하며 부담 없이 이어갈 수 있어요.</li>
            <li>필요하면 다시 돌아와 답변을 수정할 수 있습니다.</li>
          </ul>
          <p className={helperText}>
            이미 참여한 경우 재응시하기로 상태를 초기화한 뒤 다시 시작할 수 있습니다.
          </p>
        </Card>
      </Grid>
    </Page>
  )
}

export default IntroPage
