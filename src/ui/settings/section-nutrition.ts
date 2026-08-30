/**
 * Settings section for nutrition display options — per-serving vs. total
 * display mode and value source. Property names live in the consolidated
 * "Property names" section.
 */
import { Setting } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings, NutritionDisplay, NutritionSource } from "../../settings/settings-types";

export function renderSectionNutrition(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	_rerender: () => void
): void {
	new Setting(container)
		.setName(t("set.nutrition.display.name"))
		.setDesc(t("set.nutrition.display.desc"))
		.addDropdown((dd) =>
			dd.addOptions({ "per-serving": t("set.opt.nutritionDisplay.perServing"), total: t("set.opt.nutritionDisplay.total") } satisfies Record<NutritionDisplay, string>)
				.setValue(settings.nutritionDisplay)
				.onChange(async (v) => { settings.nutritionDisplay = v as NutritionDisplay; await save(); })
		);

	new Setting(container)
		.setName(t("set.nutrition.source.name"))
		.setDesc(t("set.nutrition.source.desc"))
		.addDropdown((dd) =>
			dd.addOptions({ "per-serving": t("set.opt.nutritionSource.perServing"), "recipe-total": t("set.opt.nutritionSource.recipeTotal") } satisfies Record<NutritionSource, string>)
				.setValue(settings.nutritionSource)
				.onChange(async (v) => { settings.nutritionSource = v as NutritionSource; await save(); })
		);
}
