import { Link } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import { Icon } from '@/ui/icons/Icon';
import { Callout, Pill, SectionHeading } from '@/ui/components/Primitives';
import { IntersectionScene } from '@/ui/illustrations/IntersectionScene';
import { SCENARIOS } from '@/content/scenarios';
import { getCategoryName } from '@/content/taxonomy';

const KIND_LABEL: Record<string, string> = {
  'order-of-passage': 'Vem kör först',
  'risk-spotting': 'Hitta risken',
  placement: 'Placering',
};

/**
 * Scenario Lab index.
 *
 * The model is extensible by design: a scenario is data (layout, vehicles,
 * correct order or hotspots), so new situations do not require new components.
 */
export default function ScenarioPage() {
  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Scenariolabb</h1>
        <p className={page.lead}>
          Väjningsregler blir enklare när du ser dem uppifrån. Lös situationen, och få hela
          resonemanget steg för steg.
        </p>
      </header>

      <Callout tone="neutral" icon="info">
        Varje scenario har en fullständig textbeskrivning, så övningen går att lösa även utan att se
        bilden.
      </Callout>

      <section aria-labelledby="scenarios-heading">
        <SectionHeading title="Situationer" id="scenarios-heading" />
        <div className={page.grid2}>
          {SCENARIOS.map((scenario) => (
            <Link
              key={scenario.id}
              to={`/scenarier/${scenario.id}`}
              className={page.panel}
              style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gap: 'var(--space-3)' }}
            >
              <IntersectionScene scenario={scenario} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                }}
              >
                <div>
                  <div className={page.panelTitle} style={{ margin: 0 }}>
                    {scenario.title}
                  </div>
                  <div className={page.rowMeta}>
                    {getCategoryName(scenario.categoryId)} · {scenario.ruleTested}
                  </div>
                </div>
                <Icon name="chevron-right" size={18} />
              </div>
              <div>
                <Pill tone="primary">{KIND_LABEL[scenario.kind] ?? scenario.kind}</Pill>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
