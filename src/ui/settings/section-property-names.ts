/**
 * Consolidated "Property names" settings section — every setting that maps a
 * plugin concept to a frontmatter key, gathered in one place.
 */
import { Setting } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { migrateModeFieldReferences } from "../../suggester/migrate-mode-fields";

export function renderSectionPropertyNames(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void
): void {
	renderBody(container, settings, save, rerender);
}

function renderBody(
	body: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void
): void {
	new Setting(body).setDesc(t("set.pn.intro"));

	new Setting(body)
		.setName(t("set.pn.recipeType.name"))
		.setDesc(t("set.pn.recipeType.desc"))
		.addText((c) =>
			c.setPlaceholder(t("set.pn.recipeType.placeholder")).setValue(settings.recipeTypePropertyName).onChange(async (v) => {
				settings.recipeTypePropertyName = v.trim() || "type";
				await save();
			})
		);

	new Setting(body)
		.setName(t("set.pn.rating.name"))
		.setDesc(t("set.pn.rating.desc"))
		.addText((c) => {
			c.setValue(settings.ratingProperty).onChange(async (v) => {
				settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.ratingProperty, v);
				settings.ratingProperty = v;
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	new Setting(body)
		.setName(t("set.pn.image.name"))
		.setDesc(t("set.pn.image.desc"))
		.addText((c) => {
			c.setValue(settings.imageProperty).onChange(async (v) => {
				settings.imageProperty = v.trim() || "image";
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	if (settings.cookHistoryEnabled) {
		new Setting(body)
			.setName(t("set.pn.lastMade.name"))
			.addText((c) => {
				c.setValue(settings.lastMadeProperty).onChange(async (v) => {
					settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.lastMadeProperty, v);
					settings.lastMadeProperty = v;
					await save();
				});
				c.inputEl.addEventListener("blur", () => rerender());
			});
	}

	if (settings.cookHistoryEnabled) {
		new Setting(body)
			.setName(t("set.pn.cookHistory.name"))
			.setDesc(t("set.pn.cookHistory.desc"))
			.addText((c) =>
				c.setValue(settings.cookHistoryFrontmatterProperty).onChange(async (v) => {
					settings.cookHistoryFrontmatterProperty = v.trim() || "cookHistory";
					await save();
				})
			);

		new Setting(body)
			.setName(t("set.pn.timesCooked.name"))
			.setDesc(t("set.pn.timesCooked.desc"))
			.addText((c) => {
				c.setValue(settings.cookedCountProperty).onChange(async (v) => {
					settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.cookedCountProperty, v);
					settings.cookedCountProperty = v;
					await save();
				});
				c.inputEl.addEventListener("blur", () => rerender());
			});
	}

	new Setting(body)
		.setName(t("set.pn.favorite.name"))
		.setDesc(t("set.pn.favorite.desc"))
		.addText((c) => {
			c.setValue(settings.favoriteProperty).onChange(async (v) => {
				settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.favoriteProperty, v);
				settings.favoriteProperty = v;
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	new Setting(body)
		.setName(t("set.pn.allergens.name"))
		.setDesc(t("set.pn.allergens.desc"))
		.addText((c) => {
			c.setValue(settings.allergensProperty).onChange(async (v) => {
				settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.allergensProperty, v);
				settings.allergensProperty = v;
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	new Setting(body)
		.setName(t("set.pn.diet.name"))
		.setDesc(t("set.pn.diet.desc"))
		.addText((c) => {
			c.setValue(settings.dietProperty).onChange(async (v) => {
				settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.dietProperty, v);
				settings.dietProperty = v;
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	new Setting(body)
		.setName(t("set.pn.servings.name"))
		.setDesc(t("set.pn.servings.desc"))
		.addText((c) => {
			c.setValue(settings.servingsProperty).onChange(async (v) => {
				settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.servingsProperty, v);
				settings.servingsProperty = v;
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	new Setting(body)
		.setName(t("set.pn.prepTime.name"))
		.setDesc(t("set.pn.prepTime.desc"))
		.addText((c) => {
			c.setValue(settings.prepTimeProperty).onChange(async (v) => {
				settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.prepTimeProperty, v);
				settings.prepTimeProperty = v;
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	new Setting(body)
		.setName(t("set.pn.cookTime.name"))
		.setDesc(t("set.pn.cookTime.desc"))
		.addText((c) => {
			c.setValue(settings.cookTimeProperty).onChange(async (v) => {
				settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.cookTimeProperty, v);
				settings.cookTimeProperty = v;
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	new Setting(body)
		.setName(t("set.pn.totalTime.name"))
		.setDesc(t("set.pn.totalTime.desc"))
		.addText((c) => {
			c.setValue(settings.totalTimeProperty).onChange(async (v) => {
				settings.suggesterModes = migrateModeFieldReferences(settings.suggesterModes, settings.totalTimeProperty, v);
				settings.totalTimeProperty = v;
				await save();
			});
			c.inputEl.addEventListener("blur", () => rerender());
		});

	const nutritionFields: Array<[string, keyof RecipeBoxSettings]> = [
		[t("set.pn.calories.name"), "caloriesProperty"],
		[t("set.pn.protein.name"), "proteinProperty"],
		[t("set.pn.fat.name"), "fatProperty"],
		[t("set.pn.carbs.name"), "carbsProperty"],
	];
	for (const [label, key] of nutritionFields) {
		new Setting(body)
			.setName(label)
			.addText((c) =>
				c.setValue(settings[key] as string).onChange(async (v) => {
					(settings as unknown as Record<string, string>)[key] = v;
					await save();
				})
			);
	}

	new Setting(body)
		.setName(t("set.pn.shareData.name"))
		.setDesc(t("set.pn.shareData.desc"))
		.addText((c) =>
			c.setValue(settings.shareDataProperty).onChange(async (v) => {
				settings.shareDataProperty = v.trim() || "recipe-share";
				await save();
			})
		);
}
