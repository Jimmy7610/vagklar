import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Exam.module.css';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Callout, EmptyState, Pill, SectionHeading } from '@/ui/components/Primitives';
import { Modal } from '@/ui/components/Modal';
import { EXAM } from '@/domain/constants';
import { useActiveExam, useCompletedExams, useLearnerActions } from '@/app/state/useLearner';

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60000);
  return `${minutes} min`;
}

/**
 * The exam hub.
 *
 * The structure is stated plainly, including that the questions are Vägklar's
 * own. We never suggest the app contains official test items.
 */
export default function ExamPage() {
  const activeExam = useActiveExam();
  const completed = useCompletedExams();
  const actions = useLearnerActions();
  const navigate = useNavigate();
  const [confirmStart, setConfirmStart] = useState(false);

  const startExam = () => {
    actions.startExam();
    setConfirmStart(false);
    navigate('/prov/pagaende');
  };

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Provsimulering</h1>
        <p className={styles.lead}>
          Samma struktur som kunskapsprovet för B-körkort, med Vägklars egna frågor. Tiden räknar
          ner även om du lämnar sidan.
        </p>
      </header>

      <section className={styles.specs} aria-label="Provets struktur">
        <div className={styles.spec}>
          <div className={styles.specValue}>{EXAM.totalQuestions}</div>
          <div className={styles.specLabel}>frågor</div>
        </div>
        <div className={styles.spec}>
          <div className={styles.specValue}>{EXAM.durationMinutes}</div>
          <div className={styles.specLabel}>minuter</div>
        </div>
        <div className={styles.spec}>
          <div className={styles.specValue}>{EXAM.passThreshold}</div>
          <div className={styles.specLabel}>av {EXAM.scoredQuestions} rätt krävs</div>
        </div>
      </section>

      {activeExam ? (
        <Callout tone="warning">
          <strong>Du har ett pågående prov.</strong> Klockan fortsätter räkna ner tills tiden är
          slut.{' '}
          <Link to="/prov/pagaende" style={{ fontWeight: 600 }}>
            Fortsätt provet
          </Link>
        </Callout>
      ) : (
        <div>
          <Button size="lg" onClick={() => setConfirmStart(true)} iconAfter="arrow-right">
            Starta provsimulering
          </Button>
        </div>
      )}

      <Callout tone="neutral" icon="info">
        Fem av de {EXAM.totalQuestions} frågorna räknas inte in i resultatet. Det efterliknar
        provets struktur — vilka de var får du veta först efter att du lämnat in.
      </Callout>

      <section aria-labelledby="history-heading">
        <SectionHeading title="Tidigare försök" id="history-heading" />
        {completed.length === 0 ? (
          <EmptyState
            icon="exam"
            title="Inga prov än"
            body="När du gjort en provsimulering samlas resultaten här, med analys per kunskapsområde."
          />
        ) : (
          <div className={styles.historyList}>
            {completed.map((attempt) => {
              const result = attempt.result;
              if (!result) return null;
              return (
                <Link
                  key={attempt.id}
                  to={`/prov/resultat/${attempt.id}`}
                  className={styles.historyRow}
                >
                  <span
                    className={[
                      styles.historyScore,
                      result.passed ? styles.historyPass : styles.historyFail,
                    ].join(' ')}
                  >
                    {result.score}
                  </span>
                  <span>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-small)' }}>
                      {result.passed ? 'Godkänd' : 'Inte godkänd'}
                    </span>
                    <span className={styles.historyMeta}>
                      {formatDate(attempt.submittedAt ?? attempt.startedAt)} ·{' '}
                      {formatDuration(result.durationMs)} · {result.answered} besvarade
                      {attempt.status === 'expired' ? ' · tiden tog slut' : ''}
                    </span>
                  </span>
                  <Icon name="chevron-right" size={18} />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="prepare-heading">
        <SectionHeading title="Inte redo än?" id="prepare-heading" level={3} />
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <ButtonLink to="/trana" variant="secondary" icon="practice">
            Träna först
          </ButtonLink>
          <ButtonLink to="/utveckling" variant="secondary" icon="progress">
            Se din utveckling
          </ButtonLink>
        </div>
      </section>

      <Modal
        open={confirmStart}
        onClose={() => setConfirmStart(false)}
        title="Starta provsimulering?"
        description={`${EXAM.totalQuestions} frågor på ${EXAM.durationMinutes} minuter.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmStart(false)}>
              Avbryt
            </Button>
            <Button onClick={startExam} data-autofocus>
              Starta provet
            </Button>
          </>
        }
      >
        <ul style={{ display: 'grid', gap: 'var(--space-3)', fontSize: 'var(--text-small)' }}>
          <li style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Icon name="clock" size={17} />
            Tiden börjar direkt och fortsätter även om du stänger fliken.
          </li>
          <li style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Icon name="eye" size={17} />
            Du får ingen återkoppling förrän du lämnat in.
          </li>
          <li style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Icon name="bookmark" size={17} />
            Du kan markera frågor och gå tillbaka till dem.
          </li>
          <li style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Icon name="offline" size={17} />
            Provet fungerar även utan uppkoppling.
          </li>
        </ul>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Pill tone="neutral">Provet påverkar din provberedskap</Pill>
        </div>
      </Modal>
    </div>
  );
}
