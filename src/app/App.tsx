import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { UiProvider, useUi } from './state/UiProvider';
import { useLearnerState } from './state/useLearner';
import { useAppearance } from './state/theme';
import { AppLayout } from './AppLayout';
import { HydrationGate } from './HydrationGate';
import { Toaster } from '@/ui/components/Toaster';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { RouteFallback } from '@/ui/components/RouteFallback';
import { LandingPage } from '@/features/landing/LandingPage';
import { useServiceWorker } from './useServiceWorker';

/*
 * Routing uses HashRouter.
 *
 * GitHub Pages has no rewrite layer, so a deep link like /utveckling/omrade/x
 * would 404 on reload with history routing. The usual 404.html redirect trick
 * works but flashes and breaks the back button in subtle ways. Hash routing is
 * boring and correct: every URL is reloadable and shareable, including on a
 * project subpath. See docs/ARCHITECTURE.md.
 */

// Every route below the shell is lazy, Home included: it reads the question
// bank through useContent, so keeping it eager pulled all question bodies
// into the startup bundle. It sits behind HydrationGate either way.
const HomePage = lazy(() => import('@/features/home/HomePage'));
const PracticePage = lazy(() => import('@/features/practice/PracticePage'));
const SessionPage = lazy(() => import('@/features/practice/SessionPage'));
const ExamPage = lazy(() => import('@/features/exam/ExamPage'));
const ExamRunnerPage = lazy(() => import('@/features/exam/ExamRunnerPage'));
const ExamResultPage = lazy(() => import('@/features/exam/ExamResultPage'));
const ProgressPage = lazy(() => import('@/features/progress/ProgressPage'));
const SubcategoryPage = lazy(() => import('@/features/progress/SubcategoryPage'));
const MistakesPage = lazy(() => import('@/features/mistakes/MistakesPage'));
const TheoryPage = lazy(() => import('@/features/theory/TheoryPage'));
const LessonPage = lazy(() => import('@/features/theory/LessonPage'));
const ScenarioPage = lazy(() => import('@/features/scenarios/ScenarioPage'));
const ScenarioRunnerPage = lazy(() => import('@/features/scenarios/ScenarioRunnerPage'));
const MorePage = lazy(() => import('@/features/more/MorePage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));
const AboutPage = lazy(() => import('@/features/more/AboutPage'));
const SourcesPage = lazy(() => import('@/features/more/SourcesPage'));
const OnboardingPage = lazy(() => import('@/features/onboarding/OnboardingPage'));

/** Scroll to the top on navigation, but never mid-question. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function Appearance() {
  const { data } = useLearnerState();
  useAppearance(data.preferences);
  return null;
}

function ServiceWorkerBridge() {
  const { setUpdateHandler } = useUi();
  useServiceWorker(setUpdateHandler);
  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/introduktion"
        element={
          <HydrationGate>
            <OnboardingPage />
          </HydrationGate>
        }
      />

      {/*
        Focus surfaces: no bottom navigation, minimal chrome. Each waits for
        hydration, because each redirects away when it finds no active session.
      */}
      <Route
        path="/trana/pass"
        element={
          <HydrationGate>
            <SessionPage />
          </HydrationGate>
        }
      />
      <Route
        path="/prov/pagaende"
        element={
          <HydrationGate>
            <ExamRunnerPage />
          </HydrationGate>
        }
      />
      <Route path="/scenarier/:scenarioId" element={<ScenarioRunnerPage />} />

      <Route element={<AppLayout />}>
        <Route path="/hem" element={<HomePage />} />
        <Route path="/trana" element={<PracticePage />} />
        <Route path="/prov" element={<ExamPage />} />
        <Route path="/prov/resultat/:attemptId" element={<ExamResultPage />} />
        <Route path="/utveckling" element={<ProgressPage />} />
        <Route path="/utveckling/omrade/:subcategoryId" element={<SubcategoryPage />} />
        <Route path="/misstag" element={<MistakesPage />} />
        <Route path="/teori" element={<TheoryPage />} />
        <Route path="/teori/:lessonId" element={<LessonPage />} />
        <Route path="/scenarier" element={<ScenarioPage />} />
        <Route path="/mer" element={<MorePage />} />
        <Route path="/installningar" element={<SettingsPage />} />
        <Route path="/om" element={<AboutPage />} />
        <Route path="/kallor" element={<SourcesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/hem" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <UiProvider>
      <Appearance />
      <ServiceWorkerBridge />
      <HashRouter>
        <ScrollToTop />
        <a className="skip-link" href="#huvudinnehall">
          Hoppa till innehållet
        </a>
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <AppRoutes />
          </Suspense>
        </ErrorBoundary>
      </HashRouter>
      <Toaster />
    </UiProvider>
  );
}
