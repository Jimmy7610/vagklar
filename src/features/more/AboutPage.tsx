import page from '@/features/shared/Page.module.css';
import { ButtonLink } from '@/ui/components/Button';
import { Callout, SectionHeading, Stat } from '@/ui/components/Primitives';
import { Wordmark } from '@/ui/brand/Logo';
import { APP_VERSION, DISCLAIMER, EXAM, SCHEMA_VERSION } from '@/domain/constants';
import { bankStats } from '@/domain/content/bank';
import { LESSONS } from '@/content/lessons';
import { SCENARIOS } from '@/content/scenarios';
import { CATEGORIES } from '@/content/taxonomy';
import { useLearnerState } from '@/app/state/useLearner';

/**
 * About, privacy and content provenance.
 *
 * Everything a learner might reasonably want to check before trusting the app
 * with their study time — including what we do *not* claim.
 */
export default function AboutPage() {
  const { mode } = useLearnerState();
  const stats = bankStats();

  return (
    <div className={page.page}>
      <header className={page.header}>
        <Wordmark size={30} />
        <h1 className={page.title}>Om Vägklar</h1>
        <p className={page.lead}>
          En fristående träningsprodukt för teorin till svenskt B-körkort. Vägklar är byggd för att
          lära ut förståelse för trafiken — inte utantillkunskap om enskilda frågor.
        </p>
      </header>

      <section aria-labelledby="content-heading">
        <SectionHeading title="Innehållet" id="content-heading" />
        <div className={page.panel}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-5)',
            }}
          >
            <Stat value={stats.total} label="Frågor" size="1.75rem" />
            <Stat value={CATEGORIES.length} label="Kunskapsområden" size="1.75rem" />
            <Stat value={LESSONS.length} label="Lektioner" size="1.75rem" />
            <Stat value={SCENARIOS.length} label="Scenarier" size="1.75rem" />
          </div>

          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
            Samtliga frågor är skrivna för Vägklar. De tränar samma kunskapsområden och samma typ av
            resonemang som kunskapsprovet kräver, men Vägklar innehåller inga officiella provfrågor
            och gör inte anspråk på att göra det.
          </p>
        </div>

        <Callout tone="neutral" icon="info">
          Innehållet är granskat internt men ännu inte slutgiltigt verifierat av en sakkunnig. Varje
          fråga bär källhänvisningar och en granskningsstatus, så att innehållet kan kontrolleras
          och uppdateras när regler ändras.
        </Callout>
      </section>

      <section aria-labelledby="privacy-heading" id="integritet">
        <SectionHeading title="Integritet och data" id="privacy-heading" />
        <div className={page.panel}>
          <ul style={{ display: 'grid', gap: 'var(--space-3)', fontSize: 'var(--text-small)' }}>
            <li>Det finns ingen inloggning och inget konto.</li>
            <li>
              All din utveckling sparas lokalt i den här webbläsaren, i webbläsarens egen databas
              (IndexedDB). Ingenting skickas till någon server.
            </li>
            <li>
              En annan enhet eller en annan webbläsare får en egen, tom profil. Det är avsiktligt i
              den här versionen.
            </li>
            <li>
              Rensar du webbplatsdata, kör i privat läge eller använder en annan profil försvinner
              utvecklingen. Därför finns exportfunktionen.
            </li>
            <li>
              Du kan när som helst exportera en säkerhetskopia, läsa in den igen eller radera allt.
            </li>
          </ul>

          <p className={page.mutedNote} style={{ marginTop: 'var(--space-4)' }}>
            Vi kan inte lova absolut integritet i teknisk mening — din webbläsare, ditt operativsystem
            och eventuella tillägg ligger utanför vår kontroll. Det vi kan säga är att Vägklar
            varken samlar in eller skickar någon data om dig.
          </p>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <ButtonLink to="/installningar" variant="soft">
              Exportera eller radera min data
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="exam-heading">
        <SectionHeading title="Om provsimuleringen" id="exam-heading" />
        <div className={page.panel}>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
            Simuleringen följer kunskapsprovets struktur: {EXAM.totalQuestions} frågor på{' '}
            {EXAM.durationMinutes} minuter, där {EXAM.unscoredQuestions} frågor inte räknas in och{' '}
            {EXAM.passThreshold} av {EXAM.scoredQuestions} poäng krävs för godkänt.
          </p>
          <p
            style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--space-3)',
            }}
          >
            Vi vet ingenting om vilka frågor som är oräknade i det riktiga provet. I Vägklar väljs de
            fem deterministiskt utifrån provets startvärde och redovisas öppet efter inlämning.
          </p>
        </div>
      </section>

      <section aria-labelledby="tech-heading">
        <SectionHeading title="Teknik" id="tech-heading" level={3} />
        <div className={page.panel}>
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 'var(--space-2) var(--space-5)',
              fontSize: 'var(--text-small)',
            }}
          >
            <dt style={{ color: 'var(--color-text-secondary)' }}>Version</dt>
            <dd>{APP_VERSION}</dd>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Dataschema</dt>
            <dd>v{SCHEMA_VERSION}</dd>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Lagring</dt>
            <dd>{mode === 'indexeddb' ? 'IndexedDB (sparas mellan besök)' : 'Endast minnet'}</dd>
          </dl>
        </div>
      </section>

      <Callout tone="neutral">{DISCLAIMER}</Callout>
    </div>
  );
}
