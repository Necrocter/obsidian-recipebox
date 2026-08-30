import { describe, it, expect, vi, afterEach } from "vitest";

// locale-defaults -> i18n -> getLanguage() from obsidian, unresolvable in Node.
vi.mock("obsidian", () => ({ getLanguage: () => "" }));

import { setActiveLanguage } from "../../src/i18n";
import { localeDefault, localeDefaultRecipeFolders } from "../../src/settings/locale-defaults";
import { mergeSettings } from "../../src/lifecycle/settings-persistence";

afterEach(() => setActiveLanguage("en"));

describe("localeDefault", () => {
	it("returns the English name by default", () => {
		setActiveLanguage("en");
		expect(localeDefault("pantryNotePath")).toBe("Pantry.md");
		expect(localeDefault("ingredientsHeading")).toBe("Ingredients");
		expect(localeDefaultRecipeFolders()).toEqual(["Recipes"]);
	});

	it("follows the active language", () => {
		setActiveLanguage("es");
		expect(localeDefault("pantryNotePath")).toBe("Despensa.md");
		expect(localeDefault("ingredientsHeading")).toBe("Ingredientes");
		expect(localeDefault("ignoreIngredientTag")).toBe("ignorar-ingrediente");
		expect(localeDefaultRecipeFolders()).toEqual(["Recetas"]);
	});
});

describe("mergeSettings — locale-aware fallbacks", () => {
	it("a fresh Spanish vault gets Spanish note names, headings and folders", () => {
		const s = mergeSettings({ language: "es" });
		expect(s.pantryNotePath).toBe("Despensa.md");
		expect(s.mealPlanPath).toBe("Plan de comidas.md");
		expect(s.groceryListPath).toBe("Lista de la compra.md");
		expect(s.ingredientsHeading).toBe("Ingredientes");
		expect(s.instructionsHeading).toBe("Instrucciones");
		expect(s.notesHeading).toBe("Notas");
		expect(s.cookHistoryHeading).toBe("Historial de preparaciones");
		expect(s.ignoreIngredientTag).toBe("ignorar-ingrediente");
		expect(s.recipeFolders).toEqual(["Recetas"]);
		expect(s.importerDefaultFolder).toBe("Recetas");
		expect(s.exportFolder).toBe("Exportaciones de recetas");
	});

	it("an explicitly set value always wins over the locale default", () => {
		const s = mergeSettings({ language: "es", pantryNotePath: "Cocina/Inventario.md", recipeFolders: ["Comida"] });
		expect(s.pantryNotePath).toBe("Cocina/Inventario.md");
		expect(s.recipeFolders).toEqual(["Comida"]);
	});

	it("English / unset language still yields the English defaults", () => {
		const s = mergeSettings({});
		expect(s.pantryNotePath).toBe("Pantry.md");
		expect(s.ingredientsHeading).toBe("Ingredients");
		expect(s.recipeFolders).toEqual(["Recipes"]);
	});
});
