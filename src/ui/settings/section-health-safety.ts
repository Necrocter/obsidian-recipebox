/**
 * Settings section for health and dietary safety — personal allergen list,
 * meat temperature warnings, high-GI warnings, and the GI pattern dictionary
 * editor.
 */
import { App, Setting } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { AllergensModal } from "../modals/modal-allergens";
import { GiDictionaryModal } from "../modals/modal-gi-dictionary";

export function renderSectionHealthSafety(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void,
	app: App
): void {
	new Setting(container)
		.setName(t("set.health.allergens.name"))
		.setDesc(t("set.health.allergens.desc", { list: settings.myAllergens.length > 0 ? settings.myAllergens.join(", ") : t("set.health.allergens.none") }))
		.addButton((btn) =>
			btn.setButtonText(t("set.health.allergens.button")).onClick(() => {
				new AllergensModal(app, settings, save).open();
			})
		);

	new Setting(container)
		.setName(t("set.health.meatTemp.name"))
		.setDesc(t("set.health.meatTemp.desc"))
		.addToggle((c) =>
			c.setValue(settings.showMeatTempWarnings).onChange(async (v) => {
				settings.showMeatTempWarnings = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.health.gi.name"))
		.setDesc(t("set.health.gi.desc"))
		.addToggle((c) =>
			c.setValue(settings.showHighGIWarnings).onChange(async (v) => {
				settings.showHighGIWarnings = v;
				await save();
				rerender();
			})
		);

	if (settings.showHighGIWarnings) {
		new Setting(container)
			.setName(t("set.health.giDict.name"))
			.setDesc(t("set.health.giDict.desc"))
			.addButton((btn) =>
				btn.setButtonText(t("set.health.giDict.button")).onClick(() => {
					new GiDictionaryModal(app, settings, save).open();
				})
			);
	}
}
