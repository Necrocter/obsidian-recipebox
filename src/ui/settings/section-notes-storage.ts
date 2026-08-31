/**
 * Settings section for note storage — meal plan note path, grocery list note
 * path, and the ingredients/instructions heading names.
 */
import { App, Setting } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { localeDefault } from "../../settings/locale-defaults";
import { NotePathSuggest } from "../components/note-path-suggest";
import { renderNotePathPreview } from "../components/note-path-preview";

export function renderSectionNotesStorage(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void,
	app: App
): void {
	new Setting(container).setName(t("set.notes.title")).setHeading();

	const mealPlanPathSetting = new Setting(container)
		.setName(t("set.notes.mealPlanPath.name"))
		.setDesc(t("set.notes.mealPlanPath.descLong"));

	const mealPlanPathPreview = renderNotePathPreview(mealPlanPathSetting.descEl, settings.mealPlanPath);

	mealPlanPathSetting.addText((c) => {
		c.setValue(settings.mealPlanPath).onChange(async (v) => {
			settings.mealPlanPath = v;
			mealPlanPathPreview.update(v);
			await save();
		});
		new NotePathSuggest(app, c.inputEl);
	});

	const groceryListPathSetting = new Setting(container)
		.setName(t("set.notes.groceryListPath.name"))
		.setDesc(t("set.notes.groceryListPath.descLong"));

	const groceryListPathPreview = renderNotePathPreview(groceryListPathSetting.descEl, settings.groceryListPath);

	groceryListPathSetting.addText((c) => {
		c.setValue(settings.groceryListPath).onChange(async (v) => {
			settings.groceryListPath = v;
			groceryListPathPreview.update(v);
			await save();
		});
		new NotePathSuggest(app, c.inputEl);
	});

	new Setting(container)
		.setName(t("set.notes.ingredientsHeading.name"))
		.setDesc(t("set.notes.ingredientsHeading.desc"))
		.addText((c) =>
			c.setValue(settings.ingredientsHeading).onChange(async (v) => {
				settings.ingredientsHeading = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.notes.instructionsHeading.name"))
		.setDesc(t("set.notes.instructionsHeading.desc"))
		.addText((c) =>
			c.setValue(settings.instructionsHeading).onChange(async (v) => {
				settings.instructionsHeading = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.notes.notesHeading.name"))
		.setDesc(t("set.notes.notesHeading.desc"))
		.addText((c) =>
			c.setValue(settings.notesHeading).onChange(async (v) => {
				settings.notesHeading = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.notes.ignoreTag.name"))
		.setDesc(t("set.notes.ignoreTag.desc"))
		.addText((c) =>
			c.setValue(settings.ignoreIngredientTag).onChange(async (v) => {
				settings.ignoreIngredientTag = v.trim() || localeDefault("ignoreIngredientTag");
				await save();
			})
		);
}
