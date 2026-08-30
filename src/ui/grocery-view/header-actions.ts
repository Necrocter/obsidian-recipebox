/**
 * Renders the action toolbar at the top of the grocery view.
 * Toolbar order: group-by dropdown — export — clear grocery list.
 * "Add item" and "check all / uncheck all" live above the list, not here.
 */
import { Notice, setIcon } from "obsidian";
import { t } from "../../i18n";
import { GroupingMode } from "../../types";
import { GroceryViewDeps } from "./grocery-view-deps";
import { ConfirmModal } from "../modals/confirm-modal";
import { App } from "obsidian";

function groupingLabels(): Record<GroupingMode, string> {
	return {
		category: t("gv.group.category"),
		recipe: t("gv.group.recipe"),
		source: t("gv.group.source"),
		none: t("gv.group.none"),
	};
}

export function renderHeaderActions(
	container: HTMLElement,
	app: App,
	deps: GroceryViewDeps,
	onRefresh: () => void
): void {
	const bar = container.createDiv({ cls: "rb-gv-header" });

	// Labeled dropdown makes the current grouping visible without requiring a click,
	// replacing the old icon-only button that opened a hidden menu.
	const groupSelect = bar.createEl("select", { cls: "rb-gv-group-select" });
	for (const [mode, label] of Object.entries(groupingLabels()) as [GroupingMode, string][]) {
		const opt = groupSelect.createEl("option", { value: mode, text: label });
		if (deps.getSettings().groupingMode === mode) opt.selected = true;
	}
	groupSelect.addEventListener("change", () => {
		deps.getSettings().groupingMode = groupSelect.value as GroupingMode;
		void deps.saveSettings().then(() => onRefresh());
	});

	const exportBtn = bar.createDiv({ cls: "rb-gv-header-btn", attr: { "aria-label": t("gv.exportList") } });
	setIcon(exportBtn, "share");
	exportBtn.addEventListener("click", () => deps.openExportModal());

	const clearBtn = bar.createDiv({ cls: "rb-gv-header-btn rb-gv-header-btn--danger", attr: { "aria-label": t("gv.clearList") } });
	setIcon(clearBtn, "trash-2");
	clearBtn.addEventListener("click", () => {
		new ConfirmModal(
			app,
			t("gv.clearList"),
			t("gv.clearConfirm.body"),
			t("gv.clearList"),
			{
				destructive: true,
				onConfirm: () => {
					void deps.clearGroceryOnly().then(() => new Notice(t("notice.groceryListCleared")));
				},
			},
		).open();
	});
}
