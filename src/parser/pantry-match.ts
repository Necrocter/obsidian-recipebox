/**
 * Pure matching logic for the "what can I cook?" pantry feature: turn a
 * free-form pantry note into a set of ingredient names, and compare a recipe's
 * declared ingredient list against it. No Obsidian imports so it stays unit
 * testable.
 */
import { normaliseName, stripListMarkers } from "./ingredient-clean";

const LIST_ITEM_RE = /^(?:[-*+]\s|\d+\.\s)/;
const TRAILING_PAREN_RE = /\s*\([^)]*\)\s*$/;
const TRAILING_TAGS_RE = /(?:\s+#[\w/-]+)+\s*$/;

/**
 * Parse a pantry note body into a set of normalised ingredient names. Only
 * bullet / numbered / checkbox list items count; headings, quotes and prose
 * are ignored so the note can carry section headers and comments. A trailing
 * "(note)" or "#tag" on an item is stripped before normalising.
 */
export function parsePantryNote(text: string): Set<string> {
	const out = new Set<string>();
	for (const rawLine of text.split("\n")) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#") || line.startsWith(">")) continue;
		if (!LIST_ITEM_RE.test(line)) continue;
		const item = stripListMarkers(line)
			.replace(TRAILING_TAGS_RE, "")
			.replace(TRAILING_PAREN_RE, "");
		const name = normaliseName(item);
		if (name) out.add(name);
	}
	return out;
}

export interface RecipeMatch {
	/** Recipe ingredient strings (verbatim) that the pantry covers. */
	covered: string[];
	/** Recipe ingredient strings (verbatim) the pantry is missing. */
	missing: string[];
}

/**
 * Compare a recipe's declared ingredient names against the pantry set.
 * Duplicate names within the recipe list collapse to one entry. Non-string
 * values (a malformed frontmatter array) are skipped.
 */
export function matchRecipe(ingredients: unknown[], pantry: Set<string>): RecipeMatch {
	const covered: string[] = [];
	const missing: string[] = [];
	const seen = new Set<string>();
	for (const raw of ingredients) {
		if (typeof raw !== "string") continue;
		const display = raw.trim();
		const name = normaliseName(display);
		if (!name || seen.has(name)) continue;
		seen.add(name);
		(pantry.has(name) ? covered : missing).push(display);
	}
	return { covered, missing };
}
