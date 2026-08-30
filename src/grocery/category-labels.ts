/**
 * Grocery categories travel through the code as fixed English keys ("Produce",
 * "Snack", ...) -- that is what settings.manualCategoryOrder, the keyword
 * dictionary and category overrides all use. These helpers translate a key to
 * a display label and back, so the grocery note and the grocery view can show
 * "Verduras y frutas" while everything internal stays keyed in English. A note
 * heading written under one language still resolves under another.
 */
import { t, localisedVariants, type TranslationKey } from "../i18n";

const KEY_TO_TKEY: Record<string, TranslationKey> = {
	"Produce": "category.produce",
	"Herb": "category.herb",
	"Meat": "category.meat",
	"Seafood": "category.seafood",
	"Dairy": "category.dairy",
	"Cheese": "category.cheese",
	"Egg": "category.egg",
	"Bread": "category.bread",
	"Pasta": "category.pasta",
	"Grain": "category.grain",
	"Canned": "category.canned",
	"Broth": "category.broth",
	"Sauce": "category.sauce",
	"Condiment": "category.condiment",
	"Oil": "category.oil",
	"Seasoning": "category.seasoning",
	"Baking": "category.baking",
	"Nuts & Seeds": "category.nutsSeeds",
	"Snack": "category.snack",
	"Frozen": "category.frozen",
	"Beverage": "category.beverage",
	"Alcohol": "category.alcohol",
	"Household": "category.household",
	"Other": "category.other",
};

// Every shipped label (any language) plus the English key itself -> the key.
const CANON_BY_LABEL: Record<string, string> = (() => {
	const out: Record<string, string> = {};
	for (const [key, tkey] of Object.entries(KEY_TO_TKEY)) {
		out[key.toLowerCase()] = key;
		for (const variant of localisedVariants(tkey)) out[variant.trim().toLowerCase()] = key;
	}
	return out;
})();

/** Internal category key -> label in the active language. Unknown keys (a
 *  user's own category from an override or tag) pass through unchanged. */
export function categoryLabel(key: string): string {
	const tkey = KEY_TO_TKEY[key];
	return tkey ? t(tkey) : key;
}

/** Inverse of categoryLabel(): a label in any shipped language -> the internal
 *  key. Unrecognised text is returned unchanged. */
export function canonicalCategory(label: string): string {
	return CANON_BY_LABEL[label.trim().toLowerCase()] ?? label;
}
