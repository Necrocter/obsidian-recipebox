/**
 * Locale-aware fallbacks for settings that name a vault artifact: note paths,
 * section headings, folders and the ignore-ingredient tag. DEFAULT_SETTINGS
 * stays English (it is the type-complete base and stays close to upstream);
 * these are used as the fallback at load time and when a field is cleared, so
 * a fresh Spanish vault gets "Despensa.md" / "Ingredientes" instead of the
 * English names. A value the user has actually set in data.json always wins.
 */
import { t, type TranslationKey } from "../i18n";

const LOCALE_DEFAULT_KEYS = {
	mealPlanPath: "default.mealPlanPath",
	groceryListPath: "default.groceryListPath",
	pantryNotePath: "default.pantryNotePath",
	ingredientsHeading: "default.ingredientsHeading",
	instructionsHeading: "default.instructionsHeading",
	notesHeading: "default.notesHeading",
	cookHistoryHeading: "default.cookHistoryHeading",
	ignoreIngredientTag: "default.ignoreIngredientTag",
	importerDefaultFolder: "default.recipeFolder",
	exportFolder: "default.exportFolder",
} as const satisfies Record<string, TranslationKey>;

export type LocaleDefaultKey = keyof typeof LOCALE_DEFAULT_KEYS;

/** Fallback for a single string setting, in the active language. */
export function localeDefault(key: LocaleDefaultKey): string {
	return t(LOCALE_DEFAULT_KEYS[key]);
}

/** recipeFolders is an array; its single default entry follows the language. */
export function localeDefaultRecipeFolders(): string[] {
	return [t("default.recipeFolder")];
}
