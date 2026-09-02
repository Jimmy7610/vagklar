import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styles from './AppLayout.module.css';
import { Icon } from '@/ui/icons/Icon';
import type { IconName } from '@/ui/icons/Icon';
import { Wordmark } from '@/ui/brand/Logo';
import { useLearner, useLearnerState, useOutstandingMistakeCount } from './state/useLearner';
import { useUi } from './state/UiProvider';
import { HydrationGate } from './HydrationGate';
import { APP_VERSION } from '@/domain/constants';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  /** Also highlight for these path prefixes. */
  match?: string[];
}

const PRIMARY_NAV: NavItem[] = [
  { to: '/hem', label: 'Hem', icon: 'home' },
  { to: '/trana', label: 'Träna', icon: 'practice', match: ['/trana'] },
  { to: '/prov', label: 'Prov', icon: 'exam', match: ['/prov'] },
  { to: '/utveckling', label: 'Utveckling', icon: 'progress', match: ['/utveckling'] },
  { to: '/mer', label: 'Mer', icon: 'more', match: ['/mer', '/installningar', '/om', '/kallor'] },
];

const SIDEBAR_NAV: NavItem[] = [
  { to: '/hem', label: 'Hem', icon: 'home' },
  { to: '/trana', label: 'Träna', icon: 'practice' },
  { to: '/prov', label: 'Provsimulering', icon: 'exam' },
  { to: '/teori', label: 'Teoriskola', icon: 'book' },
  { to: '/scenarier', label: 'Scenariolabb', icon: 'map' },
  { to: '/misstag', label: 'Mina misstag', icon: 'refresh' },
  { to: '/utveckling', label: 'Utveckling', icon: 'progress' },
  { to: '/installningar', label: 'Inställningar', icon: 'settings' },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.to) return true;
  return (item.match ?? [item.to]).some((prefix) => pathname.startsWith(`${prefix}/`));
}

/**
 * The application shell.
 *
 * Two genuinely different navigation patterns rather than one squeezed into
 * the other: a thumb-reachable bottom bar on phones, a persistent sidebar from
 * 1024px where the vertical space is free anyway.
 */
export function AppLayout() {
  const { pathname } = useLocation();
  const { mode, warnings } = useLearnerState();
  const learner = useLearner();
  const mistakes = useOutstandingMistakeCount();
  const { isOnline, updateReady, applyUpdate } = useUi();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const streak = learner.profile.streak.current;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <NavLink to="/hem" aria-label="Vägklar, till startsidan">
            <Wordmark />
          </NavLink>
        </div>
        <nav className={styles.sidebarNav} aria-label="Huvudmeny">
          {SIDEBAR_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: active }) =>
                [styles.sidebarItem, active ? styles.sidebarItemActive : ''].filter(Boolean).join(' ')
              }
              end={item.to === '/hem'}
            >
              <Icon name={item.icon} size={19} />
              {item.label}
              {item.to === '/misstag' && mistakes > 0 && (
                <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
                  {mistakes}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarSpacer} />
        <div className={styles.sidebarFooter}>
          {streak > 0 && (
            <span>
              {streak} {streak === 1 ? 'dag' : 'dagar'} i rad
            </span>
          )}
          <span>Version {APP_VERSION}</span>
          <NavLink to="/om" className={styles.sidebarItem} style={{ padding: 0, minHeight: 0 }}>
            Om Vägklar
          </NavLink>
        </div>
      </aside>

      <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minWidth: 0 }}>
        <header
          className={[styles.topbar, scrolled ? styles.topbarScrolled : ''].filter(Boolean).join(' ')}
        >
          <NavLink to="/hem" aria-label="Vägklar, till startsidan">
            <Wordmark size={24} />
          </NavLink>
          <div className={styles.topbarActions}>
            {streak > 0 && (
              <span className={styles.streak} title={`${streak} dagar i rad`}>
                <Icon name="flame" size={14} />
                {streak}
              </span>
            )}
            <NavLink to="/installningar" className={styles.iconButton} aria-label="Inställningar">
              <Icon name="settings" size={20} />
            </NavLink>
          </div>
        </header>

        {mode === 'memory' && warnings.length > 0 && (
          <div className={styles.strip} role="status">
            <Icon name="alert" size={15} />
            <span>{warnings[0]}</span>
          </div>
        )}

        {!isOnline && (
          <div className={styles.strip} role="status">
            <Icon name="offline" size={15} />
            <span>Offline — du kan fortsätta träna, allt sparas lokalt.</span>
          </div>
        )}

        {updateReady && (
          <div className={styles.strip} role="status">
            <Icon name="refresh" size={15} />
            <span>En ny version av Vägklar finns.</span>
            <button type="button" className={styles.stripAction} onClick={applyUpdate}>
              Uppdatera
            </button>
          </div>
        )}

        <main className={styles.main} id="huvudinnehall">
          <div className={styles.content}>
            <HydrationGate>
              <Outlet />
            </HydrationGate>
          </div>
        </main>
      </div>

      <nav className={styles.bottomNav} aria-label="Huvudmeny">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(pathname, item);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={[styles.navItem, active ? styles.navItemActive : ''].filter(Boolean).join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              <span className={styles.navIcon}>
                <Icon name={item.icon} size={21} />
                {item.to === '/hem' && mistakes > 0 && <span className={styles.navBadge} />}
              </span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
