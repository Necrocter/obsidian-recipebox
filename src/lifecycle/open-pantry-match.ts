/**
 * Builds the PantryMatchModal's dependency object from the live plugin and
 * opens it. Shared by the command and the dashboard quick-action so the
 * wiring lives in one place.
 */
import { TFile } from "obsidian";
import RecipeBoxPlugin from "../main";
import { PantryMatchModal } from "../ui/modals/pantry-match-modal";
import { listMarkdownFilesInRecipeFolders } from "../utils/vault-markdown-files";
import { isRecipeFile } from "./recipe-file-detection";
import { resolveNotePath } from "../utils/vault-notes";
import { RECIPE_VIEW_TYPE } from "../ui/recipe-view/recipe-view";
import { ingredientKey } from "../parser/ingredient-clean";
import { ContributionMap } from "../types";

export function openPantryMatchModal(plugin: RecipeBoxPlugin): void {
	new PantryMatchModal(plugin.app, {
		getSettings: () => plugin.settings,
		listRecipeFiles: () =>
			listMarkdownFilesInRecipeFolders(plugin.app, plugin.settings)
				.filter((f) => isRecipeFile(plugin.app, f, plugin.settings)),
		openRecipe: (file: TFile) => {
			const leaf = plugin.app.workspace.getLeaf(false);
			void leaf.setViewState({ type: RECIPE_VIEW_TYPE, state: { file: file.path }, active: true });
		},
		addToGrocery: async (names: string[]) => {
			const map: ContributionMap = {};
			for (const name of names) {
				map[ingredientKey(name, "")] = { name, unit: "", quantity: null };
			}
			// "manual" source: these are a deliberate one-off add, not tied to a
			// meal-plan entry, so they must not vanish when a recipe is unscheduled.
			await plugin.manager.addToGroceryOnly(map, { kind: "manual" }, false);
		},
		openPantryNote: async () => {
			const path = resolveNotePath(plugin.settings.pantryNotePath);
			let file = plugin.app.vault.getFileByPath(path);
			if (!file) file = await plugin.app.vault.create(path, "# Despensa\n\n");
			await plugin.app.workspace.getLeaf("tab").openFile(file);
		},
	}).open();
}
