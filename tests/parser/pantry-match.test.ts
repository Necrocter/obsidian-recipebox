import { describe, it, expect } from "vitest";
import { parsePantryNote, matchRecipe } from "../../src/parser/pantry-match";

describe("parsePantryNote", () => {
	it("collects normalised names from list items, ignoring headings and prose", () => {
		const text = [
			"# Despensa",
			"",
			"## Básicos",
			"- Sal",
			"* Aceite de oliva",
			"1. Ajo",
			"",
			"Esto es una nota, no un ingrediente",
			"> cita",
			"- [x] Cebolla morada",
			"- [ ] Perejil fresco",
		].join("\n");
		// "[ ]" (explicitly unchecked) does NOT count as available
		expect([...parsePantryNote(text)].sort()).toEqual(
			["aceite de oliva", "ajo", "cebolla morada", "sal"].sort(),
		);
	});

	it("strips a trailing parenthetical note and trailing tags", () => {
		const s = parsePantryNote("- Harina de trigo (media bolsa) #basico\n- Leche  #lacteo");
		expect([...s].sort()).toEqual(["harina de trigo", "leche"].sort());
	});

	it("returns an empty set for an empty note", () => {
		expect(parsePantryNote("").size).toBe(0);
		expect(parsePantryNote("# Solo un encabezado").size).toBe(0);
	});
});

describe("matchRecipe", () => {
	const pantry = new Set(["sal", "aceite de oliva", "ajo", "cebolla"]);

	it("splits a recipe's ingredients into covered and missing", () => {
		const { covered, missing } = matchRecipe(
			["Ajo", "cebolla", "carne molida", "pimienta negra"],
			pantry,
		);
		expect(covered.sort()).toEqual(["Ajo", "cebolla"].sort());
		expect(missing.sort()).toEqual(["carne molida", "pimienta negra"].sort());
	});

	it("collapses duplicate names and skips non-strings", () => {
		const { covered, missing } = matchRecipe(
			["ajo", "  ajo  ", 42, null, "jitomate"],
			pantry,
		);
		expect(covered).toEqual(["ajo"]);
		expect(missing).toEqual(["jitomate"]);
	});

	it("everything missing when the pantry is empty", () => {
		const { covered, missing } = matchRecipe(["ajo", "sal"], new Set());
		expect(covered).toEqual([]);
		expect(missing).toEqual(["ajo", "sal"]);
	});
});
