import page from '@/features/shared/Page.module.css';
import { ButtonLink } from '@/ui/components/Button';
import { Callout, Pill, SectionHeading, Stat } from '@/ui/components/Primitives';
import { Wordmark } from '@/ui/brand/Logo';
import { APP_VERSION, EXAM, SCHEMA_VERSION } from '@/domain/constants';
import { RIGHTS, getSource } from '@/content/sources';
import { bankStats } from '@/domain/content/bank';
import { LESSONS } from '@/content/lessons';
import { SCENARIOS } from '@/content/scenarios';
import { CATEGORIES } from '@/content/taxonomy';
import { CURRICULUM_CHAPTERS, CURRICULUM_CONCEPTS } from '@/content/curriculum/curriculum';
import { useLearnerState } from '@/app/state/useLearner';

/**
 * About, privacy and provenance.
 *
 * Everything a learner might reasonably want to check before trusting the app
 * with their study time — including what Vägklar does *not* claim. The version
 * is read from one constant rather than restated per page.
 */
export default function AboutPage() {
  const { mode } = useLearnerState();
  const stats = bankStats();
  const primary = getSource('teoribok-2026-1');

  return (
    <div className={page.page}>
      <header className={page.header}>
        <Wordmark size={30} />
        <h1 className={page.title}>Om Vägklar</h1>
        <p className={page.lead}>
          Adaptiv teoriutbildning för svenskt B-körkort. Byggd för att lära ut förståelse för
          trafiken — inte utantillkunskap om enskilda frågor.
        </p>
      </header>

      {/* ---- How it works ------------------------------------------------ */}
      <section aria-labelledby="how-heading">
        <SectionHeading title="Så fungerar det" id="how-heading" />
        <div className={page.grid2}>
          <div className={page.panel}>
            <h3 className={page.panelTitle}>Anpassad träning</h3>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
              Varje svar väger in om du hade rätt, hur säker du var och hur svår frågan var. Vägklar
              följer din behärskning per delområde och bygger nästa pass utifrån den.
            </p>
          </div>
          <div className={page.panel}>
            <h3 className={page.panelTitle}>Repetition i rätt tid</h3>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
              Frågor återkommer precis innan du hinner glömma dem — helst som en annan fråga om
              samma regel, så att du tränar regeln och inte svarsalternativet.
            </p>
          </div>
          <div className={page.panel}>
            <h3 className={page.panelTitle}>Provsimulering</h3>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
              {EXAM.totalQuestions} frågor på {EXAM.durationMinutes} minuter, där{' '}
              {EXAM.unscoredQuestions} inte räknas och {EXAM.passThreshold} av {EXAM.scoredQuestions}{' '}
              krävs för godkänt. Tiden fortsätter även om du lämnar sidan.
            </p>
          </div>
          <div className={page.panel}>
            <h3 className={page.panelTitle}>Scenariolabb</h3>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
              Väjningsregler sedda uppifrån. Lös ordningen, spela upp förloppet och se hur svaret
              ändras när en förutsättning ändras.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Content ----------------------------------------------------- */}
      <section aria-labelledby="content-heading">
        <SectionHeading title="Innehållet" id="content-heading" />
        <div className={page.panel}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-5)',
            }}
          >
            <Stat value={stats.total} label="Frågor" size="1.75rem" />
            <Stat value={CATEGORIES.length} label="Kunskapsområden" size="1.75rem" />
            <Stat value={LESSONS.length} label="Lektioner" size="1.75rem" />
            <Stat value={SCENARIOS.length} label="Scenarier" size="1.75rem" />
            <Stat value={CURRICULUM_CONCEPTS.length} label="Kursplansbegrepp" size="1.75rem" />
          </div>

          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
            Samtliga frågor är skrivna för Vägklar. De tränar samma kunskapsområden och samma typ av
            resonemang som kunskapsprovet kräver, men Vägklar innehåller inga officiella provfrågor
            och gör inte anspråk på att göra det.
          </p>
        </div>
      </section>

      {/* ---- Source quality ---------------------------------------------- */}
      <section aria-labelledby="source-heading">
        <SectionHeading title="Källor och kvalitet" id="source-heading" />
        <div className={page.panel} style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Vägklars kursplan är strukturerad efter{' '}
            {primary ? <strong>{primary.title}</strong> : 'utvald teorilitteratur'}
            {primary?.edition ? ` (utgåva ${primary.edition})` : ''}, som används med tillstånd.
            Kursplanen omfattar {CURRICULUM_CHAPTERS.length} kapitel och{' '}
            {CURRICULUM_CONCEPTS.length} begrepp, och varje begrepp är kopplat till de sidor i källan
            som behandlar det.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Pill tone="success">Källkopplad kursplan</Pill>
            <Pill tone="warning" icon="info">
              Sakgranskning pågår
            </Pill>
          </div>

          <Callout tone="neutral" icon="info">
            Innehållet är internt granskat men ännu inte slutgiltigt verifierat av en sakkunnig.
            Varje fråga bär källhänvisningar och en granskningsstatus, så innehållet kan kontrolleras
            och uppdateras när regler ändras.
          </Callout>

          <ButtonLink to="/kallor" variant="soft">
            Källor & rättigheter
          </ButtonLink>
        </div>
      </section>

      {/* ---- Privacy ------------------------------------------------------ */}
      <section aria-labelledby="privacy-heading" id="integritet">
        <SectionHeading title="Lokalt först" id="privacy-heading" />
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
              Vägklar innehåller ingen analys, inga cookies för spårning och inga externa
              anrop.
            </li>
          </ul>

          <p className={page.mutedNote} style={{ marginTop: 'var(--space-4)' }}>
            Vi kan inte lova absolut integritet i teknisk mening — din webbläsare, ditt
            operativsystem och eventuella tillägg ligger utanför vår kontroll. Det vi kan säga är
            att Vägklar varken samlar in eller skickar någon data om dig.
          </p>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <ButtonLink to="/installningar" variant="soft">
              Exportera eller radera min data
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---- Rights ------------------------------------------------------- */}
      <section aria-labelledby="rights-heading">
        <SectionHeading title="Rättigheter" id="rights-heading" level={3} />
        <div className={page.panel} style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <p style={{ fontSize: 'var(--text-small)', margin: 0 }}>{RIGHTS.developedBy}</p>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
            {RIGHTS.ownWork}
          </p>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
            {RIGHTS.thirdParty}
          </p>
          <p className={page.mutedNote}>{RIGHTS.copyright}</p>
        </div>
      </section>

      {/* ---- Technical ---------------------------------------------------- */}
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
            <dd style={{ margin: 0 }}>{APP_VERSION}</dd>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Dataschema</dt>
            <dd style={{ margin: 0 }}>v{SCHEMA_VERSION}</dd>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Lagring</dt>
            <dd style={{ margin: 0 }}>
              {mode === 'indexeddb' ? 'IndexedDB (sparas mellan besök)' : 'Endast minnet'}
            </dd>
          </dl>
        </div>
      </section>

      <Callout tone="neutral">{RIGHTS.disclaimer}</Callout>
    </div>
  );
}
