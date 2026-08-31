import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QuestionCard } from './QuestionCard';
import { getQuestion } from '@/domain/content/bank';
import type { QuestionCardProps } from './QuestionCard';

const question = getQuestion('kor-001')!;

function setup(overrides: Partial<QuestionCardProps> = {}) {
  const props: QuestionCardProps = {
    question,
    index: 3,
    total: 10,
    selectedAnswerId: null,
    confidence: null,
    responseMs: null,
    onAnswer: vi.fn(),
    onConfidence: vi.fn(),
    onNext: vi.fn(),
    onSave: vi.fn(),
    isSaved: false,
    confidencePrompt: 'smart',
    ...overrides,
  };

  const utils = render(
    <MemoryRouter>
      <QuestionCard {...props} />
    </MemoryRouter>,
  );
  return { ...utils, props };
}

describe('QuestionCard', () => {
  it('shows the prompt, progress and every alternative', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(question.prompt);
    expect(screen.getByText('4 / 10')).toBeInTheDocument();
    for (const answer of question.answers) {
      expect(screen.getByRole('button', { name: new RegExp(answer.text.slice(0, 30), 'i') })).toBeInTheDocument();
    }
  });

  it('does not reveal the answer before the learner picks one', () => {
    setup();
    expect(screen.queryByText('Rätt')).not.toBeInTheDocument();
    expect(screen.queryByText('Inte riktigt')).not.toBeInTheDocument();
    expect(screen.queryByText(question.shortExplanation)).not.toBeInTheDocument();
  });

  it('reports the chosen alternative with a response time', async () => {
    const user = userEvent.setup();
    const { props } = setup();
    const target = question.answers[1]!;

    await user.click(screen.getByRole('button', { name: new RegExp(target.text.slice(0, 30), 'i') }));

    expect(props.onAnswer).toHaveBeenCalledTimes(1);
    const [answerId, responseMs] = (props.onAnswer as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(answerId).toBe(target.id);
    expect(typeof responseMs).toBe('number');
    expect(responseMs).toBeGreaterThanOrEqual(0);
  });

  it('accepts letter and number shortcuts', async () => {
    const user = userEvent.setup();
    const { props, unmount } = setup();

    await user.keyboard('b');
    expect(props.onAnswer).toHaveBeenCalledWith(question.answers[1]!.id, expect.any(Number));
    unmount();

    const second = setup();
    await user.keyboard('3');
    expect(second.props.onAnswer).toHaveBeenCalledWith(question.answers[2]!.id, expect.any(Number));
  });

  it('shows the verdict and explanation once answered correctly', () => {
    setup({ selectedAnswerId: question.correctAnswerId, responseMs: 5000 });
    expect(screen.getByText('Rätt')).toBeInTheDocument();
    expect(screen.getByText(question.shortExplanation)).toBeInTheDocument();
  });

  it('marks a wrong answer and still reveals the right one', () => {
    const wrong = question.answers.find((a) => a.id !== question.correctAnswerId)!;
    setup({ selectedAnswerId: wrong.id, responseMs: 5000 });

    expect(screen.getByText('Inte riktigt')).toBeInTheDocument();
    expect(screen.getByLabelText('Rätt svar')).toBeInTheDocument();
    expect(screen.getByLabelText('Ditt svar, felaktigt')).toBeInTheDocument();
  });

  it('locks the alternatives after answering', () => {
    setup({ selectedAnswerId: question.correctAnswerId, responseMs: 5000 });
    for (const answer of question.answers) {
      expect(
        screen.getByRole('button', { name: new RegExp(answer.text.slice(0, 30), 'i') }),
      ).toBeDisabled();
    }
  });

  it('reveals the deeper explanation only on request', async () => {
    const user = userEvent.setup();
    setup({ selectedAnswerId: question.correctAnswerId, responseMs: 5000 });

    expect(screen.queryByText(question.deepExplanation!)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /förklara mer/i }));
    expect(screen.getByText(question.deepExplanation!)).toBeInTheDocument();
  });

  it('asks for confidence after a mistake in smart mode', () => {
    const wrong = question.answers.find((a) => a.id !== question.correctAnswerId)!;
    setup({ selectedAnswerId: wrong.id, responseMs: 4000 });
    expect(screen.getByText('Hur säker var du?')).toBeInTheDocument();
  });

  it('stays out of the way after a quick correct answer in smart mode', () => {
    setup({ selectedAnswerId: question.correctAnswerId, responseMs: 4000 });
    expect(screen.queryByText('Hur säker var du?')).not.toBeInTheDocument();
  });

  it('asks for confidence when a correct answer took a long time', () => {
    setup({
      selectedAnswerId: question.correctAnswerId,
      responseMs: question.estimatedTimeSec * 1000 * 3,
    });
    expect(screen.getByText('Hur säker var du?')).toBeInTheDocument();
  });

  it('never asks for confidence when the learner turned it off', () => {
    const wrong = question.answers.find((a) => a.id !== question.correctAnswerId)!;
    setup({ selectedAnswerId: wrong.id, responseMs: 4000, confidencePrompt: 'never' });
    expect(screen.queryByText('Hur säker var du?')).not.toBeInTheDocument();
  });

  it('reports the chosen confidence level', async () => {
    const user = userEvent.setup();
    const { props } = setup({
      selectedAnswerId: question.correctAnswerId,
      responseMs: 5000,
      confidencePrompt: 'always',
    });

    await user.click(screen.getByRole('button', { name: 'Gissade' }));
    expect(props.onConfidence).toHaveBeenCalledWith('guessed');
  });

  it('advances with Enter once answered, and not before', async () => {
    const user = userEvent.setup();
    const unanswered = setup();
    await user.keyboard('{Enter}');
    expect(unanswered.props.onNext).not.toHaveBeenCalled();
    unanswered.unmount();

    const answered = setup({ selectedAnswerId: question.correctAnswerId, responseMs: 5000 });
    await user.keyboard('{Enter}');
    expect(answered.props.onNext).toHaveBeenCalled();
  });

  it('labels the last question as the end of the session', () => {
    setup({ index: 9, total: 10, selectedAnswerId: question.correctAnswerId, responseMs: 5000 });
    expect(screen.getByRole('button', { name: /avsluta passet/i })).toBeInTheDocument();
  });

  it('lets the learner save the question', async () => {
    const user = userEvent.setup();
    const { props } = setup({ selectedAnswerId: question.correctAnswerId, responseMs: 5000 });
    await user.click(screen.getByRole('button', { name: /spara frågan/i }));
    expect(props.onSave).toHaveBeenCalled();
  });

  it('hides correctness entirely when feedback is suppressed', () => {
    setup({
      selectedAnswerId: question.correctAnswerId,
      responseMs: 5000,
      showFeedback: false,
    });
    expect(screen.queryByText('Rätt')).not.toBeInTheDocument();
    expect(screen.queryByText(question.shortExplanation)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Rätt svar')).not.toBeInTheDocument();
  });

  it('announces progress to assistive technology', () => {
    setup();
    expect(screen.getByText('Fråga 4 av 10')).toBeInTheDocument();
  });
});

describe('road sign questions', () => {
  it('renders the sign with an accessible description', () => {
    const signQuestion = getQuestion('kor-004')!;
    render(
      <MemoryRouter>
        <QuestionCard
          question={signQuestion}
          index={0}
          total={1}
          selectedAnswerId={null}
          confidence={null}
          responseMs={null}
          onAnswer={vi.fn()}
          onConfidence={vi.fn()}
          onNext={vi.fn()}
          onSave={vi.fn()}
          isSaved={false}
          confidencePrompt="smart"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('img', { name: signQuestion.image!.alt })).toBeInTheDocument();
    expect(screen.getByText(signQuestion.accessibilityText!)).toBeInTheDocument();
  });
});
