/**
 * Registers debounced vault event listeners that trigger a GroceryManager refresh
 * when the meal plan or grocery list notes are modified, deleted, or renamed.
 */
import { TFile } from "obsidian";
import RecipeBoxPlugin from "../main";
import { debounce } from "../utils/debounce";
import { resolveNotePath } from "../utils/vault-notes";

export function registerVaultWatchers(plugin: RecipeBoxPlugin): void {
	// A meal-plan-note edit must run the note -> grocery auto-add, not just a
	// grocery rebuild -- otherwise a recipe typed straight into the note never
	// reaches the shopping list unless the grocery view is later opened.
	const syncMealPlan = debounce(() => { void plugin.manager.syncFromMealPlanNote(); }, 500, true);
	const refreshGrocery = debounce(() => { void plugin.manager.refresh(); }, 300, true);

	plugin.registerEvent(
		plugin.app.vault.on("modify", (file) => {
			if (!(file instanceof TFile)) return;
			if (file.path === resolveNotePath(plugin.settings.mealPlanPath)) {
				syncMealPlan();
			} else if (file.path === resolveNotePath(plugin.settings.groceryListPath)) {
				refreshGrocery();
			}
		})
	);

	plugin.registerEvent(
		plugin.app.vault.on("delete", () => { void plugin.manager.refresh(); })
	);

	plugin.registerEvent(
		plugin.app.vault.on("rename", () => { void plugin.manager.refresh(); })
	);
}
