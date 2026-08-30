import { describe, it, expect } from "vitest";
import {
	stripListMarkers,
	extractInlineNotes,
	extractTrailingTags,
	stripMarkdownEmphasis,
	stripOf,
	normaliseName,
	ingredientKey,
	hasIgnoreTag,
} from "../../src/parser/ingredient-clean";

describe("stripListMarkers", () => {
	it("strips a leading bullet marker", () => {
		expect(stripListMarkers("- 2 cups flour")).toBe("2 cups flour");
		expect(stripListMarkers("* 2 cups flour")).toBe("2 cups flour");
	});

	it("strips a leading numbered-list marker", () => {
		expect(stripListMarkers("1. 2 cups flour")).toBe("2 cups flour");
	});

	it("strips a leading checkbox marker", () => {
		expect(stripListMarkers("- [ ] 2 cups flour")).toBe("2 cups flour");
		expect(stripListMarkers("- [x] 2 cups flour")).toBe("2 cups flour");
	});

	it("leaves a plain line unchanged", () => {
		expect(stripListMarkers("2 cups flour")).toBe("2 cups flour");
	});
});

describe("extractInlineNotes", () => {
	it("extracts a single parenthesised note", () => {
		expect(extractInlineNotes("flour (sifted)")).toEqual({ cleaned: "flour", note: "sifted" });
	});

	it("joins multiple notes with commas", () => {
		expect(extractInlineNotes("flour (sifted) (or all-purpose)")).toEqual({
			cleaned: "flour",
			note: "sifted, or all-purpose",
		});
	});

	it("handles nested parens as a single note", () => {
		expect(extractInlineNotes("sugar (white (granulated))")).toEqual({
			cleaned: "sugar",
			note: "white (granulated)",
		});
	});

	it("returns null note when there are no parens", () => {
		expect(extractInlineNotes("flour")).toEqual({ cleaned: "flour", note: null });
	});
});

describe("extractTrailingTags", () => {
	it("extracts trailing hashtags", () => {
		expect(extractTrailingTags("flour #pantry #baking")).toEqual({
			cleaned: "flour",
			tags: ["pantry", "baking"],
		});
	});

	it("returns no tags when there are none", () => {
		expect(extractTrailingTags("flour")).toEqual({ cleaned: "flour", tags: [] });
	});

	it("does not match a hash in the middle of the text", () => {
		expect(extractTrailingTags("flour #pantry more text")).toEqual({
			cleaned: "flour #pantry more text",
			tags: [],
		});
	});
});

describe("stripMarkdownEmphasis", () => {
	it("strips bold and italic markers", () => {
		expect(stripMarkdownEmphasis("**flour** and __sugar__")).toBe("flour and sugar");
	});

	it("strips paired single-asterisk emphasis around a RecipeMD amount", () => {
		expect(stripMarkdownEmphasis("*600g* flour")).toBe("600g flour");
		expect(stripMarkdownEmphasis("*1 clove* garlic")).toBe("1 clove garlic");
		expect(stripMarkdownEmphasis("*½* cup sugar")).toBe("½ cup sugar");
	});

	it("leaves single asterisks/underscores alone", () => {
		expect(stripMarkdownEmphasis("2*3 cups")).toBe("2*3 cups");
	});

	it("leaves an unpaired asterisk alone", () => {
		expect(stripMarkdownEmphasis("*flour")).toBe("*flour");
		expect(stripMarkdownEmphasis("flour *")).toBe("flour *");
	});
});

describe("stripOf", () => {
	it("strips a leading 'of'", () => {
		expect(stripOf("of sugar")).toBe("sugar");
		expect(stripOf("Of Sugar")).toBe("Sugar");
	});

	it("strips a leading Spanish 'de'", () => {
		expect(stripOf("de azúcar")).toBe("azúcar");
		expect(stripOf("De Harina")).toBe("Harina");
	});

	it("leaves text without a leading partitive unchanged", () => {
		expect(stripOf("sugar")).toBe("sugar");
		expect(stripOf("cream of tartar")).toBe("cream of tartar");
		expect(stripOf("diente de ajo")).toBe("diente de ajo");
	});
});

describe("normaliseName", () => {
	it("lowercases and collapses whitespace", () => {
		expect(normaliseName("  All-Purpose   Flour  ")).toBe("all-purpose flour");
	});

	it("trims dashes that sit at the very start/end of the string", () => {
		expect(normaliseName("--Flour--")).toBe("flour");
	});
});

describe("ingredientKey", () => {
	it("combines normalised name and lowercase unit", () => {
		expect(ingredientKey("Flour", "Cups")).toBe("flour|cups");
	});
});

describe("hasIgnoreTag", () => {
	const DEFAULT = "ignore-ingredient";

	it("detects the built-in ignore-ingredient tag regardless of separators/case", () => {
		expect(hasIgnoreTag(["ignore-ingredient"], DEFAULT)).toBe(true);
		expect(hasIgnoreTag(["IgnoreIngredient"], DEFAULT)).toBe(true);
		expect(hasIgnoreTag(["ignore_ingredient"], DEFAULT)).toBe(true);
	});

	it("detects a configured localised tag", () => {
		expect(hasIgnoreTag(["ignorar-ingrediente"], "ignorar-ingrediente")).toBe(true);
		expect(hasIgnoreTag(["IgnorarIngrediente"], "ignorar-ingrediente")).toBe(true);
	});

	it("still accepts the built-in English tag even when a custom one is configured", () => {
		expect(hasIgnoreTag(["ignore-ingredient"], "ignorar-ingrediente")).toBe(true);
	});

	it("returns false when the tag is absent", () => {
		expect(hasIgnoreTag(["pantry"], DEFAULT)).toBe(false);
		expect(hasIgnoreTag([], DEFAULT)).toBe(false);
	});

	it("works per-tag (used by the recipe view to hide only the control chip)", () => {
		// The recipe view now renders ignore-tagged ingredients, calling this
		// with a single-element array to decide which chip to suppress.
		expect(hasIgnoreTag(["produce"], DEFAULT)).toBe(false);
		expect(hasIgnoreTag(["ignore-ingredient"], DEFAULT)).toBe(true);
	});
});

describe("inline links", () => {
	it("keeps a link intact rather than reading its destination as a note", () => {
		expect(extractInlineNotes("[tomato sauce](sauce.md)")).toEqual({
			cleaned: "[tomato sauce](sauce.md)",
			note: null,
		});
	});

	it("still extracts a real note alongside a link", () => {
		expect(extractInlineNotes("[sauce](s.md) (warmed)")).toEqual({
			cleaned: "[sauce](s.md)",
			note: "warmed",
		});
	});

	it("keys a linked ingredient on its link text, per RecipeMD", () => {
		expect(ingredientKey("[tomato sauce](sauce.md)", "")).toBe(ingredientKey("Tomato Sauce", ""));
	});

	it("keys a wikilink on its page name or alias", () => {
		expect(ingredientKey("[[Tomato Sauce]]", "")).toBe("tomato sauce|");
		expect(ingredientKey("[[recipes/sauce|Tomato Sauce]]", "")).toBe("tomato sauce|");
	});
});
