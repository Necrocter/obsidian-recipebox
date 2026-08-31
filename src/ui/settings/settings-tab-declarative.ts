/**
 * Declarative settings definitions for Obsidian 1.13+.
 * Uses controls where possible and targeted render callbacks for complex UI.
 */
import { App, Setting, SettingDefinitionItem } from "obsidian";
import RecipeBoxPlugin from "../../main";
import { t } from "../../i18n";
import { SUPPORTED_LANGUAGES } from "../../i18n";
import { renderSectionLibrary } from "./section-library";
import { renderSectionRecipeView } from "./section-recipe-view";
import { renderSectionShopping } from "./section-shopping";
import { renderSectionSuggester } from "./section-suggester";
import { renderSectionHealthSafety } from "./section-health-safety";
import { renderSectionPropertyNames } from "./section-property-names";

// Built lazily via getters so the strings resolve in the active locale at the
// moment the settings tab renders, not at module load.
function mealNotationOptions(): Record<string, string> {
	return {
		tag: t("set.opt.mealNotation.tag"),
		dataview: t("set.opt.mealNotation.dataview"),
		text: t("set.opt.mealNotation.text"),
	};
}

function timerRangeOptions(): Record<string, string> {
	return { min: t("set.opt.timerRange.min"), max: t("set.opt.timerRange.max") };
}

function nutritionDisplayOptions(): Record<string, string> {
	return { "per-serving": t("set.opt.nutritionDisplay.perServing"), total: t("set.opt.nutritionDisplay.total") };
}

function nutritionSourceOptions(): Record<string, string> {
	return { "per-serving": t("set.opt.nutritionSource.perServing"), "recipe-total": t("set.opt.nutritionSource.recipeTotal") };
}

function exportFormatOptions(): Record<string, string> {
	return {
		"plain-markdown": t("set.opt.exportFormat.plainMarkdown"),
		"importable-markdown": t("set.opt.exportFormat.importableMarkdown"),
		json: "JSON",
		"json-ld": "JSON-LD",
	};
}

function languageOptions(): Record<string, string> {
	const labels: Record<string, string> = {
		auto: t("set.opt.language.auto"),
		en: t("set.opt.language.en"),
		es: t("set.opt.language.es"),
	};
	return Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, labels[l]]));
}

interface DeclarativeSettingsContext {
	app: App;
	plugin: RecipeBoxPlugin;
	containerEl: HTMLElement;
}

function renderLegacySectionInDeclarative(
	ctx: DeclarativeSettingsContext,
	setting: Setting,
	renderSection: (containerEl: HTMLElement, save: () => Promise<void>, rerender: () => void) => void,
): void {
	setting.settingEl.addClass("rb-settings-declarative-legacy-row");
	setting.nameEl.empty();
	setting.descEl.empty();
	setting.infoEl.empty();
	setting.controlEl.empty();

	const save = async (): Promise<void> => {
		await ctx.plugin.saveSettings();
	};

	const mount = (): void => {
		setting.controlEl.empty();
		const mountEl = setting.controlEl.createDiv({ cls: "rb-settings-declarative-legacy-mount" });
		renderSection(mountEl, save, rerender);
	};

	const rerender = (): void => {
		const scrollTop = ctx.containerEl.scrollTop;
		mount();
		ctx.containerEl.scrollTop = scrollTop;
	};

	mount();
}

export function buildDeclarativeSettingDefinitions(
	ctx: DeclarativeSettingsContext,
): SettingDefinitionItem[] {
	return [
		{
			type: "page",
			name: t("set.language.title"),
			desc: t("set.language.desc"),
			items: [
				{
					name: t("set.language.field.name"),
					desc: t("set.language.field.desc"),
					aliases: ["language", "idioma", "locale", "spanish", "espanol"],
					control: { type: "dropdown", key: "language", options: languageOptions() },
				},
			],
		},
		{
			type: "page",
			name: t("set.library.title"),
			desc: t("set.library.desc"),
			items: [
				{
					name: t("set.library.row"),
					aliases: ["recipe folders", "recipe type", "folder click gallery", "dashboard"],
					render: (setting) => {
						renderLegacySectionInDeclarative(ctx, setting, (containerEl, save, rerender) => {
							renderSectionLibrary(containerEl, ctx.plugin.settings, save, rerender, ctx.app);
						});
					},
				},
			],
		},
		{
			type: "page",
			name: t("set.notes.title"),
			desc: t("set.notes.desc"),
			items: [
				{
					name: t("set.notes.mealPlanPath.name"),
					desc: t("set.notes.mealPlanPath.desc"),
					aliases: ["meal plan path", "meal plan note", "meal plans"],
					control: { type: "text", key: "mealPlanPath" },
				},
				{
					name: t("set.notes.groceryListPath.name"),
					desc: t("set.notes.groceryListPath.desc"),
					aliases: ["grocery path", "shopping list note", "groceries"],
					control: { type: "text", key: "groceryListPath" },
				},
				{
					name: t("set.notes.ingredientsHeading.name"),
					desc: t("set.notes.ingredientsHeading.desc"),
					control: { type: "text", key: "ingredientsHeading" },
				},
				{
					name: t("set.notes.instructionsHeading.name"),
					desc: t("set.notes.instructionsHeading.desc"),
					control: { type: "text", key: "instructionsHeading" },
				},
				{
					name: t("set.notes.notesHeading.name"),
					desc: t("set.notes.notesHeading.desc"),
					control: { type: "text", key: "notesHeading" },
				},
				{
					name: t("set.notes.ignoreTag.name"),
					desc: t("set.notes.ignoreTag.desc"),
					aliases: ["ignore ingredient", "exclude ingredient", "ignorar ingrediente"],
					control: { type: "text", key: "ignoreIngredientTag" },
				},
				{
					name: t("set.notes.pantryPath.name"),
					desc: t("set.notes.pantryPath.desc"),
					aliases: ["pantry", "despensa", "what can i cook"],
					control: { type: "text", key: "pantryNotePath" },
				},
			],
		},
		{
			type: "page",
			name: t("set.recipeView.title"),
			desc: t("set.recipeView.desc"),
			items: [
				{
					name: t("set.recipeView.row"),
					aliases: ["badges", "tags", "desktop layout", "default image"],
					render: (setting) => {
						renderLegacySectionInDeclarative(ctx, setting, (containerEl, save, rerender) => {
							renderSectionRecipeView(containerEl, ctx.plugin.settings, save, rerender, ctx.app, () => ctx.plugin.discoveryCache.get());
						});
					},
				},
			],
		},
		{
			type: "page",
			name: t("set.cooking.title"),
			desc: t("set.cooking.desc"),
			items: [
				{
					name: t("set.cooking.track.name"),
					desc: t("set.cooking.track.desc"),
					aliases: ["cook history", "tracking"],
					control: { type: "toggle", key: "cookHistoryEnabled" },
				},
				{
					name: t("set.cooking.heading.name"),
					desc: t("set.cooking.heading.desc"),
					visible: () => ctx.plugin.settings.cookHistoryEnabled,
					control: { type: "text", key: "cookHistoryHeading" },
				},
			],
		},
		{
			type: "page",
			name: t("set.mealPlan.title"),
			desc: t("set.mealPlan.desc"),
			items: [
				{
					name: t("set.mealPlan.notation.name"),
					desc: t("set.mealPlan.notation.desc"),
					control: { type: "dropdown", key: "mealTypeNotation", options: mealNotationOptions() },
				},
				{
					name: t("set.mealPlan.fieldName.name"),
					desc: t("set.mealPlan.fieldName.desc"),
					visible: () => ctx.plugin.settings.mealTypeNotation !== "text",
					control: { type: "text", key: "mealTypeFieldName" },
				},
				{
					name: t("set.mealPlan.autoAdd.name"),
					desc: t("set.mealPlan.autoAdd.desc"),
					control: { type: "toggle", key: "autoAddOnSync" },
				},
				{
					name: t("set.mealPlan.tagFilter.name"),
					desc: t("set.mealPlan.tagFilter.desc"),
					visible: () => ctx.plugin.settings.autoAddOnSync,
					control: { type: "text", key: "autoAddTagFilter" },
				},
			],
		},
		{
			type: "page",
			name: t("set.shopping.title"),
			desc: t("set.shopping.desc"),
			items: [
				{
					name: t("set.shopping.row"),
					aliases: ["category order", "category overrides", "grouping", "shopping"],
					render: (setting) => {
						renderLegacySectionInDeclarative(ctx, setting, (containerEl, save, rerender) => {
							renderSectionShopping(containerEl, ctx.plugin.settings, save, rerender, ctx.app, () => ctx.plugin.manager.getKnownCategories());
						});
					},
				},
			],
		},
		{
			type: "page",
			name: t("set.suggester.title"),
			desc: t("set.suggester.desc"),
			items: [
				{
					name: t("set.suggester.row"),
					aliases: ["suggester", "modes", "filters", "scoring"],
					render: (setting) => {
						renderLegacySectionInDeclarative(ctx, setting, (containerEl, save, rerender) => {
							renderSectionSuggester(containerEl, ctx.plugin.settings, save, rerender, ctx.app, () => ctx.plugin.discoveryCache.get());
						});
					},
				},
			],
		},
		{
			type: "page",
			name: t("set.timers.title"),
			desc: t("set.timers.desc"),
			items: [
				{
					name: t("set.timers.enable.name"),
					desc: t("set.timers.enable.desc"),
					control: { type: "toggle", key: "timersEnabled" },
				},
				{
					name: t("set.timers.autoStart.name"),
					visible: () => ctx.plugin.settings.timersEnabled,
					control: { type: "toggle", key: "timerAutoStart" },
				},
				{
					name: t("set.timers.compact.name"),
					visible: () => ctx.plugin.settings.timersEnabled,
					control: { type: "toggle", key: "timerCompactDisplay" },
				},
				{
					name: t("set.timers.rangeDefault.name"),
					desc: t("set.timers.rangeDefault.desc"),
					visible: () => ctx.plugin.settings.timersEnabled,
					control: { type: "dropdown", key: "timerRangeDefault", options: timerRangeOptions() },
				},
			],
		},
		{
			type: "page",
			name: t("set.nutrition.title"),
			desc: t("set.nutrition.desc"),
			items: [
				{
					name: t("set.nutrition.display.name"),
					desc: t("set.nutrition.display.desc"),
					control: { type: "dropdown", key: "nutritionDisplay", options: nutritionDisplayOptions() },
				},
				{
					name: t("set.nutrition.source.name"),
					desc: t("set.nutrition.source.desc"),
					control: { type: "dropdown", key: "nutritionSource", options: nutritionSourceOptions() },
				},
			],
		},
		{
			type: "page",
			name: t("set.health.title"),
			desc: t("set.health.desc"),
			items: [
				{
					name: t("set.health.row"),
					aliases: ["allergens", "meat temperature", "high gi", "gi dictionary"],
					render: (setting) => {
						renderLegacySectionInDeclarative(ctx, setting, (containerEl, save, rerender) => {
							renderSectionHealthSafety(containerEl, ctx.plugin.settings, save, rerender, ctx.app);
						});
					},
				},
			],
		},
		{
			type: "page",
			name: t("set.importer.title"),
			desc: t("set.importer.desc"),
			items: [
				{
					name: t("set.importer.templatePath.name"),
					desc: t("set.importer.templatePath.desc"),
					control: { type: "text", key: "importerTemplatePath" },
				},
				{
					name: t("set.importer.defaultFolder.name"),
					desc: t("set.importer.defaultFolder.desc"),
					control: { type: "text", key: "importerDefaultFolder" },
				},
			],
		},
		{
			type: "page",
			name: t("set.propNames.title"),
			desc: t("set.propNames.desc"),
			items: [
				{
					name: t("set.propNames.row"),
					aliases: ["frontmatter", "property names", "field names"],
					render: (setting) => {
						renderLegacySectionInDeclarative(ctx, setting, (containerEl, save, rerender) => {
							renderSectionPropertyNames(containerEl, ctx.plugin.settings, save, rerender);
						});
					},
				},
			],
		},
		{
			type: "page",
			name: t("set.export.title"),
			desc: t("set.export.desc"),
			items: [
				{
					name: t("set.export.folder.name"),
					desc: t("set.export.folder.desc"),
					control: { type: "text", key: "exportFolder" },
				},
				{
					name: t("set.export.format.name"),
					desc: t("set.export.format.desc"),
					control: { type: "dropdown", key: "recipeExportDefaultFormat", options: exportFormatOptions() },
				},
				{
					name: t("set.export.includeHistory.name"),
					control: { type: "toggle", key: "recipeExportIncludeCookHistoryDefault" },
				},
				{
					name: t("set.export.includeImages.name"),
					desc: t("set.export.includeImages.desc"),
					control: { type: "toggle", key: "recipeExportIncludeImagesDefault" },
				},
			],
		},
		{
			type: "page",
			name: t("set.sharing.title"),
			desc: t("set.sharing.desc"),
			items: [
				{
					name: t("set.sharing.serverUrl.name"),
					desc: t("set.sharing.serverUrl.desc"),
					control: {
						type: "text",
						key: "shareServerUrl",
						validate: (value: string) => value.trim().length > 0 ? undefined : t("set.sharing.serverUrlRequired"),
					},
				},
			],
		},
	];
}
