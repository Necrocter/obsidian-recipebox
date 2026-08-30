/**
 * Extracts grocery contributions from a recipe. Preferred source is the
 * ingredient lines under the configured ingredients heading; recipes that keep
 * their ingredient list only in frontmatter (or spread it across sub-headings
 * we do not scan) fall back to the configured frontmatter list property, so
 * "add to meal plan -> add to grocery list" works regardless of note layout.
 */
import { ContributionMap } from "../types";
import { RecipeBoxSettings } from "../settings/settings-types";
import { parseIngredientLine } from "../parser/ingredient-parse";
import { ingredientKey, hasIgnoreTag } from "../parser/ingredient-clean";
import { findValue } from "../parser/frontmatter-lookup";
import { stripWikilink } from "../utils/wikilink-strip";

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function collectRecipeContributions(
	body: string,
	frontmatter: Record<string, unknown>,
	settings: RecipeBoxSettings,
): ContributionMap {
	const contributions: ContributionMap = {};

	const add = (raw: string): void => {
		const parsed = parseIngredientLine(raw);
		if (!parsed?.name || hasIgnoreTag(parsed.tags, settings.ignoreIngredientTag)) return;
		const key = ingredientKey(parsed.name, parsed.unit);
		if (!contributions[key]) {
			contributions[key] = { name: parsed.name, unit: parsed.unit, quantity: parsed.quantity };
		} else if (parsed.quantity !== null && contributions[key].quantity !== null) {
			contributions[key] = { ...contributions[key], quantity: contributions[key].quantity + parsed.quantity };
		}
	};

	const headingRe = new RegExp(`^#{1,6}\\s+${escapeRegex(settings.ingredientsHeading)}\\s*$`, "i");
	const nextHeadingRe = /^#{1,6}\s/;
	let inSection = false;
	let sawSection = false;
	for (const line of body.split("\n")) {
		if (headingRe.test(line)) { inSection = true; sawSection = true; continue; }
		if (inSection && nextHeadingRe.test(line)) break;
		if (inSection) add(line);
	}

	// No dedicated ingredients section in the body: use the frontmatter list.
	if (!sawSection) {
		const listRaw = findValue(frontmatter, [settings.ingredientsListProperty, "ingredientes", "ingredients"]);
		if (Array.isArray(listRaw)) {
			for (const item of listRaw) {
				if (typeof item === "string") add(stripWikilink(item.trim()));
			}
		}
	}

	return contributions;
}
