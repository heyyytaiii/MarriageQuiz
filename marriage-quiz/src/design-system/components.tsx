import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'
import { css, cx } from './emotion-lite'
import { theme } from './theme'

const page = css`
  & {
    max-width: 960px;
    margin: 0 auto;
    padding: ${theme.spacing(12)} ${theme.spacing(5)} ${theme.spacing(18)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(8)};
    color: ${theme.colors.ink[900]};
  }
`

const pageHeader = css`
  & {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${theme.spacing(4)};
  }
`

const eyebrow = css`
  & {
    font-size: ${theme.typography.label.size};
    font-weight: ${theme.typography.label.weight};
    color: ${theme.colors.primary[600]};
    letter-spacing: ${theme.typography.label.letterSpacing};
    margin: 0;
  }
`

const title = css`
  & {
    margin: ${theme.spacing(2)} 0 ${theme.spacing(3)};
    font-size: ${theme.typography.title1.size};
    line-height: ${theme.typography.title1.lineHeight};
  }
`

const subtitle = css`
  & {
    margin: 0;
    color: ${theme.colors.ink[500]};
    line-height: ${theme.typography.body.lineHeight};
    font-size: ${theme.typography.body.size};
  }
`

const progress = css`
  & {
    background: ${theme.colors.primary[50]};
    color: ${theme.colors.primary[700]};
    border: 1px solid ${theme.colors.primary[100]};
    padding: ${theme.spacing(3)} ${theme.spacing(4)};
    border-radius: ${theme.radius.lg};
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    white-space: nowrap;
    font-weight: ${theme.typography.label.weight};
  }
`

const progressValue = css`
  & {
    font-size: 20px;
    font-weight: 800;
  }
`

const grid = css`
  & {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${theme.spacing(5)};
  }
`

const card = css`
  & {
    background: ${theme.colors.card};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius.lg};
    padding: ${theme.spacing(5)};
    box-shadow: ${theme.shadow.lg};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(4)};
  }
`

const cardTitle = css`
  & {
    margin: ${theme.spacing(1)} 0 ${theme.spacing(2)};
    font-size: ${theme.typography.title2.size};
    line-height: ${theme.typography.title2.lineHeight};
    font-weight: ${theme.typography.title2.weight};
  }
`

const description = css`
  & {
    margin: 0;
    color: ${theme.colors.ink[500]};
    line-height: ${theme.typography.body.lineHeight};
    font-size: ${theme.typography.body.size};
  }
`

const optionGroup = css`
  & {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
  }
`

const option = css`
  & {
    display: flex;
    gap: ${theme.spacing(3)};
    align-items: center;
    padding: ${theme.spacing(3)};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius.md};
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
  }

  &:hover {
    border-color: ${theme.colors.primary[100]};
    background: ${theme.colors.primary[25]};
  }
`

const optionSelected = css`
  & {
    border-color: ${theme.colors.primary[200]};
    background: ${theme.colors.primary[25]};
    box-shadow: ${theme.shadow.sm};
  }
`

const optionRadio = css`
  & {
    accent-color: ${theme.colors.primary[600]};
    width: 18px;
    height: 18px;
  }
`

const optionText = css`
  & {
    font-weight: 600;
    color: ${theme.colors.ink[900]};
  }
`

const textAnswer = css`
  & {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  }
`

const guidance = css`
  & {
    margin: 0;
    color: ${theme.colors.ink[700]};
    font-weight: ${theme.typography.label.weight};
    font-size: ${theme.typography.label.size};
  }
`

const textInputClass = css`
  & {
    width: 100%;
    border-radius: ${theme.radius.md};
    border: 1px solid ${theme.colors.border};
    padding: ${theme.spacing(3)};
    font-size: 14px;
    line-height: ${theme.typography.body.lineHeight};
    font-family: ${theme.fontFamily};
    background: #fff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    outline: none;
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary[200]};
    border-color: ${theme.colors.primary[200]};
    box-shadow: ${theme.shadow.sm};
  }
`

const textareaClass = css`
  & {
    width: 100%;
    border-radius: ${theme.radius.md};
    border: 1px solid ${theme.colors.border};
    padding: ${theme.spacing(3)};
    font-size: 14px;
    line-height: ${theme.typography.body.lineHeight};
    resize: vertical;
    min-height: 120px;
    font-family: ${theme.fontFamily};
    background: #fff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary[100]};
    border-color: ${theme.colors.primary[200]};
    box-shadow: ${theme.shadow.sm};
  }
`

const feedbackBase = css`
  & {
    border-radius: ${theme.radius.md};
    padding: ${theme.spacing(3)} ${theme.spacing(3.5)};
    display: flex;
    gap: ${theme.spacing(2.5)};
    align-items: center;
    border: 1px solid transparent;
    font-size: ${theme.typography.body.size};
    line-height: ${theme.typography.body.lineHeight};
    font-weight: 600;
  }
`

const feedbackVariants = {
  correct: css`
    & {
      background: ${theme.colors.success.surface};
      color: ${theme.colors.success.text};
      border-color: ${theme.colors.success.border};
    }
  `,
  partial: css`
    & {
      background: ${theme.colors.warning.surface};
      color: ${theme.colors.warning.text};
      border-color: ${theme.colors.warning.border};
    }
  `,
  incorrect: css`
    & {
      background: ${theme.colors.danger.surface};
      color: ${theme.colors.danger.text};
      border-color: ${theme.colors.danger.border};
    }
  `,
}

const feedbackStatus = css`
  & {
    font-weight: 800;
  }
`

const actions = css`
  & {
    display: flex;
    gap: ${theme.spacing(3)};
    justify-content: flex-end;
  }
`

const buttonBase = css`
  & {
    border-radius: ${theme.radius.md};
    border: 1px solid transparent;
    padding: ${theme.spacing(3)} ${theme.spacing(4.5)};
    font-size: ${theme.typography.body.size};
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.2s ease, border-color 0.2s ease,
      background-color 0.2s ease;
    font-family: ${theme.fontFamily};
  }
`

const buttonVariants = {
  primary: css`
    & {
      background: linear-gradient(90deg, ${theme.colors.primary[600]}, ${theme.colors.primary[700]});
      color: #ffffff;
      box-shadow: ${theme.shadow.sm};
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 22px rgba(37, 99, 235, 0.3);
    }
  `,
  secondary: css`
    & {
      background: #ffffff;
      color: ${theme.colors.ink[900]};
      border-color: ${theme.colors.border};
    }

    &:hover {
      border-color: ${theme.colors.ink[300]};
      background: ${theme.colors.ink[50]};
    }
  `,
}

const badge = css`
  & {
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: ${theme.spacing(1)} ${theme.spacing(2.5)};
    border-radius: 999px;
    background: ${theme.colors.primary[25]};
    color: ${theme.colors.primary[700]};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
`

export const Page = ({ children }: { children: ReactNode }) => <div className={page}>{children}</div>

export const PageHeader = ({ children }: { children: ReactNode }) => (
  <header className={pageHeader}>{children}</header>
)

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className={eyebrow}>{children}</p>
)

export const Title = ({ children }: { children: ReactNode }) => <h1 className={title}>{children}</h1>

export const Subtitle = ({ children }: { children: ReactNode }) => (
  <p className={subtitle}>{children}</p>
)

export const Progress = ({ label, value }: { label: string; value: string }) => (
  <div className={progress}>
    <span>{label}</span>
    <strong className={progressValue}>{value}</strong>
  </div>
)

export const Grid = ({ children }: { children: ReactNode }) => <section className={grid}>{children}</section>

export const Card = ({ children }: { children: ReactNode }) => <article className={card}>{children}</article>

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <h2 className={cardTitle}>{children}</h2>
)

export const Description = ({ children }: { children: ReactNode }) => (
  <p className={description}>{children}</p>
)

export const OptionGroup = ({ children }: { children: ReactNode }) => (
  <div className={optionGroup}>{children}</div>
)

export const Option = ({
  children,
  className,
  selected,
  ...props
}: {
  children: ReactNode
  className?: string
  selected?: boolean
} & HTMLAttributes<HTMLLabelElement>) => (
  <label className={cx(option, selected && optionSelected, className)} {...props}>
    {children}
  </label>
)

export const OptionRadio = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={optionRadio} type="radio" {...props} />
)

export const OptionText = ({ children }: { children: ReactNode }) => (
  <span className={optionText}>{children}</span>
)

export const TextAnswer = ({ children }: { children: ReactNode }) => (
  <div className={textAnswer}>{children}</div>
)

export const Guidance = ({ children }: { children: ReactNode }) => (
  <p className={guidance}>{children}</p>
)

export const StyledTextInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={textInputClass} {...props} />
)

export const StyledTextarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={textareaClass} {...props} />
)

export const Feedback = ({
  status,
  children,
}: {
  status: 'correct' | 'partial' | 'incorrect'
  children: ReactNode
}) => <div className={cx(feedbackBase, feedbackVariants[status])}>{children}</div>

export const FeedbackStatus = ({ children }: { children: ReactNode }) => (
  <span className={feedbackStatus}>{children}</span>
)

export const Actions = ({ children }: { children: ReactNode }) => <footer className={actions}>{children}</footer>

export const Button = ({
  variant,
  children,
  className,
  ...props
}: {
  variant: keyof typeof buttonVariants
  children: ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cx(buttonBase, buttonVariants[variant], className)} {...props}>
    {children}
  </button>
)

export const Badge = ({ children }: { children: ReactNode }) => <span className={badge}>{children}</span>
