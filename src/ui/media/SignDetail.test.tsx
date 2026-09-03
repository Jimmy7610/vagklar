import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignCatalogue } from './SignCatalogue';
import { ROAD_SIGNS, confusableSigns, getRoadSign } from '@/content/road-signs';

/**
 * The sign detail dialog, checked as a keyboard user meets it.
 *
 * The reason this has a test at all is that the catalogue is the one place in
 * the app where a modal opens over a search the learner is in the middle of.
 * Everything that can go wrong there goes wrong silently: focus left at the top
 * of the document, Escape doing nothing, the dialog announcing itself with no
 * name, or a second heading that turns the page's heading list into noise.
 *
 * jsdom does not implement <dialog>'s modal behaviour, so showModal and close
 * are polyfilled onto the prototype for the run. That means this suite checks
 * *our* contract — that the dialog is opened, labelled, closable and returns
 * focus — and not the browser's focus trap, which is the browser's to keep.
 */

interface DialogInternals {
  open: boolean;
  dispatchEvent(event: Event): boolean;
}

function polyfillDialog() {
  const proto = window.HTMLDialogElement?.prototype;
  if (!proto) return;
  if (!proto.showModal) {
    proto.showModal = function showModal(this: DialogInternals) {
      this.open = true;
    };
  }
  if (!proto.close) {
    proto.close = function close(this: DialogInternals) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    };
  }
}

polyfillDialog();

/** A sign that certainly has lookalikes, so the confusable block renders. */
const withConfusable = ROAD_SIGNS.find((s) => confusableSigns(s.id).length > 0)!;

describe('sign detail', () => {
  it('opens from a catalogue card and is labelled by the sign name', async () => {
    const user = userEvent.setup();
    render(<SignCatalogue />);

    await user.click(screen.getAllByRole('button', { name: new RegExp(withConfusable.name) })[0]!);

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(within(dialog).getByRole('heading', { hidden: true })).toHaveTextContent(
      withConfusable.name,
    );
  });

  it('has exactly one heading, so the page heading list stays readable', async () => {
    const user = userEvent.setup();
    render(<SignCatalogue />);

    await user.click(screen.getAllByRole('button', { name: new RegExp(withConfusable.name) })[0]!);

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(within(dialog).getAllByRole('heading', { hidden: true })).toHaveLength(1);
  });

  it('shows the long meaning and the written description, which the card cannot', async () => {
    const user = userEvent.setup();
    render(<SignCatalogue />);

    await user.click(screen.getAllByRole('button', { name: new RegExp(withConfusable.name) })[0]!);

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toHaveTextContent(withConfusable.longMeaning);
    expect(dialog).toHaveTextContent(withConfusable.altText);
  });

  it('lists at most three lookalikes, and only real ones', async () => {
    const user = userEvent.setup();
    render(<SignCatalogue />);

    await user.click(screen.getAllByRole('button', { name: new RegExp(withConfusable.name) })[0]!);

    const dialog = screen.getByRole('dialog', { hidden: true });
    const group = within(dialog).getByLabelText(
      'Märken som är lätta att blanda ihop med detta',
    );
    const cards = within(group).getAllByRole('listitem');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThanOrEqual(3);
    for (const card of cards) {
      // Every card names a sign that exists rather than a dangling id.
      const named = ROAD_SIGNS.some((s) => card.textContent?.includes(s.name));
      expect(named).toBe(true);
    }
  });

  it('reopens after being closed', async () => {
    // It did not, once. Closing called dialog.close() and then waited for the
    // element's own close event to push the state back — and when that event
    // does not arrive the component still believes the dialog is open, so the
    // next click sets the state it already has and nothing happens. The state
    // is now what opens and closes the dialog, and the event only reports
    // Escape.
    const user = userEvent.setup();
    render(<SignCatalogue />);

    const opener = screen.getAllByRole('button', {
      name: new RegExp(withConfusable.name),
    })[0]!;

    await user.click(opener);
    expect(
      screen.getByRole('heading', { name: withConfusable.name, hidden: true }),
    ).toBeInTheDocument();

    await user.click(
      within(screen.getByRole('dialog', { hidden: true })).getByRole('button', {
        name: /stäng/i,
        hidden: true,
      }),
    );
    expect(screen.queryByRole('heading', { name: withConfusable.name, hidden: true })).toBeNull();

    await user.click(opener);
    expect(
      screen.getByRole('heading', { name: withConfusable.name, hidden: true }),
    ).toBeInTheDocument();
  });

  it('closes on the close button and puts focus back on the card that opened it', async () => {
    const user = userEvent.setup();
    render(<SignCatalogue />);

    const opener = screen.getAllByRole('button', {
      name: new RegExp(withConfusable.name),
    })[0]!;
    await user.click(opener);

    const dialog = screen.getByRole('dialog', { hidden: true });
    await user.click(within(dialog).getByRole('button', { name: /stäng/i, hidden: true }));

    expect(screen.queryByRole('heading', { name: withConfusable.name, hidden: true })).toBeNull();
    expect(document.activeElement).toBe(opener);
  });
});

describe('confusableSigns', () => {
  it('reads the relation from both directions', () => {
    // The registry had 48 one-way edges, which meant a learner could find the
    // confusion from one sign and not from its twin. Whichever side an author
    // wrote it on, both sides now show it.
    const oneWay = ROAD_SIGNS.flatMap((s) =>
      s.similarSignIds
        .filter((other) => !getRoadSign(other)?.similarSignIds.includes(s.id))
        .map((other) => [s.id, other] as const),
    );
    expect(oneWay.length).toBeGreaterThan(0);
    const [from, to] = oneWay[0]!;
    expect(confusableSigns(to).map((s) => s.id)).toContain(from);
  });

  it('never lists the sign itself', () => {
    for (const sign of ROAD_SIGNS) {
      expect(confusableSigns(sign.id).map((s) => s.id), sign.id).not.toContain(sign.id);
    }
  });

  it('caps the list, because eight lookalikes distinguish nothing', () => {
    for (const sign of ROAD_SIGNS) {
      expect(confusableSigns(sign.id).length, sign.id).toBeLessThanOrEqual(3);
    }
  });

  it('resolves every id it returns', () => {
    for (const sign of ROAD_SIGNS) {
      for (const other of confusableSigns(sign.id)) {
        expect(getRoadSign(other.id), `${sign.id} -> ${other.id}`).toBeDefined();
      }
    }
  });
});
