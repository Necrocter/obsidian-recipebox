import { describe, it, expect } from "vitest";
import { categorize } from "../../src/grocery/category-match";
import type { CategoryOverride } from "../../src/types";

describe("categorize", () => {
	it("uses the built-in dictionary by default", () => {
		expect(categorize("chicken breast", [], [], "dictionary")).toBe("Meat");
	});

	it("prefers the longest dictionary keyword match", () => {
		// "chicken breast" (Meat, len 14) should beat "chicken" (Poultry-ish/Meat, len 7)
		expect(categorize("boneless chicken breast", [], [], "dictionary")).toBe("Meat");
	});

	it("falls back to 'Other' when nothing matches", () => {
		expect(categorize("xyzzy unknown item", [], [], "dictionary")).toBe("Other");
	});

	it("prioritizes user overrides over the dictionary, longest match wins", () => {
		const overrides: CategoryOverride[] = [
			{ match: "flour", category: "Custom Baking" },
			{ match: "almond flour", category: "Custom Nuts" },
		];
		expect(categorize("almond flour", [], overrides, "dictionary")).toBe("Custom Nuts");
		expect(categorize("all-purpose flour", [], overrides, "dictionary")).toBe("Custom Baking");
	});

	it("uses tag-based resolution when source is 'tag'", () => {
		expect(categorize("something", ["produce"], [], "tag")).toBe("Produce");
	});

	it("falls back to 'Other' for 'tag' source when there are no usable tags", () => {
		expect(categorize("chicken breast", [], [], "tag")).toBe("Other");
	});

	it("falls back to the dictionary for 'tag-then-dictionary' when there are no tags", () => {
		expect(categorize("chicken breast", [], [], "tag-then-dictionary")).toBe("Meat");
	});

	it("prefers a tag match over the dictionary for 'tag-then-dictionary'", () => {
		expect(categorize("chicken breast", ["produce"], [], "tag-then-dictionary")).toBe("Produce");
	});

	describe("Spanish ingredient names", () => {
		const cat = (name: string) => categorize(name, [], [], "dictionary");

		it("categorises common Spanish produce, meat, dairy and staples", () => {
			expect(cat("jitomate")).toBe("Produce");
			expect(cat("cebolla mediana")).toBe("Produce");
			expect(cat("ajo")).toBe("Produce");
			expect(cat("carne molida")).toBe("Meat");
			expect(cat("filete de res")).toBe("Meat");
			expect(cat("huevo")).toBe("Egg");
			expect(cat("hierbabuena")).toBe("Herb");
			expect(cat("leche entera")).toBe("Dairy");
			expect(cat("queso panela")).toBe("Cheese");
			expect(cat("aceite de oliva")).toBe("Oil");
			expect(cat("sal")).toBe("Seasoning");
			expect(cat("azúcar de coco")).toBe("Baking");
			expect(cat("crema de cacahuate")).toBe("Nuts & Seeds");
			expect(cat("totopos")).toBe("Snack");
		});

		it("does not put 'chile chipotle' in Snack via the 'chip' substring", () => {
			expect(cat("chile chipotle")).toBe("Produce");
			expect(cat("chile")).toBe("Produce");
		});
	});
});
