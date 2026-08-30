/**
 * English string catalogue and the single source of truth for translation
 * keys. Every user-facing string in the plugin has an entry here; other
 * locales (see es.ts) are typed against this object's keys, so a missing
 * translation is a compile error rather than a silent English fallback.
 *
 * Keys are flat and dot-namespaced by feature area ("settings.notes.*",
 * "notice.*", "modal.*") to keep them greppable.
 */
export const en = {
	// ── Ribbon icons ────────────────────────────────────────────────────────
	"ribbon.dashboard": "Recipe box dashboard",
	"ribbon.openGrocery": "Open grocery list",
	"ribbon.openMealPlan": "Open meal plan",
	"ribbon.browseRecipes": "Browse recipes",
} as const;

export type TranslationKey = keyof typeof en;
