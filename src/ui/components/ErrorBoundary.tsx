import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  /** Shown instead of the default message. */
  title?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render errors and shows a calm, actionable message.
 *
 * Learners never see a stack trace. In development the error is logged to the
 * console so it stays debuggable.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('Vägklar: render error', error, info.componentStack);
    }
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          display: 'grid',
          gap: 'var(--space-4)',
          justifyItems: 'start',
          padding: 'var(--space-7) var(--space-gutter)',
          maxWidth: '48ch',
          margin: '0 auto',
        }}
        role="alert"
      >
        <h1 style={{ fontSize: 'var(--text-section)' }}>
          {this.props.title ?? 'Något gick fel här'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Din utveckling är sparad. Prova att ladda om sidan — om det återkommer kan du exportera en
          säkerhetskopia från Inställningar.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button onClick={this.reset}>Försök igen</Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Ladda om
          </Button>
        </div>
      </div>
    );
  }
}
