import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Callout, Pill, SectionHeading } from '@/ui/components/Primitives';
import { IntersectionScene } from '@/ui/illustrations/IntersectionScene';
import { getScenario } from '@/content/scenarios';
import { getCategoryName } from '@/content/taxonomy';

/**
 * Scenario runner.
 *
 * Two interaction models over one data shape:
 *   - order-of-passage: tap vehicles in order
 *   - risk-spotting:    choose the hazard
 *
 * Both are operable from the keyboard, and both offer a list-based alternative
 * so the exercise never depends on pointing at a picture.
 */
export default function ScenarioRunnerPage() {
  const { scenarioId } = useParams();
  const scenario = scenarioId ? getScenario(scenarioId) : undefined;

  const [order, setOrder] = useState<string[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const orderMap = useMemo(
    () => Object.fromEntries(order.map((id, index) => [id, index + 1])),
    [order],
  );

  if (!scenario) return <Navigate to="/scenarier" replace />;

  const isOrdering = scenario.kind === 'order-of-passage';
  const correct = isOrdering
    ? JSON.stringify(order) === JSON.stringify(scenario.correctOrder ?? [])
    : (scenario.hotspots?.find((h) => h.id === selectedHotspot)?.isRisk ?? false);

  const toggleVehicle = (vehicleId: string) => {
    if (checked) return;
    setOrder((current) =>
      current.includes(vehicleId)
        ? current.filter((id) => id !== vehicleId)
        : [...current, vehicleId],
    );
  };

  const reset = () => {
    setOrder([]);
    setSelectedHotspot(null);
    setChecked(false);
  };

  const canCheck = isOrdering
    ? order.length === scenario.vehicles.length
    : selectedHotspot !== null;

  return (
    <div className={page.page}>
      <header className={page.header}>
        <Link to="/scenarier" className={page.backLink}>
          <Icon name="chevron-left" size={16} />
          Scenariolabbet
        </Link>
        <h1 className={page.title}>{scenario.title}</h1>
        <p className={page.lead}>{scenario.prompt}</p>
      </header>

      <div className={page.panel}>
        <IntersectionScene
          scenario={scenario}
          order={orderMap}
          onSelect={isOrdering ? toggleVehicle : undefined}
          revealed={checked && isOrdering}
        />
      </div>

      {/* Non-visual alternative — always present, not a fallback. */}
      <section aria-labelledby="choices-heading">
        <SectionHeading
          title={isOrdering ? 'Välj ordning' : 'Vad är risken?'}
          id="choices-heading"
          level={3}
        />

        {isOrdering ? (
          <div className={page.rows}>
            {scenario.vehicles.map((vehicle) => {
              const position = orderMap[vehicle.id];
              return (
                <button
                  key={vehicle.id}
                  type="button"
                  className={page.row}
                  onClick={() => toggleVehicle(vehicle.id)}
                  disabled={checked}
                  aria-pressed={position !== undefined}
                >
                  <span
                    className={page.rowIcon}
                    style={
                      position
                        ? {
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                            fontWeight: 700,
                          }
                        : undefined
                    }
                  >
                    {position ?? <Icon name="plus" size={16} />}
                  </span>
                  <span>
                    <span className={page.rowTitle}>{vehicle.label}</span>
                    <span className={page.rowMeta}>
                      {vehicle.intent === 'straight'
                        ? 'Ska rakt fram'
                        : vehicle.intent === 'left'
                          ? 'Ska svänga vänster'
                          : 'Ska svänga höger'}
                      {vehicle.isEgo ? ' · det här är du' : ''}
                    </span>
                  </span>
                  <span />
                </button>
              );
            })}
          </div>
        ) : (
          <div className={page.rows}>
            {(scenario.hotspots ?? []).map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                className={page.row}
                onClick={() => !checked && setSelectedHotspot(hotspot.id)}
                disabled={checked}
                aria-pressed={selectedHotspot === hotspot.id}
                style={
                  selectedHotspot === hotspot.id
                    ? { borderColor: 'var(--color-primary)' }
                    : undefined
                }
              >
                <span
                  className={page.rowIcon}
                  style={
                    checked && selectedHotspot === hotspot.id
                      ? {
                          backgroundColor: hotspot.isRisk
                            ? 'var(--color-success-soft)'
                            : 'var(--color-danger-soft)',
                          color: hotspot.isRisk
                            ? 'var(--color-success-strong)'
                            : 'var(--color-danger-strong)',
                        }
                      : undefined
                  }
                >
                  <Icon name="eye" size={17} />
                </span>
                <span>
                  <span className={page.rowTitle}>{hotspot.label}</span>
                  {checked && <span className={page.rowMeta}>{hotspot.explanation}</span>}
                </span>
                <span />
              </button>
            ))}
          </div>
        )}
      </section>

      {!checked ? (
        <div className={page.actions}>
          <Button size="lg" onClick={() => setChecked(true)} disabled={!canCheck}>
            Kontrollera
          </Button>
          {(order.length > 0 || selectedHotspot) && (
            <Button size="lg" variant="secondary" onClick={reset}>
              Börja om
            </Button>
          )}
        </div>
      ) : (
        <>
          <Callout tone={correct ? 'success' : 'warning'}>
            <strong>{correct ? 'Rätt.' : 'Inte riktigt.'}</strong> {scenario.explanation}
          </Callout>

          {scenario.stepExplanations && scenario.correctOrder && (
            <section aria-labelledby="steps-heading">
              <SectionHeading title="Steg för steg" id="steps-heading" level={3} />
              <div className={page.rows}>
                {scenario.correctOrder.map((vehicleId, index) => {
                  const vehicle = scenario.vehicles.find((v) => v.id === vehicleId);
                  return (
                    <div className={page.row} key={vehicleId}>
                      <span
                        className={page.rowIcon}
                        style={{
                          backgroundColor: 'var(--color-success-soft)',
                          color: 'var(--color-success-strong)',
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </span>
                      <span>
                        <span className={page.rowTitle}>{vehicle?.label ?? vehicleId}</span>
                        <span className={page.rowMeta}>
                          {scenario.stepExplanations?.[index] ?? ''}
                        </span>
                      </span>
                      <span />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className={page.actions}>
            <Button size="lg" variant="secondary" onClick={reset} icon="refresh">
              Prova igen
            </Button>
            <ButtonLink
              to={`/utveckling/omrade/${scenario.subcategory}`}
              size="lg"
              variant="secondary"
            >
              Träna {scenario.ruleTested.toLowerCase()}
            </ButtonLink>
            <ButtonLink to="/scenarier" size="lg">
              Nästa scenario
            </ButtonLink>
          </div>
        </>
      )}

      <div>
        <Pill tone="outline">
          {getCategoryName(scenario.categoryId)} · {scenario.ruleTested}
        </Pill>
      </div>
    </div>
  );
}
