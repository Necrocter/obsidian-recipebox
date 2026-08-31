/**
 * Runtime translation lookup. `t(key, vars?)` returns the string for the
 * active locale, falling back to English for any key a locale is missing
 * (belt-and-braces; the es.ts type already forces completeness).
 *
 * The active locale is resolved once at plugin load and again whenever
 * settings are saved, via `setActiveLanguage()`. "auto" follows Obsidian's
 * own display language (persisted by the app in localStorage under
 * "language"); an explicit "en"/"es" overrides that.
 */
import { getLanguage } from "obsidian";
import { en, type TranslationKey } from "./locales/en";
import { es } from "./locales/es";

export type { TranslationKey } from "./locales/en";

export type AppLanguage = "auto" | "en" | "es";
export const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ["auto", "en", "es"];

type Locale = "en" | "es";

const DICTIONARIES: Record<Locale, Record<TranslationKey, string>> = { en, es };

let activeLocale: Locale = "en";

/**
 * Map an AppLanguage preference to a concrete locale. For "auto" we follow
 * Obsidian's own UI language via getLanguage() (e.g. "es", "en", "pt-BR");
 * anything that is not Spanish falls back to English, the only other locale
 * this plugin ships.
 */
export function resolveLocale(pref: AppLanguage): Locale {
	if (pref === "en" || pref === "es") return pref;
	try {
		if (getLanguage().toLowerCase().startsWith("es")) return "es";
	} catch {
		// getLanguage() unavailable (e.g. older Obsidian): use the English default.
	}
	return "en";
}

export function setActiveLanguage(pref: AppLanguage): void {
	activeLocale = resolveLocale(pref);
}

export function getActiveLocale(): Locale {
	return activeLocale;
}

/**
 * BCP-47 tag for the active locale, for Intl / toLocaleDateString calls so
 * dates format in the plugin's language rather than the OS default.
 */
export function getLocaleTag(): string {
	return activeLocale === "es" ? "es" : "en";
}

/**
 * Look up a translated string. `vars` fills `{name}` placeholders in the
 * template; an unmatched placeholder is left intact so missing data is
 * visible rather than silently blank.
 */
export function t(key: TranslationKey, vars?: Record<string, string | number>): string {
	const template = DICTIONARIES[activeLocale][key] ?? en[key] ?? key;
	if (!vars) return template;
	return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
		Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole
	);
}

/**
 * Plural helper: picks the `one` key for a count of exactly 1, the `other`
 * key otherwise, and passes `count` (plus any extra vars) to t(). Both keys
 * are real TranslationKeys so completeness stays compile-checked.
 */
export function tPlural(
	one: TranslationKey,
	other: TranslationKey,
	count: number,
	vars?: Record<string, string | number>
): string {
	return t(count === 1 ? one : other, { count, ...vars });
}

const WEEKDAY_KEYS: Record<string, TranslationKey> = {
	monday: "day.monday",
	tuesday: "day.tuesday",
	wednesday: "day.wednesday",
	thursday: "day.thursday",
	friday: "day.friday",
	saturday: "day.saturday",
	sunday: "day.sunday",
};

/**
 * Localise a weekday given by name in any case ("Monday", "monday"). Values
 * that are not a recognised weekday (a custom label, a sentinel) are returned
 * unchanged, so callers can pass raw `entry.day` strings safely.
 */
export function dayLabel(day: string): string {
	const key = WEEKDAY_KEYS[day.trim().toLowerCase()];
	return key ? t(key) : day;
}

// Every localised full weekday name (across all shipped locales) mapped back
// to its canonical English key. Built once. Used to read day-section headings
// out of the meal plan note -- the note may say "## Lunes" but state, sorting
// and the week grid all key off "Monday".
const CANONICAL_DAY_BY_LOCALISED: Record<string, string> = (() => {
	const out: Record<string, string> = {};
	for (const [canonical, key] of Object.entries(WEEKDAY_KEYS)) {
		const english = canonical.charAt(0).toUpperCase() + canonical.slice(1);
		out[canonical] = english; // "monday" -> "Monday"
		for (const dict of Object.values(DICTIONARIES)) {
			out[dict[key].trim().toLowerCase()] = english;
		}
	}
	return out;
})();

/**
 * Inverse of dayLabel(): given a weekday name in any shipped language and any
 * case ("Lunes", "lunes", "Monday"), return the canonical English key
 * ("Monday"). Anything not a recognised weekday (a custom label, a queue
 * sentinel) is returned unchanged.
 */
export function canonicalDay(day: string): string {
	return CANONICAL_DAY_BY_LOCALISED[day.trim().toLowerCase()] ?? day;
}

/**
 * The value of `key` in every shipped locale. For building reverse lookups
 * (localised label -> internal key) that must accept a note written under a
 * different active language than the one now selected.
 */
export function localisedVariants(key: TranslationKey): string[] {
	return Object.values(DICTIONARIES).map((d) => d[key]);
}
