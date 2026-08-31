/**
 * Regular expressions and helpers for recognising "Ingredients" and
 * "Instructions" section headings in free-form recipe text, used by
 * text-recipe-parse.ts.
 *
 * The patterns are bilingual (English + Spanish) rather than locale-switched:
 * a Spanish-speaking user may still paste an English recipe and vice versa,
 * and accepting both keyword sets costs nothing at parse time.
 */
// Optional markdown heading prefix followed by the keyword
const HEAD_PREFIX = "(?:#{1,6}\\s+)?";

// Accent-tolerant: Spanish headings are frequently typed without accents
// ("preparacion", "elaboracion"), so every accented vowel is optional-accented.
const INGREDIENTS_KEYWORDS =
	"ingredients?|what\\s+you(?:'ll|\\s+will)?\\s+need" + // English
	"|ingredientes?|lo\\s+que\\s+necesitas|qu[eé]\\s+necesitas"; // Spanish

const INSTRUCTIONS_KEYWORDS =
	"instructions?|directions?|method|steps?|how\\s+to\\s+make|preparation" + // English
	"|instrucciones?|preparaci[oó]n|elaboraci[oó]n|procedimiento|pasos?" + // Spanish
	"|modo\\s+de\\s+(?:preparaci[oó]n|empleo|hacerlo)|c[oó]mo\\s+(?:se\\s+)?(?:hace|prepara|preparar)"; // Spanish phrases

export const INGREDIENTS_SECTION_RE = new RegExp(
	`^${HEAD_PREFIX}(?:${INGREDIENTS_KEYWORDS})\\s*:?\\s*$`,
	"i",
);

export const INSTRUCTIONS_SECTION_RE = new RegExp(
	`^${HEAD_PREFIX}(?:${INSTRUCTIONS_KEYWORDS})\\s*:?\\s*$`,
	"i",
);

// A line looks like a section keyword if it matches either boundary pattern
export function isSectionKeyword(line: string): boolean {
	return INGREDIENTS_SECTION_RE.test(line) || INSTRUCTIONS_SECTION_RE.test(line);
}
