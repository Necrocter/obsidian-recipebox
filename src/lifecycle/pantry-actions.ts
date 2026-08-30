/**
 * Pantry-note actions wired to the live plugin: open the "what can I cook?"
 * matcher, add items to the pantry, and sync it from the checked-off grocery
 * list. Shared by the commands and the dashboard quick-action.
 */
import { Notice, TFile } from "obsidian";
import RecipeBoxPlugin from "../main";
import { PantryMatchModal } from "../ui/modals/pantry-match-modal";
import { PantryAddModal } from "../ui/modals/pantry-add-modal";
import { listMarkdownFilesInRecipeFolders } from "../utils/vault-markdown-files";
import { isRecipeFile } from "./recipe-file-detection";
import { resolveNotePath } from "../utils/vault-notes";
import { RECIPE_VIEW_TYPE } from "../ui/recipe-view/recipe-view";
import { ingredientKey } from "../parser/ingredient-clean";
import { addToPantry } from "../parser/pantry-note";
import { t, tPlural } from "../i18n";
import { ContributionMap } from "../types";

/** Read the pantry note (creating it if absent) and return [file, text]. */
async function loadPantry(plugin: RecipeBoxPlugin): Promise<{ file: TFile; text: string }> {
	const path = resolveNotePath(plugin.settings.pantryNotePath);
	let file = plugin.app.vault.getFileByPath(path);
	if (!file) file = await plugin.app.vault.create(path, "# Pantry\n\n");
	return { file, text: await plugin.app.vault.read(file) };
}

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
			// "manual" source: a deliberate one-off add, not tied to a meal-plan
			// entry, so it must not vanish when a recipe is unscheduled.
			await plugin.manager.addToGroceryOnly(map, { kind: "manual" }, false);
		},
		openPantryNote: async () => {
			const { file } = await loadPantry(plugin);
			await plugin.app.workspace.getLeaf("tab").openFile(file);
		},
	}).open();
}

/** Command: type ingredients, append them to the pantry as had. */
export function openPantryAddModal(plugin: RecipeBoxPlugin): void {
	new PantryAddModal(plugin.app, async (names) => {
		const { file, text } = await loadPantry(plugin);
		const { text: next, added, ticked } = addToPantry(text, names);
		if (added + ticked === 0) { new Notice(t("notice.pantryNothingToAdd")); return; }
		await plugin.app.vault.modify(file, next);
		new Notice(tPlural("notice.pantryAdded.one", "notice.pantryAdded.other", added + ticked));
	}).open();
}

/** Command: mark every checked-off grocery item as had in the pantry. */
export async function syncPantryFromGrocery(plugin: RecipeBoxPlugin): Promise<void> {
	const names = plugin.manager.groceryItems.filter((i) => i.checked).map((i) => i.name);
	if (names.length === 0) { new Notice(t("notice.pantryNoChecked")); return; }
	const { file, text } = await loadPantry(plugin);
	const { text: next, added, ticked } = addToPantry(text, names);
	if (added + ticked === 0) { new Notice(t("notice.pantryNothingToAdd")); return; }
	await plugin.app.vault.modify(file, next);
	new Notice(tPlural("notice.pantrySynced.one", "notice.pantrySynced.other", added + ticked));
}
