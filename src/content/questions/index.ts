import type { Question } from '@/domain/content/types';
import { grunderQuestions } from './grunder';
import { bildfragor2Questions } from './bildfragor2';
import { vagmarkesskyltarQuestions } from './vagmarkesskyltar';
import { bildfragorQuestions } from './bildfragor';
import { berakningarQuestions } from './berakningar';
import { samspelQuestions } from './samspel';
import { korfaltQuestions } from './korfalt';
import { fordonsadminQuestions } from './fordonsadmin';
import { drivmedelQuestions } from './drivmedel';
import { alkoholQuestions } from './alkohol';
import { cirkulationQuestions } from './cirkulation';
import { fordonetQuestions } from './fordonet';
import { halkaQuestions } from './halka';
import { hastighetQuestions } from './hastighet';
import { jarnvagQuestions } from './jarnvag';
import { korsningarQuestions } from './korsningar';
import { lastQuestions } from './last';
import { manniskanQuestions } from './manniskan';
import { miljoQuestions } from './miljo';
import { morkerQuestions } from './morker';
import { motorvagQuestions } from './motorvag';
import { omkorningQuestions } from './omkorning';
import { parkeringQuestions } from './parkering';
import { passagerQuestions } from './passager';
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
  ...cirkulationQuestions,
  ...jarnvagQuestions,
  ...passagerQuestions,
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
  ...samspelQuestions,
  ...korfaltQuestions,
  ...fordonsadminQuestions,
  ...drivmedelQuestions,
  ...berakningarQuestions,
  ...bildfragorQuestions,
  ...vagmarkesskyltarQuestions,
  ...bildfragor2Questions,
  ...grunderQuestions,
];
