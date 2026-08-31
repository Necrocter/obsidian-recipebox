import { describe, it, expect } from "vitest";
import { collectRecipeContributions } from "../../src/meal-plan/recipe-contributions";
import { DEFAULT_SETTINGS } from "../../src/settings/settings-defaults";

const S = { ...DEFAULT_SETTINGS, ingredientsHeading: "Ingredientes", ignoreIngredientTag: "ignorar-ingrediente" };
const names = (m: ReturnType<typeof collectRecipeContributions>) => Object.values(m).map((c) => c.name).sort();
const byName = (m: ReturnType<typeof collectRecipeContributions>, n: string) => Object.values(m).find((c) => c.name === n);

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
		expect(byName(out, "carne molida")).toMatchObject({ unit: "kg", quantity: 1 });
	});

	it("uses the frontmatter list when there is no ingredients section, enriching quantities from the body bullets", () => {
		const body = [
			"---", "ingredientes:", "  - x", "---", "",
			"# Albóndigas", "", "---", "",
			"### Para las albóndigas",
			"- *1 kg* carne molida",
			"- *2 dientes* ajo",
			"- *1 pieza* huevo, crudo",
			"- sal al gusto #ignorar-ingrediente",
			"", "### Para la salsa",
			"- *7 piezas* jitomate",
			"- *1 pieza* cebolla mediana",
			"- *2 dientes* ajo",
			"- Knorr de jitomate al gusto (opcional) #ignorar-ingrediente",
			"- chile chipotle al gusto",
			"", "---", "", "1. ...",
		].join("\n");
		const fm = { ingredientes: ["carne molida", "ajo", "huevo", "sal", "jitomate", "cebolla", "Knorr de jitomate", "chile chipotle"] };
		const out = collectRecipeContributions(body, fm, S);
		expect(names(out)).toEqual(["ajo", "carne molida", "cebolla", "chile chipotle", "huevo", "jitomate"].sort());
		expect(byName(out, "carne molida")).toMatchObject({ unit: "kg", quantity: 1 });
		expect(byName(out, "ajo")).toMatchObject({ unit: "diente", quantity: 4 }); // 2 + 2
		expect(byName(out, "cebolla")).toMatchObject({ quantity: 1 }); // matched from "cebolla mediana"
		expect(byName(out, "chile chipotle")).toMatchObject({ quantity: null });
	});

	it("drops a frontmatter staple whose body bullet carries the ignore tag, even on a combined line", () => {
		const body = [
			"# R", "", "---", "",
			"- *4 piezas* pescado blanco",
			"- sal y pimienta negra al gusto #ignorar-ingrediente",
			"- *2 cucharadas* aceite de oliva",
			"", "---", "1. ...",
		].join("\n");
		const fm = { ingredientes: ["pescado blanco", "sal", "pimienta negra", "aceite de oliva"] };
		const out = collectRecipeContributions(body, fm, S);
		expect(names(out)).toEqual(["aceite de oliva", "pescado blanco"]);
	});

	it("strips wikilinks and adds a quantity-less entry when the body has no matching bullet", () => {
		const out = collectRecipeContributions("# R\n\n## Notas\n- nota", {
			ingredientes: ["[[carne molida]]", "chile chipotle"],
		}, S);
		expect(names(out)).toEqual(["carne molida", "chile chipotle"]);
		expect(byName(out, "carne molida")).toMatchObject({ quantity: null });
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
