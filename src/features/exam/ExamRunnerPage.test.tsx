import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IDBFactory } from 'fake-indexeddb';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ExamRunnerPage from './ExamRunnerPage';
import { UiProvider } from '@/app/state/UiProvider';
import { learnerStore } from '@/app/state/learnerStore';
import { getQuestion } from '@/domain/content/bank';
import { EXAM } from '@/domain/constants';

/**
 * The exam this test runs against, pinned.
 *
 * `startExam` seeds from `now ^ Math.random()`, so every run used to get a
 * different paper. That is right for the product and wrong for a test: it made
 * the assertions depend on which of 442 questions happened to be drawn.
 *
 * It bit exactly once in a way that took a while to see. The test used to ask
 * for the answer button by building a regex out of the first 30 characters of
 * the correct answer — and `omk-001`'s correct answer is "Till vänster.",
 * where the full stop is a regex wildcard. It therefore also matched "Till
 * vänster på landsväg och till höger i tätort.", two buttons matched, and
 * `getByRole` threw. Measured over 2000 generated papers, that question landed
 * in slot one in 0.30 % of them: one run in about three hundred.
 *
 * Both halves are fixed here. The paper is pinned so the test is reproducible,
 * and answers are matched on their full text rather than a regex fragment —
 * `answersAreDistinguishable` in the validation suite guards that no answer's
 * text is a substring of another, which is what makes that safe.
 */
const FIXED_NOW = Date.UTC(2026, 8, 2, 9, 0, 0);

function startPinnedExam() {
  return learnerStore.startExam(FIXED_NOW);
}

/**
 * Finds an answer button by its full text.
 *
 * A plain substring test on the accessible name, never a regex: the answers
 * are ordinary Swedish sentences and punctuation in them is not pattern
 * syntax.
 */
function answerButton(text: string) {
  return screen.getByRole('button', { name: (name: string) => name.includes(text) });
}

function renderRunner() {
  return render(
    <UiProvider>
      <MemoryRouter initialEntries={['/prov/pagaende']}>
        <Routes>
          <Route path="/prov/pagaende" element={<ExamRunnerPage />} />
          <Route path="/prov" element={<div>Provsidan</div>} />
          <Route path="/prov/resultat/:attemptId" element={<div>Resultatsidan</div>} />
        </Routes>
      </MemoryRouter>
    </UiProvider>,
  );
}

beforeEach(async () => {
  // Two things have to be pinned, not one. Math.random is half the exam seed,
  // and Date.now is the other half — and the runner also measures the
  // countdown against Date.now, so a pinned seed with a live clock puts the
  // deadline in the past and the exam redirects away before it renders.
  // Stubbing the clock rather than installing fake timers keeps userEvent on
  // real timers, which is where it is well behaved.
  vi.spyOn(Math, 'random').mockReturnValue(0.4242);
  vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);
  globalThis.indexedDB = new IDBFactory();
  await learnerStore.reset(FIXED_NOW);
  await learnerStore.init(FIXED_NOW);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ExamRunnerPage', () => {
  it('draws the same paper on every run', () => {
    // The point of pinning, asserted directly rather than inferred from a
    // hundred green runs. If seeding ever becomes unpinnable again this fails
    // immediately instead of once in three hundred CI runs.
    const first = startPinnedExam().questions.map((q) => q.questionId);
    expect(first).toHaveLength(EXAM.totalQuestions);
    expect(first[0]).toBe(startPinnedExam().questions[0]!.questionId);
  });

  it('sends the learner back when there is no exam running', () => {
    renderRunner();
    expect(screen.getByText('Provsidan')).toBeInTheDocument();
  });

  it('shows the current question and the countdown', () => {
    const attempt = startPinnedExam();
    const question = getQuestion(attempt.questions[0]!.questionId)!;

    renderRunner();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(question.prompt);
    expect(screen.getByText(`Fråga 1 / ${EXAM.totalQuestions}`)).toBeInTheDocument();
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('never reveals whether an answer is correct', async () => {
    const user = userEvent.setup();
    const attempt = startPinnedExam();
    const question = getQuestion(attempt.questions[0]!.questionId)!;
    const correct = question.answers.find((a) => a.id === question.correctAnswerId)!;

    renderRunner();

    await user.click(answerButton(correct.text));

    expect(screen.queryByText('Rätt')).not.toBeInTheDocument();
    expect(screen.queryByText('Inte riktigt')).not.toBeInTheDocument();
    expect(screen.queryByText(question.shortExplanation)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Rätt svar')).not.toBeInTheDocument();
    // The choice is still visibly recorded.
    expect(answerButton(correct.text)).toHaveAttribute('aria-pressed', 'true');
  });

  it('lets the learner mark a question and move between questions', async () => {
    const user = userEvent.setup();
    startPinnedExam();
    renderRunner();

    await user.click(screen.getByRole('button', { name: 'Markera' }));
    expect(screen.getByRole('button', { name: 'Markerad' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /nästa/i }));
    expect(screen.getByText(`Fråga 2 / ${EXAM.totalQuestions}`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /föregående/i }));
    expect(screen.getByText(`Fråga 1 / ${EXAM.totalQuestions}`)).toBeInTheDocument();
    // The mark survived the round trip.
    expect(screen.getByRole('button', { name: 'Markerad' })).toBeInTheDocument();
  });

  it('disables Föregående on the first question', () => {
    startPinnedExam();
    renderRunner();
    expect(screen.getByRole('button', { name: /föregående/i })).toBeDisabled();
  });

  it('warns about unanswered questions before submitting', async () => {
    const user = userEvent.setup();
    startPinnedExam();
    renderRunner();

    await user.click(screen.getByRole('button', { name: 'Lämna in' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/fortfarande obesvarad/i)).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: /gå till första obesvarade/i }),
    ).toBeInTheDocument();
  });

  it('goes to the result after submitting', async () => {
    const user = userEvent.setup();
    startPinnedExam();
    renderRunner();

    await user.click(screen.getByRole('button', { name: 'Lämna in' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Lämna in' }));

    expect(screen.getByText('Resultatsidan')).toBeInTheDocument();
    expect(learnerStore.getActiveExam()).toBeNull();
  });

  it('offers a full question overview on small screens', async () => {
    const user = userEvent.setup();
    startPinnedExam();
    renderRunner();

    await user.click(screen.getByRole('button', { name: /översikt över frågorna/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('button', { name: /fråga 5, obesvarad/i })).toBeInTheDocument();
  });
});
