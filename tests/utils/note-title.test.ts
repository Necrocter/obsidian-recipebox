import { describe, it, expect } from "vitest";
import { noteTitleFromPath, isH1Line } from "../../src/utils/note-title";

describe("noteTitleFromPath", () => {
	it("strips folders and the .md extension", () => {
		expect(noteTitleFromPath("Plan de comida.md")).toBe("Plan de comida");
		expect(noteTitleFromPath("Cocina/Listas/Lista de compras.md")).toBe("Lista de compras");
		expect(noteTitleFromPath("Meal Plan.MD")).toBe("Meal Plan");
	});

	it("falls back to 'Untitled' for an empty-ish path", () => {
		expect(noteTitleFromPath("")).toBe("Untitled");
		expect(noteTitleFromPath(".md")).toBe("Untitled");
	});
});

describe("isH1Line", () => {
	it("matches a top-level heading only", () => {
		expect(isH1Line("# Meal Plan")).toBe(true);
		expect(isH1Line("   #   ")).toBe(true);
		expect(isH1Line("## Monday")).toBe(false);
		expect(isH1Line("- [ ] [[Pasta]]")).toBe(false);
		expect(isH1Line("#tag")).toBe(false);
	});
});
