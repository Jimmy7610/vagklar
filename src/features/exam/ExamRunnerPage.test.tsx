import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IDBFactory } from 'fake-indexeddb';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ExamRunnerPage from './ExamRunnerPage';
import { UiProvider } from '@/app/state/UiProvider';
import { learnerStore } from '@/app/state/learnerStore';
import { getQuestion } from '@/domain/content/bank';
import { EXAM } from '@/domain/constants';

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
  globalThis.indexedDB = new IDBFactory();
  await learnerStore.reset(Date.now());
  await learnerStore.init(Date.now());
});

describe('ExamRunnerPage', () => {
  it('sends the learner back when there is no exam running', () => {
    renderRunner();
    expect(screen.getByText('Provsidan')).toBeInTheDocument();
  });

  it('shows the current question and the countdown', () => {
    const attempt = learnerStore.startExam(Date.now());
    const question = getQuestion(attempt.questions[0]!.questionId)!;

    renderRunner();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(question.prompt);
    expect(screen.getByText(`Fråga 1 / ${EXAM.totalQuestions}`)).toBeInTheDocument();
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('never reveals whether an answer is correct', async () => {
    const user = userEvent.setup();
    const attempt = learnerStore.startExam(Date.now());
    const question = getQuestion(attempt.questions[0]!.questionId)!;
    const correct = question.answers.find((a) => a.id === question.correctAnswerId)!;

    renderRunner();

    await user.click(
      screen.getByRole('button', { name: new RegExp(correct.text.slice(0, 30), 'i') }),
    );

    expect(screen.queryByText('Rätt')).not.toBeInTheDocument();
    expect(screen.queryByText('Inte riktigt')).not.toBeInTheDocument();
    expect(screen.queryByText(question.shortExplanation)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Rätt svar')).not.toBeInTheDocument();
    // The choice is still visibly recorded.
    expect(
      screen.getByRole('button', { name: new RegExp(correct.text.slice(0, 30), 'i') }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('lets the learner mark a question and move between questions', async () => {
    const user = userEvent.setup();
    learnerStore.startExam(Date.now());
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
    learnerStore.startExam(Date.now());
    renderRunner();
    expect(screen.getByRole('button', { name: /föregående/i })).toBeDisabled();
  });

  it('warns about unanswered questions before submitting', async () => {
    const user = userEvent.setup();
    learnerStore.startExam(Date.now());
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
    learnerStore.startExam(Date.now());
    renderRunner();

    await user.click(screen.getByRole('button', { name: 'Lämna in' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Lämna in' }));

    expect(screen.getByText('Resultatsidan')).toBeInTheDocument();
    expect(learnerStore.getActiveExam()).toBeNull();
  });

  it('offers a full question overview on small screens', async () => {
    const user = userEvent.setup();
    learnerStore.startExam(Date.now());
    renderRunner();

    await user.click(screen.getByRole('button', { name: /översikt över frågorna/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('button', { name: /fråga 5, obesvarad/i })).toBeInTheDocument();
  });
});
