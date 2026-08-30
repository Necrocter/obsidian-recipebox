/**
 * Settings section for in-recipe timers — enable/disable, auto-start, compact
 * display, and range default.
 */
import { Setting } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";

export function renderSectionTimers(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void
): void {
	new Setting(container).setName(t("set.timers.title")).setHeading();

	new Setting(container)
		.setName(t("set.timers.enable.name"))
		.setDesc(t("set.timers.enable.desc"))
		.addToggle((c) =>
			c.setValue(settings.timersEnabled).onChange(async (v) => {
				settings.timersEnabled = v;
				await save();
				rerender();
			})
		);

	if (!settings.timersEnabled) return;

	new Setting(container)
		.setName(t("set.timers.autoStart.name"))
		.addToggle((c) =>
			c.setValue(settings.timerAutoStart).onChange(async (v) => {
				settings.timerAutoStart = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.timers.compact.name"))
		.addToggle((c) =>
			c.setValue(settings.timerCompactDisplay).onChange(async (v) => {
				settings.timerCompactDisplay = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.timers.rangeDefault.name"))
		.setDesc(t("set.timers.rangeDefault.desc"))
		.addDropdown((dd) =>
			dd
				.addOptions({ max: t("set.opt.timerRange.max"), min: t("set.opt.timerRange.min") })
				.setValue(settings.timerRangeDefault)
				.onChange(async (v) => {
					settings.timerRangeDefault = v as "min" | "max";
					await save();
				})
		);
}
