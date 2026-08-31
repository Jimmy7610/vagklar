import { useRef, useState } from 'react';
import page from '@/features/shared/Page.module.css';
import { Button } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Modal } from '@/ui/components/Modal';
import {
  Callout,
  SectionHeading,
  SegmentedControl,
  Switch,
} from '@/ui/components/Primitives';
import { useLearner, useLearnerActions, useLearnerState } from '@/app/state/useLearner';
import { useUi } from '@/app/state/UiProvider';
import { backupFilename, createBackup, parseBackup, serialiseBackup } from '@/storage/backup';
import type { ImportSummary } from '@/storage/backup';
import { APP_VERSION } from '@/domain/constants';

const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Ljust', icon: 'sun' as const },
  { value: 'dark' as const, label: 'Mörkt', icon: 'moon' as const },
  { value: 'system' as const, label: 'System', icon: 'monitor' as const },
];

const MOTION_OPTIONS = [
  { value: 'system' as const, label: 'System' },
  { value: 'full' as const, label: 'Full' },
  { value: 'reduced' as const, label: 'Reducerad' },
];

const TEXT_OPTIONS = [
  { value: '1' as const, label: 'Normal' },
  { value: '1.125' as const, label: 'Stor' },
  { value: '1.25' as const, label: 'Störst' },
];

const CONFIDENCE_OPTIONS = [
  { value: 'smart' as const, label: 'Smart' },
  { value: 'always' as const, label: 'Alltid' },
  { value: 'never' as const, label: 'Aldrig' },
];

/**
 * Settings.
 *
 * Appearance, accessibility and — most importantly — the learner's control
 * over their own data: export, import and reset.
 */
export default function SettingsPage() {
  const learner = useLearner();
  const { mode } = useLearnerState();
  const actions = useLearnerActions();
  const { toast } = useUi();
  const fileInput = useRef<HTMLInputElement>(null);

  const [resetOpen, setResetOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetting, setResetting] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    summary: ImportSummary;
    apply: () => Promise<void>;
  } | null>(null);

  const preferences = learner.preferences;

  /* ---- Export -------------------------------------------------------- */
  const exportProgress = () => {
    try {
      const backup = createBackup(learner, Date.now());
      const blob = new Blob([serialiseBackup(backup)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = backupFilename(Date.now());
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      // Revoke on the next tick so the download has definitely started.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('Säkerhetskopian laddades ner.', { tone: 'success', icon: 'download' });
    } catch {
      toast('Kunde inte skapa säkerhetskopian.', { tone: 'danger' });
    }
  };

  /* ---- Import -------------------------------------------------------- */
  const handleFile = async (file: File) => {
    const text = await file.text();
    const result = parseBackup(text, Date.now());

    if (!result.ok) {
      toast(result.error, { tone: 'danger', duration: 6000 });
      return;
    }

    setImportPreview({
      summary: result.summary,
      apply: async () => {
        await actions.importData(result.data);
        toast('Utvecklingen är återställd från säkerhetskopian.', {
          tone: 'success',
          icon: 'check-circle',
        });
      },
    });
  };

  /* ---- Reset --------------------------------------------------------- */
  const performReset = async () => {
    setResetting(true);
    try {
      await actions.reset();
      toast('All utveckling är raderad.', { tone: 'neutral', icon: 'trash' });
      setResetOpen(false);
      setResetConfirmText('');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Inställningar</h1>
      </header>

      {mode === 'memory' && (
        <Callout tone="warning">
          Din webbläsare tillåter inte lokal lagring just nu. Utvecklingen finns kvar under den här
          sessionen men sparas inte till nästa besök.
        </Callout>
      )}

      {/* ---- Appearance ------------------------------------------------- */}
      <section aria-labelledby="appearance-heading">
        <SectionHeading title="Utseende" id="appearance-heading" />
        <div className={page.panel} style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <div>
            <div className={page.rowTitle} style={{ marginBottom: 'var(--space-2)' }}>
              Tema
            </div>
            <SegmentedControl
              options={THEME_OPTIONS}
              value={preferences.theme}
              onChange={(theme) => actions.setPreferences({ theme })}
              ariaLabel="Välj tema"
            />
          </div>

          <div>
            <div className={page.rowTitle} style={{ marginBottom: 'var(--space-2)' }}>
              Textstorlek
            </div>
            <SegmentedControl
              options={TEXT_OPTIONS}
              value={String(preferences.textScale) as '1' | '1.125' | '1.25'}
              onChange={(value) =>
                actions.setPreferences({ textScale: Number(value) as 1 | 1.125 | 1.25 })
              }
              ariaLabel="Välj textstorlek"
            />
            <p className={page.mutedNote} style={{ marginTop: 'var(--space-2)' }}>
              Webbläsarens egen zoom fungerar också — layouten är byggd för att tåla den.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Accessibility ---------------------------------------------- */}
      <section aria-labelledby="a11y-heading">
        <SectionHeading title="Tillgänglighet" id="a11y-heading" />
        <div className={page.panel} style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <div>
            <div className={page.rowTitle} style={{ marginBottom: 'var(--space-2)' }}>
              Rörelse
            </div>
            <SegmentedControl
              options={MOTION_OPTIONS}
              value={preferences.motion}
              onChange={(motion) => actions.setPreferences({ motion })}
              ariaLabel="Välj rörelsenivå"
            />
            <p className={page.mutedNote} style={{ marginTop: 'var(--space-2)' }}>
              Med reducerad rörelse sker övergångar direkt. Ingen information går förlorad.
            </p>
          </div>

          <Switch
            id="response-time"
            checked={preferences.useResponseTimeSignal}
            onChange={(useResponseTimeSignal) => actions.setPreferences({ useResponseTimeSignal })}
            label="Låt svarstid påverka bedömningen"
            hint="Svarstid används bara som en svag signal. Stäng av den om du läser i egen takt eller använder hjälpmedel."
          />

          <Switch
            id="calm-timer"
            checked={preferences.calmExamTimer}
            onChange={(calmExamTimer) => actions.setPreferences({ calmExamTimer })}
            label="Lugn provklocka"
            hint="Visar återstående tid som en stapel i stället för siffror."
          />
        </div>
      </section>

      {/* ---- Training --------------------------------------------------- */}
      <section aria-labelledby="training-heading">
        <SectionHeading title="Träning" id="training-heading" />
        <div className={page.panel} style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <div>
            <div className={page.rowTitle} style={{ marginBottom: 'var(--space-2)' }}>
              Fråga om säkerhet
            </div>
            <SegmentedControl
              options={CONFIDENCE_OPTIONS}
              value={preferences.confidencePrompt}
              onChange={(confidencePrompt) => actions.setPreferences({ confidencePrompt })}
              ariaLabel="När ska säkerhet efterfrågas"
            />
            <p className={page.mutedNote} style={{ marginTop: 'var(--space-2)' }}>
              Smart läge frågar bara när svaret säger något extra — efter ett fel, eller när ett rätt
              svar tog ovanligt lång tid.
            </p>
          </div>

          <Switch
            id="haptics"
            checked={preferences.haptics}
            onChange={(haptics) => actions.setPreferences({ haptics })}
            label="Vibration"
            hint="Diskret återkoppling på enheter som stöder det."
          />

          <Switch
            id="sound"
            checked={preferences.sound}
            onChange={(sound) => actions.setPreferences({ sound })}
            label="Ljud"
            hint="Avstängt som standard. Vägklar fungerar helt utan ljud."
          />
        </div>
      </section>

      {/* ---- Data ------------------------------------------------------- */}
      <section aria-labelledby="data-heading">
        <SectionHeading title="Din data" id="data-heading" />
        <div className={page.panel} style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
            All utveckling ligger lokalt i den här webbläsaren. Exportera en säkerhetskopia om du
            byter enhet eller rensar webbläsardata.
          </p>

          <div className={page.actions}>
            <Button icon="download" onClick={exportProgress} variant="secondary">
              Exportera utveckling
            </Button>
            <Button icon="upload" variant="secondary" onClick={() => fileInput.current?.click()}>
              Importera utveckling
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="visually-hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
                event.target.value = '';
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'var(--space-3)',
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span>{learner.answers.length} svar</span>
            <span>{Object.keys(learner.mastery).length} områden</span>
            <span>{learner.exams.length} prov</span>
            <span>{learner.sessions.length} pass</span>
          </div>
        </div>
      </section>

      {/* ---- Danger zone ------------------------------------------------ */}
      <section aria-labelledby="reset-heading">
        <SectionHeading title="Återställ" id="reset-heading" level={3} />
        <div className={page.panel}>
          <p
            style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Raderar all utveckling på den här enheten: svar, behärskning, prov, misstag och
            inställningar. Det går inte att ångra.
          </p>
          <Button variant="dangerGhost" icon="trash" onClick={() => setResetOpen(true)}>
            Radera all utveckling
          </Button>
        </div>
      </section>

      <p className={page.mutedNote}>Vägklar {APP_VERSION}</p>

      {/* ---- Import preview --------------------------------------------- */}
      <Modal
        open={importPreview !== null}
        onClose={() => setImportPreview(null)}
        title="Importera säkerhetskopia?"
        description="Din nuvarande utveckling ersätts helt av innehållet i filen."
        footer={
          <>
            <Button variant="secondary" onClick={() => setImportPreview(null)}>
              Avbryt
            </Button>
            <Button
              onClick={async () => {
                const preview = importPreview;
                setImportPreview(null);
                await preview?.apply();
              }}
              data-autofocus
            >
              Ersätt min utveckling
            </Button>
          </>
        }
      >
        {importPreview && (
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <Callout tone="warning">
              Detta ersätter allt du har på den här enheten. Exportera först om du vill kunna gå
              tillbaka.
            </Callout>

            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 'var(--space-2) var(--space-5)',
                fontSize: 'var(--text-small)',
              }}
            >
              <dt style={{ color: 'var(--color-text-secondary)' }}>Svar</dt>
              <dd>{importPreview.summary.answers}</dd>
              <dt style={{ color: 'var(--color-text-secondary)' }}>Områden med behärskning</dt>
              <dd>{importPreview.summary.subcategoriesWithMastery}</dd>
              <dt style={{ color: 'var(--color-text-secondary)' }}>Pass</dt>
              <dd>{importPreview.summary.sessions}</dd>
              <dt style={{ color: 'var(--color-text-secondary)' }}>Prov</dt>
              <dd>{importPreview.summary.exams}</dd>
              <dt style={{ color: 'var(--color-text-secondary)' }}>Lektioner</dt>
              <dd>{importPreview.summary.lessons}</dd>
              {importPreview.summary.exportedAt && (
                <>
                  <dt style={{ color: 'var(--color-text-secondary)' }}>Exporterad</dt>
                  <dd>
                    {new Date(importPreview.summary.exportedAt).toLocaleString('sv-SE', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </dd>
                </>
              )}
              {importPreview.summary.appVersion && (
                <>
                  <dt style={{ color: 'var(--color-text-secondary)' }}>Från version</dt>
                  <dd>{importPreview.summary.appVersion}</dd>
                </>
              )}
            </dl>

            {importPreview.summary.migratedFrom !== null && (
              <Callout tone="info">
                Filen kommer från ett äldre dataschema (v{importPreview.summary.migratedFrom}) och
                uppgraderas automatiskt vid import.
              </Callout>
            )}

            {importPreview.summary.skipped > 0 && (
              <Callout tone="warning">
                {importPreview.summary.skipped} poster i filen kunde inte läsas och hoppas över.
              </Callout>
            )}
          </div>
        )}
      </Modal>

      {/* ---- Reset confirmation ------------------------------------------ */}
      <Modal
        open={resetOpen}
        onClose={() => {
          setResetOpen(false);
          setResetConfirmText('');
        }}
        title="Radera all utveckling?"
        description="Det här går inte att ångra."
        dismissible={!resetting}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setResetOpen(false);
                setResetConfirmText('');
              }}
              disabled={resetting}
            >
              Avbryt
            </Button>
            <Button
              variant="danger"
              onClick={performReset}
              disabled={resetConfirmText.trim().toUpperCase() !== 'RADERA'}
              loading={resetting}
            >
              Radera allt
            </Button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Callout tone="danger">
            {learner.answers.length} svar, {Object.keys(learner.mastery).length} områden och{' '}
            {learner.exams.length} prov raderas permanent.
          </Callout>

          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Icon name="info" size={17} />
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
              Vill du kunna gå tillbaka? Exportera en säkerhetskopia först.
            </span>
          </div>

          <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-small)', fontWeight: 500 }}>
              Skriv RADERA för att bekräfta
            </span>
            <input
              type="text"
              value={resetConfirmText}
              onChange={(event) => setResetConfirmText(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              style={{
                minHeight: 44,
                padding: '0 var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-strong)',
                background: 'var(--color-surface)',
                fontSize: 'var(--text-body)',
              }}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}
