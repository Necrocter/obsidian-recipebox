/**
 * Recipe/pantry matching for the "what can I cook?" feature. Pantry parsing
 * lives in pantry-note.ts; this file just compares a recipe's declared
 * ingredient list against the pantry set. No Obsidian imports.
 */
import { normaliseName } from "./ingredient-clean";
import { pantrySet } from "./pantry-note";

/** @deprecated import `pantrySet` from ./pantry-note instead. */
export const parsePantryNote = pantrySet;

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
