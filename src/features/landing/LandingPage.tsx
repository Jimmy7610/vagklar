import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { HeroVisual } from './HeroVisual';
import { Wordmark } from '@/ui/brand/Logo';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import type { IconName } from '@/ui/icons/Icon';
import { masteryColor } from '@/ui/components/ProgressRing';
import { ScenarioStage } from '@/ui/illustrations/ScenarioStage';
import { APP_VERSION, EXAM } from '@/domain/constants';
import { RIGHTS } from '@/content/sources';
import { bankStats } from '@/domain/content/bank';
import { CATEGORIES } from '@/content/taxonomy';
import { SCENARIOS } from '@/content/scenarios';
import { useHasProgress } from '@/app/state/useLearner';
import { useThemeToggle } from '@/features/landing/useThemeToggle';

/**
 * The landing page.
 *
 * Everything visual here is built from the product's own components and
 * tokens, so walking from this page into the app is continuous rather than a
 * jump from "marketing site" to "dashboard template".
 */

/* ---- A single restrained reveal on scroll ------------------------------- */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Environments without IntersectionObserver (older browsers, tests) show the
  // content immediately rather than never.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[styles.reveal, visible ? styles.revealVisible : ''].filter(Boolean).join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  overline,
  title,
  lead,
  centered,
}: {
  overline: string;
  title: string;
  lead?: string;
  centered?: boolean;
}) {
  return (
    <header
      className={[styles.sectionHeader, centered ? styles.sectionHeaderCentered : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.overline}>{overline}</div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {lead && <p className={styles.sectionLead}>{lead}</p>}
    </header>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.feature}>
      <div className={styles.featureIcon}>
        <Icon name={icon} size={21} />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureBody}>{children}</p>
    </div>
  );
}

/* Illustrative sample data, clearly labelled as an example wherever shown. */
const SAMPLE_MAP = [
  { name: 'Vägmärken', sub: '5 delområden', value: 91 },
  { name: 'Korsningar och väjningsregler', sub: 'Utfartsregeln ligger efter', value: 68 },
  { name: 'Mörker', sub: '3 delområden', value: 72 },
  { name: 'Halka och väder', sub: 'Nyligen påbörjat', value: 44 },
];

const SAMPLE_MISTAKES = [
  {
    count: 4,
    label: 'Utfartsregeln vs högerregeln',
    hint: 'Du använder högerregeln även när du kommer från en parkering.',
  },
  {
    count: 3,
    label: 'Reaktionssträcka vs bromssträcka',
    hint: 'De två sträckorna blandas ihop i beräkningsfrågor.',
  },
  {
    count: 2,
    label: 'Stannande vs parkering',
    hint: 'Parkeringsförbud tolkas som att du inte får stanna alls.',
  },
];

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const hasProgress = useHasProgress();
  const { resolved, toggle } = useThemeToggle();
  const stats = bankStats();
  const scenario = SCENARIOS[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const primaryCtaLabel = hasProgress ? 'Fortsätt där du slutade' : 'Börja träna';

  return (
    <div className={styles.page}>
      {/* ---- Navigation ------------------------------------------------- */}
      <header className={[styles.nav, scrolled ? styles.navScrolled : ''].filter(Boolean).join(' ')}>
        <div className={[styles.shell, styles.navInner].join(' ')}>
          <Link to="/" aria-label="Vägklar, till startsidan">
            <Wordmark />
          </Link>

          <nav className={styles.navLinks} aria-label="Sidnavigering">
            <a className={styles.navLink} href="#hur-det-fungerar">
              Så fungerar det
            </a>
            <a className={styles.navLink} href="#kunskapskarta">
              Kunskapskarta
            </a>
            <a className={styles.navLink} href="#provsimulering">
              Provsimulering
            </a>
            <a className={styles.navLink} href="#integritet">
              Integritet
            </a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              aria-label={resolved === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
              icon={resolved === 'dark' ? 'sun' : 'moon'}
            />
            <ButtonLink to="/hem" size="sm">
              {primaryCtaLabel}
            </ButtonLink>
          </div>
        </div>
      </header>

      <main id="huvudinnehall">
        {/* ---- Hero ----------------------------------------------------- */}
        <section className={styles.hero}>
          <div className={styles.heroBackdrop} aria-hidden="true" />
          <div className={[styles.shell, styles.heroGrid].join(' ')}>
            <div>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowDot}>
                  <Icon name="sparkle" size={11} />
                </span>
                Adaptiv teoriträning för B-körkort
              </div>

              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleLine}>Lär dig teorin.</span>
                <span className={styles.heroTitleLine}>Förstå trafiken.</span>
                <span className={[styles.heroTitleLine, styles.heroTitleMuted].join(' ')}>
                  Klara provet.
                </span>
              </h1>

              <p className={styles.heroLead}>
                Vägklar lär sig vad du kan, hittar dina svaga områden och bygger nästa träningspass
                åt dig. Du tränar det du faktiskt behöver — inte samma frågor om och om igen.
              </p>

              <div className={styles.heroActions}>
                <ButtonLink to="/hem" size="lg" iconAfter="arrow-right">
                  {primaryCtaLabel}
                </ButtonLink>
                <ButtonLink to="/hem" size="lg" variant="secondary" state={{ tour: true }}>
                  Se hur Vägklar fungerar
                </ButtonLink>
              </div>

              <p className={styles.trustLine}>
                <span className={styles.trustIcon}>
                  <Icon name="shield" size={17} />
                </span>
                Inget konto. Din utveckling sparas på din enhet.
              </p>
            </div>

            <HeroVisual />
          </div>
        </section>

        {/* ---- Personal learning engine --------------------------------- */}
        <section className={[styles.section, styles.sectionAlt].join(' ')} id="hur-det-fungerar">
          <div className={styles.shell}>
            <Reveal>
              <SectionHeader
                overline="Personlig inlärningsmotor"
                title="Träna på det du faktiskt behöver."
                lead="Varje svar säger något. Vägklar väger in om du hade rätt, hur säker du var, hur svår frågan var och hur länge sedan du såg den — och räknar om vad du behöver träna härnäst."
              />
            </Reveal>

            <Reveal delay={60}>
              <div className={styles.featureGrid}>
                <Feature icon="target" title="Svaga områden först">
                  Motorn följer din behärskning på delområdesnivå, inte bara per kategori. Den vet
                  skillnad på att du är svag på korsningar och att du är svag på just utfartsregeln.
                </Feature>
                <Feature icon="lightbulb" title="Säkerhet räknas">
                  Ett rätt svar du gissade dig till väger mycket mindre än ett du var säker på. Det
                  gör att kunskapsbilden speglar vad du verkligen kan.
                </Feature>
                <Feature icon="refresh" title="Repetition i rätt tid">
                  Frågor kommer tillbaka precis innan du hinner glömma dem — och helst som en annan
                  fråga om samma regel, så att du tränar regeln och inte svarsalternativet.
                </Feature>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- Knowledge map -------------------------------------------- */}
        <section className={styles.section} id="kunskapskarta">
          <div className={styles.shell}>
            <div className={styles.split}>
              <Reveal>
                <div>
                  <SectionHeader
                    overline="Kunskapskarta"
                    title="Se exakt var du står."
                    lead="Alla teoriområden på ett ställe, med behärskning per delområde. Tryck på ett svagt område så får du historik, vanliga misstag och en direkt väg in i träningen."
                  />
                  <ButtonLink to="/utveckling" variant="soft" iconAfter="arrow-right">
                    Öppna kunskapskartan
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className={styles.mapCard}>
                  {SAMPLE_MAP.map((row) => (
                    <div className={styles.mapRow} key={row.name}>
                      <div>
                        <div className={styles.mapRowName}>{row.name}</div>
                        <div className={styles.mapRowSub}>{row.sub}</div>
                      </div>
                      <div className={styles.mapRowValue} style={{ color: masteryColor(row.value) }}>
                        {row.value}%
                      </div>
                      <div className={styles.mapBar}>
                        <div
                          className={styles.mapBarFill}
                          style={{
                            width: `${row.value}%`,
                            backgroundColor: masteryColor(row.value),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className={styles.scenarioCaption}>Exempel på hur kartan kan se ut.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---- Training loop -------------------------------------------- */}
        <section className={[styles.section, styles.sectionAlt].join(' ')}>
          <div className={styles.shell}>
            <Reveal>
              <SectionHeader
                overline="Träningsloopen"
                title="Förstå, träna, repetera, behärska."
                lead="Samma fyra steg för varje regel du lär dig — och Vägklar håller reda på var i loopen du befinner dig för varje enskilt begrepp."
                centered
              />
            </Reveal>

            <Reveal delay={60}>
              <div className={styles.loop}>
                {[
                  {
                    title: 'Förstå',
                    body: 'Korta lektioner som förklarar regeln och varför den ser ut som den gör.',
                  },
                  {
                    title: 'Träna',
                    body: 'Frågor med direkt återkoppling och en förklaring som svarar på varför.',
                  },
                  {
                    title: 'Repetera',
                    body: 'Regeln kommer tillbaka i rätt intervall, gärna i en ny förpackning.',
                  },
                  {
                    title: 'Behärska',
                    body: 'När du svarar rätt säkert och snabbt över tid räknas området som stabilt.',
                  },
                ].map((step, index) => (
                  <div className={styles.loopStep} key={step.title}>
                    <div className={styles.loopNumber}>{index + 1}</div>
                    <h3 className={styles.loopTitle}>{step.title}</h3>
                    <p className={styles.loopBody}>{step.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- Exam simulation ------------------------------------------ */}
        <section className={styles.section} id="provsimulering">
          <div className={styles.shell}>
            <Reveal>
              <SectionHeader
                overline="Provsimulering"
                title="Öva under provets förutsättningar."
                lead="Samma struktur som kunskapsprovet för B-körkort: samma antal frågor, samma tid och samma godkäntgräns. Frågorna är Vägklars egna."
                centered
              />
            </Reveal>

            <Reveal delay={60}>
              <div className={styles.examStats}>
                <div className={styles.examStat}>
                  <div className={styles.examStatValue}>{EXAM.totalQuestions}</div>
                  <div className={styles.examStatLabel}>frågor</div>
                </div>
                <div className={styles.examStat}>
                  <div className={styles.examStatValue}>{EXAM.durationMinutes}</div>
                  <div className={styles.examStatLabel}>minuter</div>
                </div>
                <div className={styles.examStat}>
                  <div className={styles.examStatValue}>{EXAM.passThreshold}</div>
                  <div className={styles.examStatLabel}>
                    poäng av {EXAM.scoredQuestions} krävs
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className={styles.featureGrid}>
                <Feature icon="clock" title="Riktig tidspress">
                  Nedräkningen fortsätter även om du stänger fliken. Provet lämnas in automatiskt när
                  tiden är slut, precis som på riktigt.
                </Feature>
                <Feature icon="bookmark" title="Markera och återvänd">
                  Markera osäkra frågor, hoppa fram och tillbaka och se en överblick över vad som är
                  besvarat innan du lämnar in.
                </Feature>
                <Feature icon="progress" title="Analys efteråt">
                  Resultat per kunskapsområde, inte bara en siffra. Fem frågor räknas inte in, för
                  att efterlikna provets struktur — vilka det var får du veta efteråt.
                </Feature>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <p
                className={styles.sectionLead}
                style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-small)' }}
              >
                Vägklar innehåller inga officiella provfrågor. Alla {stats.total} frågor är skrivna
                för Vägklar och tränar samma kunskapsområden och resonemang som kunskapsprovet
                kräver.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---- Mistake intelligence ------------------------------------- */}
        <section className={[styles.section, styles.sectionAlt].join(' ')}>
          <div className={styles.shell}>
            <div className={[styles.split, styles.splitReverse].join(' ')}>
              <Reveal>
                <div className={styles.mistakeList}>
                  {SAMPLE_MISTAKES.map((mistake) => (
                    <div className={styles.mistakeItem} key={mistake.label}>
                      <span className={styles.mistakeCount}>{mistake.count}×</span>
                      <div>
                        <div className={styles.mistakeLabel}>{mistake.label}</div>
                        <div className={styles.mistakeHint}>{mistake.hint}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={70}>
                <div>
                  <SectionHeader
                    overline="Misstagsanalys"
                    title="Vägklar minns mönstret, inte bara felsvaret."
                    lead="Varje felaktigt svarsalternativ är märkt med den feltanke det avslöjar. Dina misstag grupperas därför efter tankefel — så att du kan träna bort orsaken i stället för att memorera enstaka frågor."
                  />
                  <ButtonLink to="/misstag" variant="soft" iconAfter="arrow-right">
                    Se hur det fungerar
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---- Scenario lab --------------------------------------------- */}
        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.split}>
              <Reveal>
                <div>
                  <SectionHeader
                    overline="Scenariolabb"
                    title="Vem kör först?"
                    lead="Väjningsregler är lättare att förstå när du ser dem uppifrån. Tryck på fordonen i den ordning de kan köra — och få hela resonemanget steg för steg."
                  />
                  <ButtonLink to="/scenarier" variant="soft" iconAfter="arrow-right">
                    Prova ett scenario
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className={styles.scenarioFrame}>
                  {scenario && <ScenarioStage scenario={scenario} revealed />}
                  <p className={styles.scenarioCaption}>
                    Oskyltad korsning — högerregeln avgör ordningen.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---- Privacy + offline ---------------------------------------- */}
        <section className={[styles.section, styles.sectionAlt].join(' ')} id="integritet">
          <div className={styles.shell}>
            <div className={styles.split}>
              <Reveal>
                <div>
                  <SectionHeader
                    overline="Lokalt först"
                    title="Din utveckling stannar på din enhet."
                    lead="Vägklar har ingen inloggning och ingen server som lagrar vad du svarat. Allt sparas i din webbläsare."
                  />
                  <ul className={styles.checkList}>
                    {[
                      'Inget konto behövs — du kan börja direkt.',
                      'All träningsdata sparas lokalt i den här webbläsaren.',
                      'En annan enhet eller webbläsare startar med en egen, tom profil.',
                      'Exportera en säkerhetskopia när du vill, och läs in den igen.',
                      'Rensar du webbplatsdata försvinner utvecklingen — därför finns exporten.',
                    ].map((item) => (
                      <li className={styles.checkItem} key={item}>
                        <span className={styles.checkIcon}>
                          <Icon name="check" size={13} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={70}>
                <div className={styles.featureGrid} style={{ gridTemplateColumns: '1fr' }}>
                  <Feature icon="offline" title="Fungerar offline">
                    Plugga på tåget, bussen eller i soffan. Frågor, lektioner och din utveckling
                    finns kvar utan uppkoppling, och allt du svarar sparas lokalt.
                  </Feature>
                  <Feature icon="share" title="Installera som app">
                    Lägg till Vägklar på hemskärmen så startar den i helskärm, utan webbläsarens
                    adressfält.
                  </Feature>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---- Final CTA -------------------------------------------------- */}
        <section className={styles.section}>
          <div className={styles.shell}>
            <Reveal>
              <div className={styles.finalCta}>
                <h2 className={styles.finalTitle}>Redo att börja?</h2>
                <p className={styles.finalLead}>
                  {stats.total} originalfrågor över {CATEGORIES.length} kunskapsområden, en
                  provsimulering och en motor som håller reda på vad du behöver träna härnäst.
                </p>
                <div className={styles.finalActions}>
                  <ButtonLink to="/hem" size="lg" iconAfter="arrow-right">
                    Börja träna
                  </ButtonLink>
                  <ButtonLink to="/om" size="lg" variant="secondary">
                    Läs mer om Vägklar
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---- Footer ------------------------------------------------------ */}
      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerGrid}>
            <div>
              <Wordmark />
              <p className={styles.footerAbout}>
                Adaptiv teoriutbildning för svenskt B-körkort. Byggd för att lära ut förståelse för
                trafiken, inte utantillkunskap om enskilda frågor.
              </p>
            </div>

            <div>
              <div className={styles.footerHeading}>Produkt</div>
              <div className={styles.footerLinks}>
                <Link className={styles.footerLink} to="/hem">
                  Hem
                </Link>
                <Link className={styles.footerLink} to="/trana">
                  Träna
                </Link>
                <Link className={styles.footerLink} to="/prov">
                  Provsimulering
                </Link>
                <Link className={styles.footerLink} to="/teori">
                  Teoriskola
                </Link>
                <Link className={styles.footerLink} to="/scenarier">
                  Scenariolabb
                </Link>
              </div>
            </div>

            <div>
              <div className={styles.footerHeading}>Om</div>
              <div className={styles.footerLinks}>
                <Link className={styles.footerLink} to="/om">
                  Om Vägklar
                </Link>
                <Link className={styles.footerLink} to="/kallor">
                  Källor & rättigheter
                </Link>
                <Link className={styles.footerLink} to="/om#integritet">
                  Integritet
                </Link>
                <Link className={styles.footerLink} to="/installningar">
                  Inställningar
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div className={styles.footerLegal}>
              <p className={styles.footerCopyright}>{RIGHTS.copyright}</p>
              <p className={styles.disclaimer}>{RIGHTS.disclaimer}</p>
              <p className={styles.footerFinePrint}>{RIGHTS.thirdPartyShort}</p>
            </div>
            <span className={styles.footerVersion}>Version {APP_VERSION}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
