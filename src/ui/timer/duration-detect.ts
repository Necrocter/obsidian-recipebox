/**
 * Regex patterns and parser for detecting cooking durations in instruction text,
 * supporting ranges, compound h/m expressions, and plain minutes or seconds.
 *
 * Range patterns are declared before single-value patterns to prevent partial
 * consumption of "10–15 minutes" by a plain-minutes branch.
 */
// Range patterns must appear before single-value patterns so "10-15 minutes"
// or "10 to 15 minutes" isn't partially consumed by the plain-minutes branch first.
// Groups: (1,2) hour range · (3,4) min range · (5,6) sec range
//         (7,8) hours+opt-minutes · (9) plain minutes · (10) plain seconds
const SEP = String.raw`\s*(?:[-–]|\bto\b|\ba\b)\s*`;

// Unit tokens accept English and Spanish spellings plus the usual
// abbreviations ("1 h 30 min", "1 hora 30 minutos", "10-15 min").
const HOUR = String.raw`(?:hours?|horas?|hrs?|hr)`;
const MIN = String.raw`(?:min(?:ute)?s?|minutos?|mins?)`;
const SEC = String.raw`(?:sec(?:ond)?s?|segundos?|segs?)`;

export const DURATION_RE = new RegExp(
	String.raw`\b(\d+(?:\.\d+)?)${SEP}(\d+(?:\.\d+)?)\s*${HOUR}\b` +
	String.raw`|\b(\d+(?:\.\d+)?)${SEP}(\d+(?:\.\d+)?)\s*${MIN}\b` +
	String.raw`|\b(\d+(?:\.\d+)?)${SEP}(\d+(?:\.\d+)?)\s*${SEC}\b` +
	String.raw`|\b(\d+(?:\.\d+)?)\s*${HOUR}\b(?:\s*(\d+(?:\.\d+)?)\s*${MIN}\b)?` +
	String.raw`|\b(\d+(?:\.\d+)?)\s*${MIN}\b` +
	String.raw`|\b(\d+(?:\.\d+)?)\s*${SEC}\b`,
	"gi",
);

function r(s: string): number { return Math.round(parseFloat(s)); }

function pickBound(loSec: number, hiSec: number, pref: "min" | "max"): number {
	return pref === "max" ? Math.max(loSec, hiSec) : Math.min(loSec, hiSec);
}

export function matchToSeconds(m: RegExpExecArray, rangeDefault: "min" | "max"): number {
	if (m[1]) return pickBound(r(m[1]) * 3600, r(m[2]) * 3600, rangeDefault);
	if (m[3]) return pickBound(r(m[3]) * 60,   r(m[4]) * 60,   rangeDefault);
	if (m[5]) return pickBound(r(m[5]),         r(m[6]),         rangeDefault);
	if (m[7]) return r(m[7]) * 3600 + (m[8] ? r(m[8]) * 60 : 0);
	if (m[9]) return r(m[9]) * 60;
	if (m[10]) return r(m[10]);
	return 0;
}
