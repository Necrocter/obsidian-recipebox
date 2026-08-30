import { describe, it, expect } from "vitest";
import { collectRecipeContributions } from "../../src/meal-plan/recipe-contributions";
import { DEFAULT_SETTINGS } from "../../src/settings/settings-defaults";

const S = { ...DEFAULT_SETTINGS, ingredientsHeading: "Ingredientes", ignoreIngredientTag: "ignorar-ingrediente" };
const names = (m: ReturnType<typeof collectRecipeContributions>) => Object.values(m).map((c) => c.name).sort();

describe("collectRecipeContributions", () => {
	it("reads the body ingredients section when present, with quantities, skipping the ignore tag", () => {
		const body = [
			"# R", "", "## Ingredientes", "",
			"- *1 kg* carne molida",
			"- *2 dientes* ajo",
			"- sal #ignorar-ingrediente",
			"", "## Instrucciones", "1. ...",
		].join("\n");
		const out = collectRecipeContributions(body, { ingredientes: ["no", "usar", "esto"] }, S);
		expect(names(out)).toEqual(["ajo", "carne molida"]);
		expect(Object.values(out).find((c) => c.name === "carne molida")).toMatchObject({ unit: "kg", quantity: 1 });
	});

	it("falls back to the frontmatter list when there is no ingredients section", () => {
		const body = "# Ensalada\n\n### Ensalada\n- hinojo\n\n### Aderezo\n- aceite\n\n## Notas\n- nota";
		const out = collectRecipeContributions(body, { ingredientes: ["hinojo", "toronja", "queso feta", "menta fresca"] }, S);
		expect(names(out)).toEqual(["hinojo", "menta fresca", "queso feta", "toronja"]);
	});

	it("strips wikilinks and honours the ignore tag in the frontmatter fallback", () => {
		const out = collectRecipeContributions("# R\n\n## Notas\n", {
			ingredientes: ["[[carne molida]]", "chile chipotle", "sal #ignorar-ingrediente"],
		}, S);
		expect(names(out)).toEqual(["carne molida", "chile chipotle"]);
	});

	it("does not use the frontmatter fallback once a body section exists (even if empty)", () => {
		const body = "# R\n\n## Ingredientes\n\n## Instrucciones\n1. ...";
		const out = collectRecipeContributions(body, { ingredientes: ["ajo", "cebolla"] }, S);
		expect(names(out)).toEqual([]);
	});

	it("accepts the configured list property and the built-in fallbacks", () => {
		const custom = { ...S, ingredientsListProperty: "lista_ingredientes" };
		expect(names(collectRecipeContributions("# R\n", { lista_ingredientes: ["ajo"] }, custom))).toEqual(["ajo"]);
		expect(names(collectRecipeContributions("# R\n", { ingredients: ["garlic"] }, custom))).toEqual(["garlic"]);
	});
});
