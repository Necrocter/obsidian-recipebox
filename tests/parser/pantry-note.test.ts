import { describe, it, expect } from "vitest";
import { parsePantryItems, pantrySet, addToPantry } from "../../src/parser/pantry-note";

describe("parsePantryItems / pantrySet", () => {
	const text = [
		"# Pantry",
		"## Staples",
		"- [x] Sal",
		"- [X] Aceite de oliva",
		"- Harina",              // no checkbox => have
		"- [ ] Cilantro",        // explicitly out
		"* [x] Ajo",
		"1. [ ] Leche",
		"> nota, no cuenta",
		"prosa suelta tampoco",
	].join("\n");

	it("honours checkbox state, treating box-less items as had", () => {
		const items = parsePantryItems(text);
		expect(items.map(i => [i.name, i.have])).toEqual([
			["sal", true],
			["aceite de oliva", true],
			["harina", true],
			["cilantro", false],
			["ajo", true],
			["leche", false],
		]);
	});

	it("pantrySet returns only the had names", () => {
		expect([...pantrySet(text)].sort()).toEqual(["aceite de oliva", "ajo", "harina", "sal"].sort());
	});
});

describe("addToPantry", () => {
	it("ticks an existing unchecked item and appends genuinely new ones", () => {
		const before = "# Pantry\n\n- [x] sal\n- [ ] cilantro\n";
		const { text, added, ticked } = addToPantry(before, ["Cilantro", "Huevo", "sal"]);
		expect(ticked).toBe(1);
		expect(added).toBe(1);
		expect(text).toBe("# Pantry\n\n- [x] sal\n- [x] cilantro\n\n- [x] Huevo\n");
	});

	it("is a no-op when everything is already had", () => {
		const before = "- [x] sal\n- harina\n";
		const { text, added, ticked } = addToPantry(before, ["Sal", "harina"]);
		expect({ added, ticked }).toEqual({ added: 0, ticked: 0 });
		expect(text).toBe(before);
	});

	it("dedupes the input list", () => {
		const { added } = addToPantry("# Pantry\n", ["ajo", " ajo ", "AJO"]);
		expect(added).toBe(1);
	});
});
