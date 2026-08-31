/**
 * Settings section for meal plan configuration — meal type notation format,
 * auto-add on sync, and tag filter. The note path lives in the Notes section.
 */
import { Setting } from "obsidian";
import { t } from "../../i18n";
import { MealTypeNotation, RecipeBoxSettings } from "../../settings/settings-types";

export function renderSectionMealPlan(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void
): void {
	new Setting(container).setName(t("set.mealPlan.title")).setHeading();

	let fieldNameSetting: Setting | null = null;

	new Setting(container)
		.setName(t("set.mealPlan.notation.name"))
		.setDesc(t("set.mealPlan.notation.desc"))
		.addDropdown((d) => {
			d.addOption("tag", t("set.opt.mealNotation.tag"));
			d.addOption("dataview", t("set.opt.mealNotation.dataview"));
			d.addOption("text", t("set.opt.mealNotation.text"));
			d.setValue(settings.mealTypeNotation);
			d.onChange(async (v) => {
				settings.mealTypeNotation = v as MealTypeNotation;
				await save();
				fieldNameSetting?.settingEl.toggle(v !== "text");
			});
		});

	fieldNameSetting = new Setting(container)
		.setName(t("set.mealPlan.fieldName.name"))
		.setDesc(t("set.mealPlan.fieldName.descLong"))
		.addText((c) =>
			c.setValue(settings.mealTypeFieldName).onChange(async (v) => {
				settings.mealTypeFieldName = v.trim() || "meal";
				await save();
			})
		);
	fieldNameSetting.settingEl.toggle(settings.mealTypeNotation !== "text");

	new Setting(container)
		.setName(t("set.mealPlan.autoAdd.name"))
		.setDesc(t("set.mealPlan.autoAdd.descLong"))
		.addToggle((c) =>
			c.setValue(settings.autoAddOnSync).onChange(async (v) => {
				settings.autoAddOnSync = v;
				await save();
				rerender();
			})
		);

	if (!settings.autoAddOnSync) return;

	new Setting(container)
		.setName(t("set.mealPlan.tagFilter.name"))
		.setDesc(t("set.mealPlan.tagFilter.descLong"))
		.addText((c) =>
			c.setValue(settings.autoAddTagFilter).onChange(async (v) => {
				settings.autoAddTagFilter = v;
				await save();
			})
		);
}
