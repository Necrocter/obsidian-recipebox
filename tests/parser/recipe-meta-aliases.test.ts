import { describe, it, expect } from "vitest";
import { getRecipeMetaAliases } from "../../src/parser/recipe-meta-aliases";
import { DEFAULT_SETTINGS } from "../../src/settings/settings-defaults";

describe("getRecipeMetaAliases", () => {
	it("puts the user-configured property name first", () => {
		const settings = { ...DEFAULT_SETTINGS, servingsProperty: "myServings" };
		expect(getRecipeMetaAliases(settings).servings[0]).toBe("myServings");
	});

	it("includes common fallback spellings", () => {
		const aliases = getRecipeMetaAliases(DEFAULT_SETTINGS);
		expect(aliases.servings).toEqual(expect.arrayContaining(["yield", "serves", "portions"]));
		expect(aliases.favorite).toEqual(expect.arrayContaining(["favourite", "starred"]));
	});

	it("exposes methods / equipment alias sets, user key first", () => {
		const aliases = getRecipeMetaAliases({ ...DEFAULT_SETTINGS });
		expect(aliases.methods[0]).toBe("metodos");
		expect(aliases.methods).toEqual(expect.arrayContaining(["methods", "method"]));
		expect(aliases.equipment[0]).toBe("equipo");
		expect(aliases.equipment).toEqual(expect.arrayContaining(["equipment", "tools", "utensils"]));

		const custom = getRecipeMetaAliases({ ...DEFAULT_SETTINGS, methodsProperty: "tecnicas", equipmentProperty: "utensilios" });
		expect(custom.methods[0]).toBe("tecnicas");
		expect(custom.equipment[0]).toBe("utensilios");
	});

	it("de-duplicates when the configured property matches a fallback", () => {
		const settings = { ...DEFAULT_SETTINGS, favoriteProperty: "favourite" };
		const aliases = getRecipeMetaAliases(settings);
		expect(aliases.favorite.filter((k) => k === "favourite")).toHaveLength(1);
	});

	it("trims whitespace and drops empty keys", () => {
		const settings = { ...DEFAULT_SETTINGS, servingsProperty: "  " };
		const aliases = getRecipeMetaAliases(settings);
		expect(aliases.servings).not.toContain("");
		expect(aliases.servings).not.toContain("  ");
	});
});
