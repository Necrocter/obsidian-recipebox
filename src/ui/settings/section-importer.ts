/**
 * Settings section for the recipe importer — default save folder and optional
 * custom Markdown template path.
 */
import { App, Setting } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { NotePathSuggest } from "../components/note-path-suggest";
import { FolderSuggest } from "../components/folder-suggest";

export function renderSectionImporter(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	_rerender: () => void,
	app: App
): void {
	new Setting(container)
		.setName(t("set.importer.templatePath.name"))
		.setDesc(t("set.importer.templatePath.desc"))
		.addText((c) => {
			c.setValue(settings.importerTemplatePath).onChange(async (v) => {
				settings.importerTemplatePath = v.trim();
				await save();
			});
			new NotePathSuggest(app, c.inputEl);
		});

	new Setting(container)
		.setName(t("set.importer.defaultFolder.name"))
		.setDesc(t("set.importer.defaultFolder.desc"))
		.addText((c) => {
			c.setValue(settings.importerDefaultFolder).onChange(async (v) => {
				settings.importerDefaultFolder = v.trim();
				await save();
			});
			new FolderSuggest(app, c.inputEl);
		});
}
