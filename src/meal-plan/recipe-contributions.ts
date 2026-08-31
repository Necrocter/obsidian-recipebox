/**
 * Extracts grocery contributions from a recipe.
 *
 * 1. If the body has a section under the configured ingredients heading
 *    ("## Ingredientes"), that section is the source, quantities and all.
 * 2. Otherwise -- the house/RecipeMD layout, where ingredient bullets sit under
 *    "### Para ..." sub-headings between "---" rules and the ignore tag lives on
 *    the bullet, not in frontmatter -- the curated frontmatter list property is
 *    the source of names, each enriched with the quantity from its matching body
 *    bullet and dropped when that bullet carries the ignore tag.
 */
import { ContributionMap } from "../types";
import { RecipeBoxSettings } from "../settings/settings-types";
import { parseIngredientLine } from "../parser/ingredient-parse";
import { ingredientKey, hasIgnoreTag, normaliseName } from "../parser/ingredient-clean";
import { findValue } from "../parser/frontmatter-lookup";
import { stripWikilink } from "../utils/wikilink-strip";

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Drop a leading "---\n...\n---" YAML block so its list items are not mistaken
 *  for ingredient bullets. */
function stripFrontmatter(text: string): string {
	const m = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
	return m ? text.slice(m[0].length) : text;
}

const BULLET_RE = /^\s*[-*+]\s+\S/;

interface BodyBullet {
	// One entry per ingredient the bullet names: the normalised name split on
	// commas and " y " / " e " / " and ", each trimmed of a trailing "al gusto".
	// "sal y pimienta negra al gusto" -> ["sal", "pimienta negra"].
	heads: string[];
	unit: string;
	quantity: number | null;
	ignored: boolean;
}

function splitHeads(name: string): string[] {
	return normaliseName(name)
		.split(/\s*,\s*|\s+y\s+|\s+e\s+|\s+and\s+/)
		.map((s) => s.replace(/\s+al gusto$/, "").trim())
		.filter(Boolean);
}

function bodyBullets(text: string, settings: RecipeBoxSettings): BodyBullet[] {
	const out: BodyBullet[] = [];
	for (const line of text.split("\n")) {
		if (!BULLET_RE.test(line)) continue;
		const p = parseIngredientLine(line);
		if (!p?.name) continue;
		out.push({
			heads: splitHeads(p.name),
			unit: p.unit,
			quantity: p.quantity,
			ignored: hasIgnoreTag(p.tags, settings.ignoreIngredientTag),
		});
	}
	return out;
}

/** A body bullet describes the frontmatter name when one of its named
 *  ingredients equals it or begins with it ("cebolla" <- "cebolla mediana",
 *  "aceite de oliva" <- "aceite de oliva extra virgen"). */
function describes(bullet: BodyBullet, key: string): boolean {
	return bullet.heads.some((h) => h === key || h.startsWith(key + " "));
}

export function collectRecipeContributions(
	body: string,
	frontmatter: Record<string, unknown>,
	settings: RecipeBoxSettings,
): ContributionMap {
	const contributions: ContributionMap = {};
	const add = (name: string, unit: string, quantity: number | null): void => {
		const key = ingredientKey(name, unit);
		if (!contributions[key]) {
			contributions[key] = { name, unit, quantity };
		} else if (quantity !== null && contributions[key].quantity !== null) {
			contributions[key] = { ...contributions[key], quantity: contributions[key].quantity + quantity };
		}
	};

	const text = stripFrontmatter(body);
	const headingRe = new RegExp(`^#{1,6}\\s+${escapeRegex(settings.ingredientsHeading)}\\s*$`, "i");
	const nextHeadingRe = /^#{1,6}\s/;

	// 1. Explicit ingredients section.
	let inSection = false;
	let sawSection = false;
	for (const line of text.split("\n")) {
		if (headingRe.test(line)) { inSection = true; sawSection = true; continue; }
		if (inSection && nextHeadingRe.test(line)) break;
		if (inSection) {
			const p = parseIngredientLine(line);
			if (p?.name && !hasIgnoreTag(p.tags, settings.ignoreIngredientTag)) add(p.name, p.unit, p.quantity);
		}
	}
	if (sawSection) return contributions;

	// 2. Curated frontmatter list, quantities and ignore-tags read from the body.
	const listRaw = findValue(frontmatter, [settings.ingredientsListProperty, "ingredientes", "ingredients"]);
	if (!Array.isArray(listRaw)) return contributions;

	const bullets = bodyBullets(text, settings);
	for (const raw of listRaw) {
		if (typeof raw !== "string") continue;
		const name = stripWikilink(raw.trim());
		const key = normaliseName(name);
		if (!key) continue;
		if (bullets.some((b) => b.ignored && describes(b, key))) continue;
		const matches = bullets.filter((b) => !b.ignored && describes(b, key));
		if (matches.length === 0) { add(name, "", null); continue; }
		for (const m of matches) add(name, m.unit, m.quantity);
	}
	return contributions;
}
