import type { Question } from '@/domain/content/types';
import { alkoholQuestions } from './alkohol';
import { fordonetQuestions } from './fordonet';
import { halkaQuestions } from './halka';
import { hastighetQuestions } from './hastighet';
import { korsningarQuestions } from './korsningar';
import { lastQuestions } from './last';
import { manniskanQuestions } from './manniskan';
import { miljoQuestions } from './miljo';
import { morkerQuestions } from './morker';
import { motorvagQuestions } from './motorvag';
import { omkorningQuestions } from './omkorning';
import { parkeringQuestions } from './parkering';
import { riskerQuestions } from './risker';
import { trafikreglerQuestions } from './trafikregler';
import { trotthetQuestions } from './trotthet';
import { vagmarkenQuestions } from './vagmarken';

/**
 * The complete seed question bank.
 *
 * All questions are original, written for Vägklar. Nothing here is copied from
 * Trafikverket's official tests. Seed content is authored and internally
 * reviewed but not yet signed off by a human subject-matter expert — see
 * docs/QUESTION-AUTHORING.md for the verification workflow.
 */
export const ALL_QUESTIONS: Question[] = [
  ...trafikreglerQuestions,
  ...vagmarkenQuestions,
  ...hastighetQuestions,
  ...korsningarQuestions,
  ...parkeringQuestions,
  ...motorvagQuestions,
  ...omkorningQuestions,
  ...riskerQuestions,
  ...alkoholQuestions,
  ...trotthetQuestions,
  ...morkerQuestions,
  ...halkaQuestions,
  ...miljoQuestions,
  ...fordonetQuestions,
  ...lastQuestions,
  ...manniskanQuestions,
];
