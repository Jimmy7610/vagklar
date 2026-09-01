import { Link } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import styles from './ScenarioList.module.css';
import { Icon } from '@/ui/icons/Icon';
import { Callout, Pill, SectionHeading } from '@/ui/components/Primitives';
import { ScenarioStage } from '@/ui/illustrations/ScenarioStage';
import { SCENARIOS } from '@/content/scenarios';
import { getCategoryName } from '@/content/taxonomy';
import type { ScenarioKind } from '@/domain/content/types';

const KIND_LABEL: Record<ScenarioKind, string> = {
  'order-of-passage': 'Vem kör först',
  'risk-spotting': 'Hitta risken',
  placement: 'Placering',
};

/**
 * Scenario Lab index.
 *
 * Thumbnails are deliberately bounded: the stage is square, so left to fill a
 * card it would grow as tall as the card is wide and turn the list into a
 * scroll marathon.
 */
export default function ScenarioPage() {
  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Scenariolabb</h1>
        <p className={page.lead}>
          Väjningsregler blir enklare när du ser dem uppifrån. Lös situationen, spela upp förloppet
          och se hela resonemanget steg för steg.
        </p>
      </header>

      <Callout tone="neutral" icon="info">
        Varje scenario har en fullständig textbeskrivning och en listbaserad variant av varje
        interaktion, så övningen går att lösa utan att se bilden.
      </Callout>

      <section aria-labelledby="scenarios-heading">
        <SectionHeading title="Situationer" id="scenarios-heading" />
        <div className={styles.grid}>
          {SCENARIOS.map((scenario) => (
            <Link key={scenario.id} to={`/scenarier/${scenario.id}`} className={styles.card}>
              <div className={styles.thumb}>
                <ScenarioStage scenario={scenario} />
              </div>

              <div className={styles.body}>
                <div className={styles.head}>
                  <div>
                    <div className={styles.title}>{scenario.title}</div>
                    <div className={styles.meta}>
                      {getCategoryName(scenario.categoryId)} · {scenario.ruleTested}
                    </div>
                  </div>
                  <span className={styles.chevron}>
                    <Icon name="chevron-right" size={18} />
                  </span>
                </div>

                <div className={styles.tags}>
                  <Pill tone="primary">{KIND_LABEL[scenario.kind]}</Pill>
                  {(scenario.variants?.length ?? 0) > 0 && (
                    <Pill tone="outline" icon="sparkle">
                      {scenario.variants?.length} varianter
                    </Pill>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
