/**
 * Opens a context menu for a specific meal plan entry in the recipe view,
 * providing navigate, edit, and remove actions.
 */
import { App, Menu, TFile } from "obsidian";
import { t } from "../../i18n";
import { MealPlanEntry } from "../../types";
import { RecipeViewDeps } from "../recipe-view/recipe-view-deps";

export function openMealPlanEntryMenu(
	event: MouseEvent,
	app: App,
	file: TFile,
	entry: MealPlanEntry,
	deps: RecipeViewDeps,
): void {
	const menu = new Menu();

	menu.addItem(item =>
		item.setTitle(t("modal.mpEntryMenu.viewInMealPlan"))
			.setIcon("calendar")
			.onClick(() => deps.openMealPlanView())
	);

	menu.addItem(item =>
		item.setTitle(t("modal.mpEntryMenu.changeDayMeal"))
			.setIcon("pencil")
			.onClick(() => {
				deps.openEditMealPlanEntry(file, entry, async (day, meal, isLeftovers) => {
					await deps.removeFromMealPlanById(entry.id);
					await deps.addToMealPlan(file.path, day, meal, entry.contributions, isLeftovers);
				});
			})
	);

	menu.addSeparator();

	menu.addItem(item =>
		item.setTitle(t("rview.removeFromMealPlan"))
			.setIcon("trash")
			.onClick(async () => { await deps.removeFromMealPlanById(entry.id); })
	);

	menu.showAtMouseEvent(event);
}
