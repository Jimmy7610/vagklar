import { Link } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import { Icon } from '@/ui/icons/Icon';
import type { IconName } from '@/ui/icons/Icon';
import { SectionHeading } from '@/ui/components/Primitives';
import { APP_VERSION, DISCLAIMER } from '@/domain/constants';
import { useLearner } from '@/app/state/useLearner';

interface Entry {
  to: string;
  icon: IconName;
  title: string;
  meta: string;
}

/**
 * The "Mer" surface.
 *
 * Everything that does not belong in the four primary destinations, kept as a
 * plain list rather than a second dashboard.
 */
export default function MorePage() {
  const learner = useLearner();
  const savedCount = Object.values(learner.questionStates).filter((s) => s.saved).length;

  const learning: Entry[] = [
    { to: '/teori', icon: 'book', title: 'Teoriskola', meta: 'Lektioner med kontrollfrågor' },
    { to: '/scenarier', icon: 'map', title: 'Scenariolabb', meta: 'Vem kör först, risker i trafiken' },
    { to: '/misstag', icon: 'refresh', title: 'Mina misstag', meta: 'Grupperade efter feltanke' },
  ];

  const app: Entry[] = [
    {
      to: '/installningar',
      icon: 'settings',
      title: 'Inställningar',
      meta: 'Utseende, tillgänglighet, data',
    },
    { to: '/om', icon: 'info', title: 'Om Vägklar', meta: 'Integritet, innehåll och version' },
  ];

  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Mer</h1>
      </header>

      <section aria-labelledby="learn-heading">
        <SectionHeading title="Lära" id="learn-heading" level={3} />
        <div className={page.rows}>
          {learning.map((entry) => (
            <Link key={entry.to} to={entry.to} className={page.row}>
              <span className={page.rowIcon}>
                <Icon name={entry.icon} size={17} />
              </span>
              <span>
                <span className={page.rowTitle}>{entry.title}</span>
                <span className={page.rowMeta}>{entry.meta}</span>
              </span>
              <span className={page.chevron}>
                <Icon name="chevron-right" size={18} />
              </span>
            </Link>
          ))}
          {savedCount > 0 && (
            <Link to="/trana" className={page.row}>
              <span className={page.rowIcon}>
                <Icon name="bookmark" size={17} />
              </span>
              <span>
                <span className={page.rowTitle}>Sparade frågor</span>
                <span className={page.rowMeta}>{savedCount} sparade</span>
              </span>
              <span className={page.chevron}>
                <Icon name="chevron-right" size={18} />
              </span>
            </Link>
          )}
        </div>
      </section>

      <section aria-labelledby="app-heading">
        <SectionHeading title="Appen" id="app-heading" level={3} />
        <div className={page.rows}>
          {app.map((entry) => (
            <Link key={entry.to} to={entry.to} className={page.row}>
              <span className={page.rowIcon}>
                <Icon name={entry.icon} size={17} />
              </span>
              <span>
                <span className={page.rowTitle}>{entry.title}</span>
                <span className={page.rowMeta}>{entry.meta}</span>
              </span>
              <span className={page.chevron}>
                <Icon name="chevron-right" size={18} />
              </span>
            </Link>
          ))}
          <Link to="/" className={page.row}>
            <span className={page.rowIcon}>
              <Icon name="home" size={17} />
            </span>
            <span>
              <span className={page.rowTitle}>Startsidan</span>
              <span className={page.rowMeta}>Presentationen av Vägklar</span>
            </span>
            <span className={page.chevron}>
              <Icon name="chevron-right" size={18} />
            </span>
          </Link>
        </div>
      </section>

      <p className={page.mutedNote}>
        {DISCLAIMER}
        <br />
        Version {APP_VERSION}
      </p>
    </div>
  );
}
