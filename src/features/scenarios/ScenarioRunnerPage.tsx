import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import styles from './ScenarioRunner.module.css';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Callout, Pill, SectionHeading } from '@/ui/components/Primitives';
import { ScenarioStage } from '@/ui/illustrations/ScenarioStage';
import { getScenario, SCENARIOS } from '@/content/scenarios';
import { getCategoryName } from '@/content/taxonomy';
import {
  buildReplaySequence,
  evaluateHotspot,
  evaluateOrder,
  orderableVehicles,
  replayProgressAt,
  resolveScenario,
} from '@/domain/scenarios/scenario';
import { prefersReducedMotion } from '@/app/state/theme';
import { useLearner } from '@/app/state/useLearner';

/**
 * Scenario runner.
 *
 * Two genuinely different jobs sit side by side on desktop: the situation on
 * the left, everything you do about it on the right. On narrow screens they
 * stack in reading order — title, prompt, scene, interaction, feedback.
 *
 * Every interaction has both a visual and a list-based route, so the exercise
 * never requires pointing at a picture.
 */

const STEP_MS = 1150;
const PAUSE_MS = 420;

export default function ScenarioRunnerPage() {
  const { scenarioId } = useParams();
  const base = scenarioId ? getScenario(scenarioId) : undefined;
  const { preferences } = useLearner();

  const [variantId, setVariantId] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [showOverlays, setShowOverlays] = useState(false);

  /* ---- Replay state ------------------------------------------------- */
  const [replayIndex, setReplayIndex] = useState<number | null>(null);
  const [replayProgress, setReplayProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = useMemo(
    () => (base ? resolveScenario(base, variantId) : undefined),
    [base, variantId],
  );

  const sequence = useMemo(() => (scenario ? buildReplaySequence(scenario) : []), [scenario]);

  const reduceMotion = preferences.motion === 'reduced' || (preferences.motion === 'system' && prefersReducedMotion());

  const clearTimers = useCallback(() => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setOrder([]);
    setSelectedHotspot(null);
    setChecked(false);
    setShowOverlays(false);
    setReplayIndex(null);
    setReplayProgress(0);
  }, [clearTimers]);

  /*
   * Switching variant restarts the exercise, because it is a different
   * question. Done here in the event handler rather than in an effect watching
   * `variantId` — the reset is a consequence of the click, not of the render.
   */
  const selectVariant = useCallback(
    (id: string | null) => {
      reset();
      setVariantId(id);
    },
    [reset],
  );

  const evaluation = useMemo(
    () => (scenario ? evaluateOrder(scenario, order) : null),
    [scenario, order],
  );

  const hotspotResult = useMemo(
    () => (scenario ? evaluateHotspot(scenario, selectedHotspot) : null),
    [scenario, selectedHotspot],
  );

  const startReplay = useCallback(() => {
    if (sequence.length === 0) return;
    clearTimers();
    setChecked(true);
    setReplayIndex(0);
    // With reduced motion the cars never travel — not even as an instant jump.
    // The sequence badges and the step caption carry the whole story instead.
    setReplayProgress(0);

    sequence.forEach((_, index) => {
      const at = index * (STEP_MS + PAUSE_MS);
      timers.current.push(
        setTimeout(() => {
          setReplayIndex(index);
          if (!reduceMotion) {
            setReplayProgress(0);
            // Next frame, so the CSS transition has a start value to move from.
            timers.current.push(setTimeout(() => setReplayProgress(1), 40));
          }
        }, at),
      );
    });

    timers.current.push(
      setTimeout(
        () => setReplayIndex(sequence.length - 1),
        sequence.length * (STEP_MS + PAUSE_MS),
      ),
    );
  }, [sequence, clearTimers, reduceMotion]);

  const stopReplay = useCallback(() => {
    clearTimers();
    setReplayIndex(null);
    setReplayProgress(0);
  }, [clearTimers]);

  if (!scenario || !base) return <Navigate to="/scenarier" replace />;

  const isOrdering = scenario.kind === 'order-of-passage';
  const orderable = orderableVehicles(scenario);
  const orderMap = Object.fromEntries(order.map((id, index) => [id, index + 1]));

  const canCheck = isOrdering ? order.length === orderable.length : selectedHotspot !== null;
  const correct = isOrdering ? (evaluation?.correct ?? false) : (hotspotResult?.correct ?? false);

  const replayActive = replayIndex !== null;
  const activeReplay = replayActive ? sequence[replayIndex] : undefined;

  // Reduced motion: no positions are handed to the stage at all, so every car
  // stays exactly where it started and only the sequence badges change.
  const stageProgress =
    replayActive && !reduceMotion
      ? replayProgressAt(sequence, replayIndex, replayProgress)
      : undefined;

  const toggleVehicle = (vehicleId: string) => {
    if (checked) return;
    setOrder((current) =>
      current.includes(vehicleId)
        ? current.filter((id) => id !== vehicleId)
        : [...current, vehicleId],
    );
  };

  const undo = () => {
    if (checked) return;
    setOrder((current) => current.slice(0, -1));
  };

  const nextScenario = SCENARIOS[(SCENARIOS.findIndex((s) => s.id === base.id) + 1) % SCENARIOS.length];

  return (
    // Focus routes render outside AppLayout and therefore outside its <main>.
    // Without this the page has no main landmark at all.
    <main className={page.page}>
      <header className={page.header}>
        <Link to="/scenarier" className={page.backLink}>
          <Icon name="chevron-left" size={16} />
          Scenariolabbet
        </Link>
        <h1 className={page.title}>{scenario.title}</h1>
        <p className={page.lead}>
          {getCategoryName(scenario.categoryId)} · {scenario.ruleTested}
        </p>
      </header>

      <div className={styles.workspace}>
        {/* ---- Stage ---------------------------------------------------- */}
        <section className={styles.stagePanel} aria-label="Trafiksituation">
          <div className={styles.stageBox}>
            <ScenarioStage
              scenario={scenario}
              order={orderMap}
              onSelectVehicle={isOrdering && !checked ? toggleVehicle : undefined}
              onSelectHotspot={!isOrdering && !checked ? setSelectedHotspot : undefined}
              selectedHotspot={selectedHotspot}
              revealed={checked && isOrdering}
              showOverlays={showOverlays}
              {...(stageProgress ? { replayProgress: stageProgress } : {})}
              replayStep={replayIndex}
              replayDurationMs={reduceMotion ? 0 : STEP_MS}
            />
          </div>

          {replayActive && activeReplay ? (
            <p className={styles.replayCaption} aria-live="polite">
              <span className={styles.replayStepBadge}>{activeReplay.index + 1}</span>
              <span>{activeReplay.caption}</span>
            </p>
          ) : (
            <div className={styles.stageFooter}>
              <span className={styles.stageHint}>
                {isOrdering
                  ? checked
                    ? 'Grön siffra visar rätt ordning.'
                    : 'Tryck på ett fordon i bilden eller välj i listan.'
                  : 'Tryck på ett område i bilden eller välj i listan.'}
              </span>
            </div>
          )}
        </section>

        {/* ---- Interaction --------------------------------------------- */}
        <div className={styles.panel}>
          <p className={styles.prompt}>{scenario.prompt}</p>

          {isOrdering && (
            <>
              <div>
                <div className={styles.sectionLabel} id="order-label">
                  Din ordning
                </div>
                <div className={styles.orderPreview} aria-labelledby="order-label" aria-live="polite">
                  {order.length === 0 ? (
                    <span className={styles.orderEmpty}>Ingen vald än</span>
                  ) : (
                    order.map((id, index) => {
                      const vehicle = scenario.vehicles.find((v) => v.id === id);
                      return (
                        <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          {index > 0 && (
                            <span className={styles.orderArrow} aria-hidden="true">
                              →
                            </span>
                          )}
                          <span className={styles.orderChip}>
                            {index + 1}. {vehicle?.label ?? id}
                          </span>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel} id="choices-label">
                  Välj ordning
                </div>
                <div className={styles.choices} role="group" aria-labelledby="choices-label">
                  {orderable.map((vehicle) => {
                    const position = orderMap[vehicle.id];
                    const selected = position !== undefined;
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        className={[styles.choice, selected ? styles.choiceSelected : '']
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => toggleVehicle(vehicle.id)}
                        disabled={checked}
                        aria-pressed={selected}
                      >
                        {/* Leading badge is the vehicle's identity, matching the
                            scene. The chosen position gets its own pill on the
                            right, so nothing is shown twice. */}
                        <span className={styles.choiceBadge}>{vehicle.label}</span>
                        <span>
                          <span className={styles.choiceLabel}>
                            {vehicle.isEgo ? 'Din bil' : `Fordon ${vehicle.label}`}
                            {vehicle.isEgo && (
                              <span className={styles.egoChip} aria-hidden="true">
                                DIN BIL
                              </span>
                            )}
                          </span>
                          <span className={styles.choiceMeta}>{vehicle.description}</span>
                        </span>
                        {selected ? (
                          <span className={styles.positionPill} aria-hidden="true">
                            {position}
                          </span>
                        ) : (
                          <span aria-hidden="true">
                            <Icon name="plus" size={17} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {!isOrdering && (
            <div>
              <div className={styles.sectionLabel} id="risk-label">
                Vad är risken?
              </div>
              <div className={styles.choices} role="group" aria-labelledby="risk-label">
                {(scenario.hotspots ?? []).map((hotspot) => {
                  const selected = selectedHotspot === hotspot.id;
                  return (
                    <button
                      key={hotspot.id}
                      type="button"
                      className={[styles.choice, selected ? styles.choiceSelected : '']
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setSelectedHotspot(hotspot.id)}
                      disabled={checked}
                      aria-pressed={selected}
                    >
                      <span className={styles.choiceBadge}>
                        <Icon name="eye" size={16} />
                      </span>
                      <span>
                        <span className={styles.choiceLabel}>{hotspot.label}</span>
                        {checked && <span className={styles.choiceMeta}>{hotspot.explanation}</span>}
                      </span>
                      <span aria-hidden="true">
                        <Icon name={selected ? 'check' : 'plus'} size={17} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---- Actions ------------------------------------------------ */}
          {!checked ? (
            <div className={styles.actions}>
              <Button onClick={() => setChecked(true)} disabled={!canCheck}>
                Kontrollera
              </Button>
              {isOrdering && (
                <Button variant="secondary" onClick={undo} disabled={order.length === 0}>
                  Ångra senaste
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={reset}
                disabled={order.length === 0 && selectedHotspot === null}
              >
                Börja om
              </Button>
            </div>
          ) : (
            <div className={styles.actions}>
              {isOrdering &&
                (replayActive ? (
                  <Button variant="secondary" icon="close" onClick={stopReplay}>
                    Stoppa
                  </Button>
                ) : (
                  <Button variant="secondary" icon="play" onClick={startReplay}>
                    Spela upp
                  </Button>
                ))}
              <Button
                variant={showOverlays ? 'soft' : 'secondary'}
                icon="eye"
                onClick={() => setShowOverlays((v) => !v)}
                aria-pressed={showOverlays}
              >
                {showOverlays ? 'Dölj reglerna' : 'Visa reglerna'}
              </Button>
              <Button variant="ghost" icon="refresh" onClick={reset}>
                Försök igen
              </Button>
            </div>
          )}

          {/* ---- Feedback ----------------------------------------------- */}
          {checked && (
            <div className={styles.feedback} role="status">
              <div
                className={[styles.verdict, correct ? styles.verdictCorrect : styles.verdictWrong].join(
                  ' ',
                )}
              >
                <Icon name={correct ? 'check-circle' : 'x-circle'} size={22} />
                {correct ? 'Rätt' : 'Inte riktigt'}
              </div>

              {isOrdering && !correct && evaluation?.mistakeSummary && (
                <p className={styles.mistake}>{evaluation.mistakeSummary}</p>
              )}

              {!isOrdering && hotspotResult?.explanation && (
                <p className={styles.mistake}>{hotspotResult.explanation}</p>
              )}

              <p className={styles.mistake} style={{ color: 'var(--color-text-secondary)' }}>
                {scenario.explanation}
              </p>

              {isOrdering && evaluation && evaluation.steps.length > 0 && (
                <div>
                  <div className={styles.sectionLabel} style={{ marginBottom: 'var(--space-2)' }}>
                    Rätt ordning
                  </div>
                  <ol className={styles.steps}>
                    {evaluation.steps.map((step) => (
                      <li
                        key={step.vehicleId}
                        className={[
                          styles.step,
                          replayActive && activeReplay?.vehicleId === step.vehicleId
                            ? styles.stepActive
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span className={styles.stepNumber}>{step.position}</span>
                        <span>
                          <span className={styles.stepVehicle}>
                            {step.label}
                            {step.isEgo ? ' — din bil' : ''}
                          </span>
                          <span className={styles.stepText}>{step.explanation}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* ---- Variants ------------------------------------------------ */}
          {(base.variants?.length ?? 0) > 0 && (
            <div>
              <div className={styles.sectionLabel} style={{ marginBottom: 'var(--space-2)' }}>
                Vad förändras om…
              </div>
              <div className={styles.variants}>
                <button
                  type="button"
                  className={[styles.variantChip, variantId === null ? styles.variantActive : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => selectVariant(null)}
                  aria-pressed={variantId === null}
                >
                  <span className={styles.variantIcon}>
                    <Icon name="home" size={15} />
                  </span>
                  <span>
                    <span className={styles.variantLabel}>Grundsituationen</span>
                    <span className={styles.variantQuestion}>Situationen som den beskrivs ovan</span>
                  </span>
                </button>

                {(base.variants ?? []).map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={[styles.variantChip, variantId === variant.id ? styles.variantActive : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => selectVariant(variant.id)}
                    aria-pressed={variantId === variant.id}
                  >
                    <span className={styles.variantIcon}>
                      <Icon name="sparkle" size={15} />
                    </span>
                    <span>
                      <span className={styles.variantLabel}>{variant.label}</span>
                      <span className={styles.variantQuestion}>{variant.question}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Textual replay sequence — the replay is never purely visual. */}
      {isOrdering && sequence.length > 0 && (
        <ol className={styles.srOnlyList} aria-label="Händelseförlopp i ordning">
          {sequence.map((step) => (
            <li key={step.vehicleId}>
              {step.index + 1}. {step.label}: {step.caption}
            </li>
          ))}
        </ol>
      )}

      <SectionHeading title="Fortsätt" />
      <div className={page.actions}>
        <ButtonLink to={`/utveckling/omrade/${scenario.subcategory}`} variant="secondary">
          Träna {scenario.ruleTested.toLowerCase()}
        </ButtonLink>
        {nextScenario && nextScenario.id !== base.id && (
          <ButtonLink to={`/scenarier/${nextScenario.id}`} iconAfter="arrow-right">
            Nästa scenario
          </ButtonLink>
        )}
      </div>

      <Callout tone="neutral" icon="info">
        <Pill tone="outline">{getCategoryName(scenario.categoryId)}</Pill>{' '}
        Situationen är Vägklars egen illustration. Reglerna följer{' '}
        {scenario.sourceReferences.map((s) => s.name).join(', ')}.
      </Callout>
    </main>
  );
}
