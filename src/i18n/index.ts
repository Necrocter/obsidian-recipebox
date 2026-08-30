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
