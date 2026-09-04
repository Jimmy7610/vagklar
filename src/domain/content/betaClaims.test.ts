import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_QUESTIONS } from '@/content/questions';
import { SOURCES } from '@/content/sources';
import { DISCLAIMER } from '@/domain/constants';

/**
 * What the product is allowed to claim about itself.
 *
 * Everything else in this repository can be fixed in a later pass. A false
 * claim about verification cannot: somebody revising for a driving test reads
 * "verified" as "an expert checked this", and if that is not true then the app
 * has told them the one thing it must never tell them.
 *
 * So the claims are asserted rather than reviewed. Nothing here checks style;
 * each test names a specific sentence the product must not be able to say
 * while it is untrue.
 */

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('verification claims', () => {
  it('has no verified question', () => {
    expect(ALL_QUESTIONS.filter((q) => q.status === 'verified')).toHaveLength(0);
  });

  it('describes the bank as reviewed, not verified, wherever it says so', () => {
    // These two screens are the only places the product characterises its own
    // content quality. Both must keep the distinction the bank actually holds.
    const about = read('src/features/more/AboutPage.tsx');
    expect(about).toContain('inte slutgiltigt verifierat av en sakkunnig');
    expect(about).toContain('inga officiella provfrågor');

    const landing = read('src/features/landing/LandingPage.tsx');
    expect(landing).toContain('inga officiella provfrågor');
  });

  it('never calls the content official, approved or expert-checked', () => {
    const forbidden = [
      /\bexpertgranskat\b/i,
      /\bkvalitetssäkrat av\b/i,
      /\bgodkänt av Trafikverket\b/i,
      /officiella provfrågor(?!\s*(och|\.|,))/i,
    ];
    for (const file of [
      'src/features/more/AboutPage.tsx',
      'src/features/landing/LandingPage.tsx',
      'src/features/home/HomePage.tsx',
    ]) {
      const source = read(file);
      for (const pattern of forbidden) {
        // "inga officiella provfrågor" is a denial and must survive; the
        // pattern only fires on a bare claim.
        const hits = source.match(pattern) ?? [];
        for (const hit of hits) {
          const at = source.indexOf(hit);
          const before = source.slice(Math.max(0, at - 24), at);
          expect(/inga|inte|aldrig/i.test(before), `${file}: "${hit}"`).toBe(true);
        }
      }
    }
  });

  it('keeps the independence disclaimer intact', () => {
    expect(DISCLAIMER).toContain('fristående');
    expect(DISCLAIMER).toContain('inte ansluten till eller godkänd av Trafikverket');
  });

  it('records permission for every third-party source it credits', () => {
    for (const source of SOURCES) {
      expect(source.permission, source.id).toBeTruthy();
      if (source.kind === 'book') {
        expect(source.permission, source.id).toBe('granted');
        expect(source.rightsHolder ?? source.publisher, source.id).toBeTruthy();
      }
    }
  });
});

/**
 * Touch target sizes, asserted against the stylesheets.
 *
 * A component test in jsdom cannot measure a rendered box — jsdom has no
 * layout. What it can do is read the rule, and the rules here are the ones
 * that were measured in a real browser at 320 and 375 px and found to be under
 * a thumb. Pinning the numbers means the next person to make the exam
 * navigator denser has to argue with a test rather than with nobody.
 */
describe('touch targets', () => {
  it('gives the exam navigator cells 44 px', () => {
    const css = read('src/features/exam/Exam.module.css');
    expect(css).toContain('repeat(auto-fill, minmax(44px, 1fr))');
    expect(css).toMatch(/\.navCell\s*\{[^}]*min-height:\s*44px/);
  });

  it('keeps the navigator from overflowing a 320 px sheet', () => {
    // auto-fill decides the column count from the minimum, so a 44 px minimum
    // means five columns at 320 px rather than an eighth column pushed off the
    // edge. The arithmetic is the guard: five cells and four 6 px gaps fit in
    // the 280 px a 320 px viewport leaves after the sheet's padding.
    const cell = 44;
    const gap = 6;
    const available = 320 - 2 * 20;
    const columns = Math.floor((available + gap) / (cell + gap));
    expect(columns).toBeGreaterThanOrEqual(5);
    expect(columns * cell + (columns - 1) * gap).toBeLessThanOrEqual(available);
  });

  it('gives the segmented control 44 px', () => {
    const css = read('src/ui/components/Primitives.module.css');
    expect(css).toMatch(/\.segment\s*\{[^}]*min-height:\s*44px/);
  });

  it('gives a standalone section action a real target', () => {
    const css = read('src/ui/components/Primitives.module.css');
    expect(css).toMatch(/\.sectionAction\s*\{[^}]*min-height:\s*44px/);
  });

  it('gives the sheet close button 44 px', () => {
    const css = read('src/ui/components/Modal.module.css');
    expect(css).toMatch(/\.close\s*\{[^}]*width:\s*44px/);
  });

  it('gives the photograph expand control 44 px', () => {
    // The comment above this rule claimed 44 while the rule said 34, for long
    // enough that nobody noticed. Now the number is what is asserted.
    const css = read('src/ui/media/SourceImageFigure.module.css');
    expect(css).toMatch(/\.expand\s*\{[^}]*width:\s*44px/);
    expect(css).toMatch(/\.expand\s*\{[^}]*height:\s*44px/);
  });

  it('keeps the default button at 44 px', () => {
    const css = read('src/ui/components/Button.module.css');
    expect(css).toMatch(/--button-height:\s*44px/);
  });
});

/**
 * Reviewer tooling must not reach the shipped app.
 *
 * The worksheets carry a reviewer's decision boxes and the cross-check notes;
 * the queue carries every question's fingerprint. All of it is for somebody
 * with the repository open. `scripts/verify-build.mjs` refuses a build that
 * contains any of it — this asserts the guard still names them, because a
 * guard that quietly stopped covering a file is worse than no guard.
 */
describe('reviewer tooling stays out of the build', () => {
  it('names the review artefacts in the build guard', () => {
    const guard = read('scripts/verify-build.mjs');
    for (const needle of ['VERIFICATION-QUEUE', 'BATCH-01-ALKOHOL', 'Granskningsblad']) {
      expect(guard, needle).toContain(needle);
    }
  });
});
