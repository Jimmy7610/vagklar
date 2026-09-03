import { getRoadSign } from '@/content/road-signs';

/**
 * The registry's description of a sign.
 *
 * Kept out of `RoadSign` on purpose. The renderer is reached from the landing
 * page through the scenario stage, and pulling the whole 99-sign registry in
 * behind it put 23 kB gzip of Swedish prose on the startup path to supply an
 * alt text the caller usually passes anyway.
 *
 * Everything that wants the registry wording — the catalogue, the lesson, the
 * question surfaces — is lazily loaded, so this import costs nothing at start.
 */
export function signAltText(id: string): string {
  return getRoadSign(id)?.altText ?? id;
}
