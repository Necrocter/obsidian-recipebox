import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("obsidian", () => ({ getLanguage: () => "" }));

import { setActiveLanguage } from "../../src/i18n";
import { categoryLabel, canonicalCategory } from "../../src/grocery/category-labels";

afterEach(() => setActiveLanguage("en"));

describe("categoryLabel / canonicalCategory", () => {
	it("localises a category key and is its own inverse", () => {
		setActiveLanguage("es");
		expect(categoryLabel("Produce")).toBe("Verduras y frutas");
		expect(categoryLabel("Snack")).toBe("Botanas");
		expect(categoryLabel("Nuts & Seeds")).toBe("Frutos secos y semillas");
		expect(canonicalCategory("Verduras y frutas")).toBe("Produce");
		expect(canonicalCategory(categoryLabel("Seasoning"))).toBe("Seasoning");
	});

	it("canonicalCategory accepts the English key and any language, any case", () => {
		setActiveLanguage("es");
		expect(canonicalCategory("Produce")).toBe("Produce");
		expect(canonicalCategory("BOTANAS")).toBe("Snack");
		expect(canonicalCategory("hogar")).toBe("Household");
	});

	it("passes unknown categories through untouched", () => {
		expect(categoryLabel("Mi categoría")).toBe("Mi categoría");
		expect(canonicalCategory("Mi categoría")).toBe("Mi categoría");
	});
});
