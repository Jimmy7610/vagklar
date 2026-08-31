import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OnboardingPage.module.css';
import { Button } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Wordmark } from '@/ui/brand/Logo';
import { useLearnerActions, useSelectionContext } from '@/app/state/useLearner';
import { buildLevelTest, buildQuickSession } from '@/domain/selection/selection';
import { SESSION } from '@/domain/constants';

const STEPS = [
  {
    icon: 'target' as const,
    title: 'Vägklar lär sig av dina svar',
    text: 'Varje svar formar bilden av vad du kan. Appen bygger nästa pass utifrån den — du tränar det du behöver, inte allt om och om igen.',
  },
  {
    icon: 'shield' as const,
    title: 'Din utveckling stannar här',
    text: 'Inget konto och ingen server. Allt sparas i den här webbläsaren. Du kan exportera en säkerhetskopia när du vill.',
  },
];

/**
 * First-run onboarding.
 *
 * Three screens at most, no personal information, and skippable throughout.
 * The last step is a real choice that changes what happens next.
 */
export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const actions = useLearnerActions();
  const context = useSelectionContext();
  const navigate = useNavigate();

  const finish = (path: 'basics' | 'level-test') => {
    actions.completeOnboarding(path);

    if (path === 'level-test') {
      const questions = buildLevelTest(context.seed);
      const started = actions.startSession({
        mode: 'level-test',
        label: 'Nivåtest',
        questionIds: questions.map((q) => q.id),
      });
      actions.markLevelTestCompleted();
      navigate(started ? '/trana/pass' : '/hem', { replace: true });
      return;
    }

    const questions = buildQuickSession(context, 7, { kind: 'all' });
    const started = actions.startSession({
      mode: 'training',
      label: 'Grunderna',
      questionIds: questions.map((q) => q.id),
    });
    navigate(started ? '/trana/pass' : '/hem', { replace: true });
  };

  const skip = () => {
    actions.completeOnboarding('basics');
    navigate('/hem', { replace: true });
  };

  const isLast = step === STEPS.length;
  const currentStep = STEPS[step];

  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        <Wordmark size={24} />
        <div className={styles.dots} aria-hidden="true">
          {[...STEPS, null].map((_, index) => (
            <span
              key={index}
              className={[styles.dot, index === step ? styles.dotActive : ''].filter(Boolean).join(' ')}
            />
          ))}
        </div>
        <button type="button" className={styles.skip} onClick={skip}>
          Hoppa över
        </button>
      </div>

      <div className={styles.body}>
        <span className="visually-hidden" aria-live="polite">
          Steg {step + 1} av {STEPS.length + 1}
        </span>

        {!isLast && currentStep ? (
          <>
            <div className={styles.art}>
              <Icon name={currentStep.icon} size={52} />
            </div>
            <h1 className={styles.title}>{currentStep.title}</h1>
            <p className={styles.text}>{currentStep.text}</p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Hur vill du börja?</h1>
            <p className={styles.text}>
              Båda vägarna fungerar. Nivåtestet ger en snabbare bild av var du står.
            </p>

            <div className={styles.choices}>
              <button type="button" className={styles.choice} onClick={() => finish('basics')}>
                <span className={styles.choiceIcon}>
                  <Icon name="book" size={21} />
                </span>
                <span>
                  <span className={styles.choiceTitle}>Börja från grunden</span>
                  <span className={styles.choiceMeta}>
                    Ett kort pass med blandade frågor · ca 4 min
                  </span>
                </span>
                <Icon name="chevron-right" size={20} />
              </button>

              <button type="button" className={styles.choice} onClick={() => finish('level-test')}>
                <span className={styles.choiceIcon}>
                  <Icon name="target" size={21} />
                </span>
                <span>
                  <span className={styles.choiceTitle}>Gör ett nivåtest</span>
                  <span className={styles.choiceMeta}>
                    {SESSION.levelTestSize} frågor över alla områden · ca 12 min
                  </span>
                </span>
                <Icon name="chevron-right" size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {!isLast && (
        <div className={styles.footer}>
          <Button size="lg" block onClick={() => setStep((current) => current + 1)} iconAfter="arrow-right">
            Fortsätt
          </Button>
        </div>
      )}
    </div>
  );
}
