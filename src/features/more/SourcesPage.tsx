import page from '@/features/shared/Page.module.css';
import { Callout, Pill, SectionHeading } from '@/ui/components/Primitives';
import { ButtonLink } from '@/ui/components/Button';
import { RIGHTS, SOURCES } from '@/content/sources';
import type { PermissionStatus, SourceEntry } from '@/content/sources';
import { CURRICULUM_CHAPTERS } from '@/content/curriculum/curriculum';
import { APP_VERSION } from '@/domain/constants';

const PERMISSION_LABEL: Record<PermissionStatus, string> = {
  granted: 'Används med tillstånd',
  'public-legal': 'Offentlig författningstext',
  'own-work': 'Vägklars eget material',
};

const PERMISSION_TONE: Record<PermissionStatus, 'success' | 'info' | 'primary'> = {
  granted: 'success',
  'public-legal': 'info',
  'own-work': 'primary',
};

function SourceCard({ source }: { source: SourceEntry }) {
  const chapters = source.id === 'teoribok-2026-1' ? CURRICULUM_CHAPTERS.length : 0;

  return (
    <article className={page.panel}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-3)',
        }}
      >
        <h3 className={page.panelTitle} style={{ margin: 0 }}>
          {source.title}
        </h3>
        <Pill tone={PERMISSION_TONE[source.permission]}>{PERMISSION_LABEL[source.permission]}</Pill>
      </div>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          gap: 'var(--space-2) var(--space-5)',
          fontSize: 'var(--text-small)',
          margin: 0,
        }}
      >
        {source.publisher && (
          <>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Utgivare</dt>
            <dd style={{ margin: 0 }}>{source.publisher}</dd>
          </>
        )}
        {source.rightsHolder && (
          <>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Rättighetshavare</dt>
            <dd style={{ margin: 0 }}>{source.rightsHolder}</dd>
          </>
        )}
        {source.edition && (
          <>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Utgåva</dt>
            <dd style={{ margin: 0 }}>{source.edition}</dd>
          </>
        )}
        {source.publishedAt && (
          <>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Publicerad</dt>
            <dd style={{ margin: 0 }}>{source.publishedAt}</dd>
          </>
        )}
        {source.isbn && (
          <>
            <dt style={{ color: 'var(--color-text-secondary)' }}>ISBN</dt>
            <dd style={{ margin: 0 }}>{source.isbn}</dd>
          </>
        )}
        {source.pageCount && (
          <>
            <dt style={{ color: 'var(--color-text-secondary)' }}>Omfattning</dt>
            <dd style={{ margin: 0 }}>
              {source.pageCount} sidor
              {chapters > 0 ? `, ${chapters} kapitel kartlagda i Vägklars kursplan` : ''}
            </dd>
          </>
        )}
      </dl>

      <p className={page.mutedNote} style={{ marginTop: 'var(--space-4)' }}>
        {source.attribution}
      </p>
    </article>
  );
}

/**
 * Sources and rights.
 *
 * States plainly who owns what: Vägklar's own work, third-party material used
 * with permission, and public legal texts that nobody claims. Deliberately
 * free of legal claims beyond those three facts.
 */
export default function SourcesPage() {
  const books = SOURCES.filter((s) => s.kind === 'book');
  const regulations = SOURCES.filter((s) => s.kind === 'regulation');
  const own = SOURCES.filter((s) => s.permission === 'own-work');

  return (
    <div className={page.page} id="kallor">
      <header className={page.header}>
        <h1 className={page.title}>Källor & rättigheter</h1>
        <p className={page.lead}>
          Vilka källor Vägklar bygger på, vem som äger vad, och vad Vägklar inte gör anspråk på.
        </p>
      </header>

      {/* ---- Rights summary --------------------------------------------- */}
      <section aria-labelledby="rights-heading">
        <SectionHeading title="Rättigheter" id="rights-heading" />
        <div className={page.panel} style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-body)', margin: 0 }}>{RIGHTS.developedBy}</p>

          <ul style={{ display: 'grid', gap: 'var(--space-3)', fontSize: 'var(--text-small)' }}>
            <li>{RIGHTS.ownWork}</li>
            <li>{RIGHTS.thirdParty}</li>
            <li>{RIGHTS.publicLaw}</li>
          </ul>

          <Callout tone="neutral">{RIGHTS.disclaimer}</Callout>

          <p className={page.mutedNote}>{RIGHTS.copyright}</p>
        </div>
      </section>

      {/* ---- Books ------------------------------------------------------- */}
      <section aria-labelledby="books-heading">
        <SectionHeading
          title="Teori- och referenslitteratur"
          id="books-heading"
          overline="Används med tillstånd"
        />
        <div className={page.stack}>
          {books.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-4)' }}>
          <Callout tone="info" icon="info">
            Källmaterialet används som kursplan och faktakontroll. Vägklar återger inte boken:
            innehållet omarbetas till appens egna lektioner, frågor och vektorillustrationer, och
            källdokumentet distribueras aldrig genom appen.
          </Callout>
        </div>
      </section>

      {/* ---- Regulations -------------------------------------------------- */}
      <section aria-labelledby="law-heading">
        <SectionHeading title="Författningar" id="law-heading" overline="Offentlig text" />
        <div className={page.rows}>
          {regulations.map((source) => (
            <div className={page.row} key={source.id}>
              <span className={page.rowIcon}>§</span>
              <span>
                <span className={page.rowTitle}>{source.title}</span>
                <span className={page.rowMeta}>{source.publisher}</span>
              </span>
              <Pill tone="info">Offentlig</Pill>
            </div>
          ))}
        </div>
        <p className={page.mutedNote} style={{ marginTop: 'var(--space-3)' }}>
          {RIGHTS.publicLaw}
        </p>
      </section>

      {/* ---- Own work ------------------------------------------------------ */}
      <section aria-labelledby="own-heading">
        <SectionHeading title="Vägklars eget material" id="own-heading" />
        <div className={page.panel}>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Programvaran, designsystemet, ikonuppsättningen, vägmärkes- och scenariografiken samt
            alla frågor och lektionstexter är skrivna och ritade för Vägklar.
          </p>
          {own.map((source) => (
            <p className={page.mutedNote} key={source.id} style={{ marginTop: 'var(--space-3)' }}>
              {source.attribution}
            </p>
          ))}
        </div>
      </section>

      <div className={page.actions}>
        <ButtonLink to="/om" variant="secondary">
          Om Vägklar
        </ButtonLink>
        <ButtonLink to="/installningar" variant="secondary">
          Din data
        </ButtonLink>
      </div>

      <p className={page.mutedNote}>Vägklar {APP_VERSION}</p>
    </div>
  );
}
