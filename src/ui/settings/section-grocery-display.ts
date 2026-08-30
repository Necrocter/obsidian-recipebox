/**
 * Settings section for grocery list display — grouping mode and category
 * source selection.
 */
import { Setting } from "obsidian";
import { t } from "../../i18n";
import { GroupingMode, CategorySource, CategoryOverride } from "../../types";
import { RecipeBoxSettings } from "../../settings/settings-types";

function groupingOptions(): Record<GroupingMode, string> {
	return {
		category: t("set.shop.group.category"),
		recipe: t("set.shop.group.recipe"),
		source: t("set.shop.group.source"),
		none: t("set.shop.group.none"),
	};
}

function categorySourceOptions(): Record<CategorySource, string> {
	return {
		dictionary: t("set.shop.source.dictionary"),
		tag: t("set.shop.source.tag"),
		"tag-then-dictionary": t("set.shop.source.tagThenDictionary"),
	};
}

export function renderSectionGroceryDisplay(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void
): void {
	new Setting(container).setName(t("set.gd.title")).setHeading();

	new Setting(container)
		.setName(t("set.gd.groupingMode"))
		.addDropdown((dd) =>
			dd
				.addOptions(groupingOptions())
				.setValue(settings.groupingMode)
				.onChange(async (v) => {
					settings.groupingMode = v as GroupingMode;
					await save();
				})
		);

	new Setting(container)
		.setName(t("set.shop.categorySource"))
		.addDropdown((dd) =>
			dd
				.addOptions(categorySourceOptions())
				.setValue(settings.categorySource)
				.onChange(async (v) => {
					settings.categorySource = v as CategorySource;
					await save();
				})
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
		renderCategoryOrder(container, settings, save);
	}

	new Setting(container)
		.setName(t("set.shop.autoCollapse"))
		.addToggle((c) =>
			c.setValue(settings.autoCollapseCompletedSections).onChange(async (v) => {
				settings.autoCollapseCompletedSections = v;
				await save();
			})
		);

	renderCategoryOverrides(container, settings, save);
}

function renderCategoryOrder(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>
): void {
	const setting = new Setting(container)
		.setName(t("set.shop.categoryOrder.name"))
		.setDesc(t("set.gd.reorderHint"));

	const list = setting.settingEl.createDiv("rb-order-list");

	function render(): void {
		list.empty();
		settings.manualCategoryOrder.forEach((cat, i) => {
			const row = list.createDiv("rb-list-row");
			row.createSpan({ text: cat });
			const up = row.createEl("button", { text: "↑" });
			const down = row.createEl("button", { text: "↓" });
			up.disabled = i === 0;
			down.disabled = i === settings.manualCategoryOrder.length - 1;
			up.addEventListener("click", () => {
				[settings.manualCategoryOrder[i - 1], settings.manualCategoryOrder[i]] = [
					settings.manualCategoryOrder[i],
					settings.manualCategoryOrder[i - 1],
				];
				void save().then(() => render());
			});
			down.addEventListener("click", () => {
				[settings.manualCategoryOrder[i], settings.manualCategoryOrder[i + 1]] = [
					settings.manualCategoryOrder[i + 1],
					settings.manualCategoryOrder[i],
				];
				void save().then(() => render());
			});
		});
	}
	render();
}

function renderCategoryOverrides(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>
): void {
	const setting = new Setting(container)
		.setName(t("set.shop.overrides.name"))
		.setDesc(t("modal.categoryOverrides.desc"));

	const list = setting.settingEl.createDiv("rb-override-list");

	function render(): void {
		list.empty();
		settings.categoryOverrides.forEach((override: CategoryOverride, i: number) => {
			const row = list.createDiv("rb-list-row");
			const matchInput = row.createEl("input", { type: "text", value: override.match, placeholder: t("modal.categoryOverrides.substring") });
			const catInput = row.createEl("input", { type: "text", value: override.category, placeholder: t("field.category") });
			const del = row.createEl("button", { text: "✕" });

			matchInput.addEventListener("change", () => {
				settings.categoryOverrides[i].match = matchInput.value.trim().toLowerCase();
				void save();
			});
			catInput.addEventListener("change", () => {
				settings.categoryOverrides[i].category = catInput.value.trim();
				void save();
			});
			del.addEventListener("click", () => {
				settings.categoryOverrides.splice(i, 1);
				void save().then(() => render());
			});
		});

		const addBtn = list.createEl("button", { text: t("set.gd.addOverride") });
		addBtn.addEventListener("click", () => {
			settings.categoryOverrides.push({ match: "", category: "" });
			void save().then(() => render());
		});
	}
	render();
}
