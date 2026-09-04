import { describe, expect, it } from 'vitest';
import { collectDiagnostics, formatDiagnostics } from './diagnostics';
import { ALL_QUESTIONS } from '@/content/questions';

/**
 * The diagnostics text is something a tester pastes into a message.
 *
 * That makes it a publishing surface, and the rule for a publishing surface is
 * the same as everywhere else in this app: it may carry what the tester would
 * expect it to carry, and nothing they would be surprised to find in it. The
 * surprises worth guarding against are specific — a question's text, an answer
 * they gave, a filesystem path from a development machine, a stable identifier
 * that would let two reports be tied to the same person.
 *
 * A comment promising that would be worth nothing. These check the produced
 * string.
 */

const input = {
  answers: 412,
  exams: 3,
  sessions: 27,
  masteryAreas: 64,
  route: '#/prov/pagaende',
  storageVersion: 4,
};

describe('diagnostics', () => {
  const text = formatDiagnostics(collectDiagnostics(input));

  it('says which build, where, and in what kind of window', () => {
    expect(text).toContain('Appversion');
    expect(text).toContain('#/prov/pagaende');
    expect(text).toContain('Läge');
    expect(text).toContain('Service worker');
  });

  it('reports how much is stored without saying what', () => {
    expect(text).toContain('412 svar');
    expect(text).toContain('3 prov');
    expect(text).not.toMatch(/correctAnswerId|answerId|"id"/);
  });

  it('carries no question text', () => {
    // The bank is the licensed half of the app. A diagnostics blob that
    // included a prompt would be republishing it into a chat message.
    const sample = ALL_QUESTIONS.slice(0, 40);
    for (const q of sample) {
      expect(text).not.toContain(q.prompt);
      for (const a of q.answers) expect(text).not.toContain(a.text);
    }
  });

  it('carries no filesystem path', () => {
    expect(text).not.toMatch(/[A-Za-z]:\\/);
    expect(text).not.toMatch(/\/Users\/|\/home\/|file:\/\//);
  });

  it('carries no stable identifier for the person', () => {
    // Everything here is either about the moment (a timestamp), the software,
    // or a count. Nothing survives across reports in a way that links them.
    expect(text).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/i);
    expect(text).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i);
    expect(text.toLowerCase()).not.toContain('userid');
    expect(text.toLowerCase()).not.toContain('deviceid');
  });

  it('is short enough to paste into a message', () => {
    expect(text.split('\n').length).toBeLessThan(20);
    expect(text.length).toBeLessThan(1200);
  });

  it('never throws when the browser tells it nothing', () => {
    // Called from a settings page, so a matchMedia or navigator that behaves
    // oddly must degrade to "okänt" rather than break the page.
    expect(() => collectDiagnostics({ ...input, route: '' })).not.toThrow();
  });
});
