import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFunnel } from "@use-funnel/react-router-dom";
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
  StyledTextInput,
  Subtitle,
  TextAnswer,
  Title,
} from "../design-system/components";
import { css, cx } from "../design-system/emotion-lite";
import type { Question } from "../types";
import { MOCK_QUESTION } from "../mocks/mock-question";
import { useParticipationStatus } from "../hooks/useParticipationStatus";

type QuestionWithSection = Question & {
  sectionId: string;
  sectionTitle: string;
  orderInSection: number;
  totalInSection: number;
};

const groupQuestionsByCategory = (
  questions: Question[]
): QuestionWithSection[] => {
  const categoryOrder: string[] = [];
  const grouped = questions.reduce<Record<string, Question[]>>(
    (acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
        categoryOrder.push(question.category);
      }
      acc[question.category].push(question);
      return acc;
    },
    {}
  );

  return categoryOrder.flatMap((category) =>
    grouped[category].map((question, index) => ({
      ...question,
      sectionId: category,
      sectionTitle: category,
      orderInSection: index + 1,
      totalInSection: grouped[category].length,
    }))
  );
};

const flow: QuestionWithSection[] = groupQuestionsByCategory(MOCK_QUESTION);

const questionHeader = css`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const answerMeta = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #475569;
  font-size: 14px;
`;

const dotBase = css`
  width: 10px;
  height: 10px;
  border-radius: 50%;
`;

const answeredDot = cx(
  dotBase,
  css`
    background: #2563eb;
  `
);

const pendingDot = cx(
  dotBase,
  css`
    background: #e2e8f0;
  `
);

const toast = css`
  position: fixed;
  right: 24px;
  bottom: 24px;
  background: #0f172a;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.35);
  font-weight: 700;
  font-size: 14px;
`;

function QuizPage() {
  const [flowState] = useState(flow);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const { hasParticipated, markParticipated, resetParticipation } =
    useParticipationStatus();
  const navigate = useNavigate();
  const questionSteps = useMemo(
    () => flowState.map((question) => String(question.id)),
    [flowState]
  );

  const stepContexts = useMemo(
    () =>
      flowState.reduce<Record<string, { questionId: number }>>(
        (acc, question) => {
          acc[String(question.id)] = { questionId: question.id };
          return acc;
        },
        {}
      ),
    [flowState]
  );

  const funnel = useFunnel<Record<string, { questionId: number }>>({
    id: "quiz-flow",
    initial: {
      step: questionSteps[0],
      context: stepContexts[questionSteps[0]],
    },
  });

  const answeredCount = useMemo(
    () =>
      flowState.filter(
        (question) => (answers[question.id]?.trim() ?? "").length > 0
      ).length,
    [answers, flowState]
  );

  const currentQuestion =
    flowState.find((question) => String(question.id) === funnel.step) ??
    flowState[0];
  const currentIndex = useMemo(
    () =>
      flowState.findIndex((question) => String(question.id) === funnel.step),
    [funnel.step, flowState]
  );

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(
      () => setToastMessage(null),
      2200
    );
  };

  const handleNext = () => {
    if (!hasAnswer) {
      showToast("답변을 입력해야 다음으로 이동할 수 있어요.");
      return;
    }
    if (isLastQuestion) return;
    const nextQuestion = flowState[currentIndex + 1];
    funnel.history.push(String(nextQuestion.id), {
      questionId: nextQuestion.id,
    });
  };

  const handlePrev = () => {
    if (isFirst) return;
    const previousQuestion = flowState[currentIndex - 1];
    funnel.history.push(String(previousQuestion.id), {
      questionId: previousQuestion.id,
    });
  };

  const questionProgress = `${(currentIndex >= 0 ? currentIndex : 0) + 1}/${
    flowState.length
  }`;
  const hasAnswer = currentQuestion
    ? (answers[currentQuestion.id]?.trim() ?? "").length > 0
    : false;
  const isComplete = answeredCount === flowState.length && flowState.length > 0;
  const isFirst = currentIndex <= 0;
  const isLastQuestion = currentIndex === flowState.length - 1;

  useEffect(() => {
    if (!hasParticipated && isComplete) {
      markParticipated();
    }
  }, [hasParticipated, isComplete, markParticipated]);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    },
    []
  );

  const handleRetake = () => {
    resetParticipation();
    setAnswers({});
    if (!questionSteps[0]) return;
    funnel.history.push(questionSteps[0], stepContexts[questionSteps[0]]);
  };

  if (hasParticipated) {
    return (
      <Page>
        <PageHeader>
          <div>
            <Eyebrow>Marriage Quiz · 안내</Eyebrow>
            <Title>이미 참여하셨습니다</Title>
            <Subtitle>
              응시 기록을 초기화하고 재응시하거나 소개 페이지로 돌아가세요.
            </Subtitle>
          </div>
        </PageHeader>
        <Card>
          <CardTitle>재응시하기</CardTitle>
          <Description>
            이전 응시 기록을 지우고 처음부터 다시 진행합니다. 초기화 후에는 바로
            첫 질문으로 이동합니다.
          </Description>
          <Actions>
            <Button variant="primary" type="button" onClick={handleRetake}>
              재응시하기
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/")}
            >
              소개 페이지로
            </Button>
          </Actions>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <Eyebrow>Marriage Quiz · 디자인 시스템</Eyebrow>
          <Title>예비 부부 모의고사</Title>
          <Subtitle>진행 중인 질문 {questionProgress}</Subtitle>
        </div>
        <Progress label="전체 진행" value={questionProgress} />
      </PageHeader>

      {currentQuestion && (
        <Card>
          <div className={questionHeader}>
            <Badge>
              {currentQuestion.type === "choice" ? "객관식" : "서술형"}
            </Badge>
            <div>
              <CardTitle>{currentQuestion.question}</CardTitle>
              <Description>카테고리 · {currentQuestion.category}</Description>
            </div>
          </div>

          {currentQuestion.type === "choice" && currentQuestion.options ? (
            <OptionGroup>
              {currentQuestion.options.map((option) => (
                <Option
                  key={option.value}
                  selected={answers[currentQuestion.id] === option.value}
                >
                  <OptionRadio
                    name={String(currentQuestion.id)}
                    value={option.value}
                    checked={answers[currentQuestion.id] === option.value}
                    onChange={(event) =>
                      handleAnswerChange(currentQuestion.id, event.target.value)
                    }
                  />
                  <OptionText>{option.label}</OptionText>
                </Option>
              ))}
            </OptionGroup>
          ) : (
            <TextAnswer>
              <StyledTextInput
                key={currentQuestion.id}
                value={answers[currentQuestion.id] ?? ""}
                onChange={(event) =>
                  handleAnswerChange(currentQuestion.id, event.target.value)
                }
                placeholder="생각을 자유롭게 적어주세요"
                inputMode="text"
                autoFocus
                enterKeyHint={isLastQuestion ? "done" : "next"}
              />
            </TextAnswer>
          )}
          <div className={answerMeta}>
            <span
              className={hasAnswer ? answeredDot : pendingDot}
              aria-hidden
            />
            {hasAnswer ? "답변이 저장되었어요." : "답변을 입력해 주세요."}
          </div>
        </Card>
      )}

      <Actions>
        <Button
          variant="secondary"
          type="button"
          onClick={handlePrev}
          disabled={isFirst}
        >
          이전 질문
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={handleNext}
          disabled={isLastQuestion}
        >
          {isLastQuestion ? "마지막 질문" : "다음 질문으로"}
        </Button>
      </Actions>
      <Subtitle>
        응답 완료: {answeredCount}/{flow.length}
      </Subtitle>
      {toastMessage && <div className={toast}>{toastMessage}</div>}
    </Page>
  );
}

export default QuizPage;
