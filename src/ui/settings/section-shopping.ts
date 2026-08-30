/**
 * Settings section for shopping list behaviour — grouping mode, category source,
 * auto-sort, manual order, category overrides, and auto-collapse.
 */
import { App, Setting } from "obsidian";
import { t } from "../../i18n";
import { GroupingMode, CategorySource } from "../../types";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { CategoryOrderModal } from "../modals/modal-category-order";
import { CategoryOverridesModal } from "../modals/modal-category-overrides";

function groupingOptions(): Record<GroupingMode, string> {
	return {
		category: t("set.shop.group.category"), recipe: t("set.shop.group.recipe"),
		source: t("set.shop.group.source"), none: t("set.shop.group.none"),
	};
}
function categorySourceOptions(): Record<CategorySource, string> {
	return {
		dictionary: t("set.shop.source.dictionary"),
		tag: t("set.shop.source.tag"),
		"tag-then-dictionary": t("set.shop.source.tagThenDictionary"),
	};
}

export function renderSectionShopping(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void,
	app: App,
	getKnownCategories: () => string[],
): void {
	new Setting(container).setName(t("set.shopping.title")).setHeading();

	new Setting(container)
		.setName(t("set.shop.defaultGrouping"))
		.addDropdown((dd) =>
			dd.addOptions(groupingOptions()).setValue(settings.groupingMode)
				.onChange(async (v) => { settings.groupingMode = v as GroupingMode; await save(); })
		);

	new Setting(container)
		.setName(t("set.shop.categorySource"))
		.addDropdown((dd) =>
			dd.addOptions(categorySourceOptions()).setValue(settings.categorySource)
				.onChange(async (v) => { settings.categorySource = v as CategorySource; await save(); })
		);

	new Setting(container)
		.setName(t("set.shop.autoSort"))
		.addToggle((c) =>
			c.setValue(settings.autoSortCategories).onChange(async (v) => {
				settings.autoSortCategories = v;
				await save();
				rerender();
			})
		);

	if (!settings.autoSortCategories) {
		new Setting(container)
			.setName(t("set.shop.categoryOrder.name"))
			.setDesc(t("set.shop.categoryOrder.desc"))
			.addButton((btn) =>
				btn.setButtonText(t("set.shop.categoryOrder.button")).onClick(() => {
					new CategoryOrderModal(app, settings, save).open();
				})
			);
	}

	new Setting(container)
		.setName(t("set.shop.autoCollapse"))
		.addToggle((c) =>
			c.setValue(settings.autoCollapseCompletedSections).onChange(async (v) => {
				settings.autoCollapseCompletedSections = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.shop.overrides.name"))
		.setDesc(t("set.shop.overrides.desc"))
		.addButton((btn) =>
			btn.setButtonText(t("set.shop.overrides.button")).onClick(() => {
				new CategoryOverridesModal(app, settings, save, getKnownCategories).open();
			})
		);
}
