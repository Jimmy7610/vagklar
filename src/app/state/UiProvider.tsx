import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { IconName } from '@/ui/icons/Icon';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
  icon?: IconName;
  /** Milliseconds before auto-dismiss. 0 keeps it until dismissed. */
  duration: number;
}

export interface UiContextValue {
  toasts: Toast[];
  toast: (message: string, options?: { tone?: ToastTone; icon?: IconName; duration?: number }) => void;
  dismissToast: (id: string) => void;
  isOnline: boolean;
  /** True once the service worker has a new version waiting. */
  updateReady: boolean;
  applyUpdate: () => void;
  setUpdateHandler: (handler: { ready: boolean; apply: () => void }) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

let toastCounter = 0;

export function UiProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );
  const [update, setUpdate] = useState<{ ready: boolean; apply: () => void }>({
    ready: false,
    apply: () => {},
  });
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback<UiContextValue['toast']>(
    (message, options) => {
      toastCounter += 1;
      const id = `toast-${toastCounter}`;
      const duration = options?.duration ?? 4200;
      const entry: Toast = {
        id,
        message,
        tone: options?.tone ?? 'neutral',
        duration,
      };
      if (options?.icon) entry.icon = options.icon;

      setToasts((current) => [...current.slice(-2), entry]);

      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismissToast(id), duration),
        );
      }
    },
    [dismissToast],
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    const map = timers.current;
    return () => {
      for (const timer of map.values()) clearTimeout(timer);
      map.clear();
    };
  }, []);

  const value = useMemo<UiContextValue>(
    () => ({
      toasts,
      toast,
      dismissToast,
      isOnline,
      updateReady: update.ready,
      applyUpdate: update.apply,
      setUpdateHandler: setUpdate,
    }),
    [toasts, toast, dismissToast, isOnline, update],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const context = useContext(UiContext);
  if (!context) throw new Error('useUi must be used inside UiProvider');
  return context;
}
