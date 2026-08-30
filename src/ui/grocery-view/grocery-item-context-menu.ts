/**
 * Shows a context menu for a manually-added grocery item, offering edit,
 * category override, and remove actions.
 */
import { Menu } from "obsidian";
import { t } from "../../i18n";
import { GroceryItemEntry } from "../../types";
import { LongPressPosition } from "./long-press";
import { GroceryViewDeps } from "./grocery-view-deps";

export function openGroceryItemContextMenu(
	pos: LongPressPosition,
	item: GroceryItemEntry,
	deps: GroceryViewDeps
): void {
	const menu = new Menu();

	menu.addItem((menuItem) => {
		menuItem.setTitle(t("gv.ctx.editItem")).setIcon("pencil");
		menuItem.onClick(() => deps.openAddGroceryItemModal(item));
	});

	menu.addItem((menuItem) => {
		menuItem.setTitle(t("gv.ctx.moveToCategory")).setIcon("folder");
		menuItem.onClick(() => {
			const sub = new Menu();
			const categories = deps.getKnownCategories();

			sub.addItem((autoItem) => {
				autoItem.setTitle(t("gv.ctx.autoDetect")).setChecked(!item.categoryOverride);
				autoItem.onClick(() =>
					void deps.updateGroceryItem(item.id, { categoryOverride: null })
				);
			});

			for (const cat of categories) {
				sub.addItem((catItem) => {
					catItem.setTitle(cat).setChecked(item.categoryOverride === cat);
					catItem.onClick(() =>
						void deps.updateGroceryItem(item.id, { categoryOverride: cat })
					);
				});
			}

			sub.addSeparator();

			sub.addItem((newCatItem) => {
				newCatItem.setTitle(t("gv.ctx.newCategory")).setIcon("plus");
				newCatItem.onClick(() => deps.openAddGroceryItemModal(item));
			});

			sub.showAtPosition(pos);
		});
	});

	menu.addSeparator();

	menu.addItem((removeItem) => {
		removeItem.setTitle(t("common.remove")).setIcon("trash-2").setWarning(true);
		removeItem.onClick(() => void deps.removeGroceryItem(item.id));
	});

	menu.showAtPosition(pos);
}
