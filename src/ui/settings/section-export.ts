/**
 * Settings section for export: one shared destination folder plus per-format
 * defaults, so recipe, grocery, and future export features (meal plan, etc.)
 * configure "where things go" once instead of each accumulating its own
 * folder setting that drifts out of sync.
 */
import { App, Setting } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings, RecipeExportFormat } from "../../settings/settings-types";
import { FolderSuggest } from "../components/folder-suggest";

function recipeExportFormatLabels(): Record<RecipeExportFormat, string> {
	return {
		"plain-markdown": t("set.opt.exportFormat.plainMarkdown"),
		"importable-markdown": t("set.opt.exportFormat.importableMarkdown"),
		json: "JSON",
		"json-ld": "JSON-LD",
	};
}

export function renderSectionExport(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void,
	app: App,
): void {
	renderBody(container, settings, save, rerender, app);
}

function renderBody(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void,
	app: App
): void {
	new Setting(container)
		.setDesc(t("set.export.introLong"));

	new Setting(container)
		.setName(t("set.export.folder.name"))
		.setDesc(t("set.export.folder.descLong"))
		.addText((c) => {
			c.setValue(settings.exportFolder).onChange(async (v) => {
				settings.exportFolder = v;
				await save();
			});
			new FolderSuggest(app, c.inputEl);
		});


	new Setting(container).setName(t("set.export.recipeHeading")).setHeading();

	new Setting(container)
		.setName(t("set.export.format.name"))
		.addDropdown((dd) =>
			dd
				.addOptions(recipeExportFormatLabels())
				.setValue(settings.recipeExportDefaultFormat)
				.onChange(async (v) => {
					settings.recipeExportDefaultFormat = v as RecipeExportFormat;
					await save();
				})
		);

	new Setting(container)
		.setName(t("set.export.includeHistory.name"))
		.addToggle((c) =>
			c.setValue(settings.recipeExportIncludeCookHistoryDefault).onChange(async (v) => {
				settings.recipeExportIncludeCookHistoryDefault = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.export.includeImages.name"))
		.setDesc(t("set.export.includeImages.descLong"))
		.addToggle((c) =>
			c.setValue(settings.recipeExportIncludeImagesDefault).onChange(async (v) => {
				settings.recipeExportIncludeImagesDefault = v;
				await save();
			})
		);

	new Setting(container).setName(t("set.export.groceryHeading")).setHeading();


}
