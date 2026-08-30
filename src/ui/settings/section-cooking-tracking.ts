/**
 * Settings section for cook history and tracking options. Two levels of
 * tracking are offered: simple stat toggles (last made date, cooked count),
 * and full cook history which supersedes them with a detailed log. Property/
 * heading names live in the consolidated "Property names" section.
 */
import { Setting } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";

export function renderSectionCookingTracking(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void
): void {
	new Setting(container).setName(t("set.cooking.title")).setHeading();

	new Setting(container)
		.setName(t("set.cooking.track.name"))
		.setDesc(t("set.cooking.track.descLong"))
		.addToggle((c) =>
			c.setValue(settings.cookHistoryEnabled).onChange(async (v) => {
				settings.cookHistoryEnabled = v;
				await save();
				rerender();
			})
		);

	if (settings.cookHistoryEnabled) {
		new Setting(container)
			.setName(t("set.cooking.heading.name"))
			.setDesc(t("set.cooking.heading.desc"))
			.addText((c) =>
				c.setValue(settings.cookHistoryHeading).onChange(async (v) => {
					settings.cookHistoryHeading = v;
					await save();
				})
			);
	}

}
