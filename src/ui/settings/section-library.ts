/**
 * Settings section for library configuration — recipe folders, auto-open
 * behavior, and the recipe type value used to identify recipe files.
 */
import { App, setIcon, Setting, TFolder } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { FolderSuggest } from "../components/folder-suggest";
import { DEFAULT_SETTINGS } from "../../settings/settings-defaults";

const FALLBACK_RECIPE_FOLDER = DEFAULT_SETTINGS.recipeFolders[0] ?? "Recipes";

export function renderSectionLibrary(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void,
	app: App
): void {
	new Setting(container).setName(t("set.library.title")).setHeading();

	// The folder list is appended directly inside this card so it stays one visual unit.
	const folderDesc = createFragment();
	folderDesc.appendText(t("set.library.folders.descPre"));
	folderDesc.createEl("strong", { text: t("set.library.folders.descStrong") });
	folderDesc.appendText(t("set.library.folders.descPost"));

	const folderSetting = new Setting(container)
		.setName(t("set.library.folders.name"))
		.setDesc(folderDesc);
	folderSetting.settingEl.addClass("rb-settings-folder-setting");

	const folderList = folderSetting.settingEl.createDiv({ cls: "rb-settings-folder-list" });

	function renderFolderRows(): void {
		folderList.empty();

		settings.recipeFolders.forEach((folder, i) => {
			const row = folderList.createDiv({ cls: "rb-settings-folder-row" });
			row.createSpan({ cls: "rb-settings-folder-label", text: folder === "/" ? t("set.library.folders.entireVault") : folder });
			const del = row.createEl("button", {
				cls: "rb-settings-folder-delete clickable-icon",
				attr: { title: t("common.remove") },
			});
			setIcon(del, "trash-2");
			del.addEventListener("click", () => {
				settings.recipeFolders.splice(i, 1);
				// Removing the last folder would silently fall back to scanning the
				// entire vault (the underlying scope check treats an empty list that
				// way). Restore the default folder instead, so "scan everything" only
				// ever happens when someone explicitly adds "/".
				if (settings.recipeFolders.length === 0) {
					settings.recipeFolders.push(FALLBACK_RECIPE_FOLDER);
				}
				void save().then(() => { renderFolderRows(); updateWarning(); });
			});
		});

		// Add-folder row: text input wired to FolderSuggest; commits on valid folder pick or Enter.
		const addRow = folderList.createDiv({ cls: "rb-settings-folder-add-row" });
		const input = addRow.createEl("input", {
			cls: "rb-settings-folder-input",
			attr: { type: "text", placeholder: t("set.library.folders.addPlaceholder") },
		});
		new FolderSuggest(app, input);

		async function tryCommit(): Promise<void> {
			const raw = input.value.trim().replace(/\/$/, "");
			const lookupPath = raw === "" ? "/" : raw;
			const node = lookupPath === "/"
				? app.vault.getRoot()
				: app.vault.getAbstractFileByPath(lookupPath);
			if (!(node instanceof TFolder)) return;
			const savePath = node.path === "" ? "/" : node.path;
			if (!settings.recipeFolders.includes(savePath)) {
				settings.recipeFolders.push(savePath);
				await save();
			}
			renderFolderRows();
			updateWarning();
		}

		input.addEventListener("input", () => { void tryCommit(); });
		input.addEventListener("keydown", (e) => { if (e.key === "Enter") void tryCommit(); });
	}
	renderFolderRows();

	const warningEl = container.createDiv({ cls: "rb-settings-warning rb-hidden" });

	function updateWarning(): void {
		warningEl.empty();
		const wholeVault = settings.recipeFolders.includes("/");
		const noType = !settings.recipeType.trim();
		if (!wholeVault || !noType) {
			warningEl.addClass("rb-hidden");
			return;
		}
		warningEl.removeClass("rb-hidden");

		const icon = warningEl.createSpan({ cls: "rb-settings-warning-icon" });
		setIcon(icon, "alert-triangle");
		warningEl.createSpan({
			cls: "rb-settings-warning-text",
			text: t("set.library.wholeVaultWarning"),
		});
	}
	updateWarning();

	new Setting(container)
		.setName(t("set.library.typeValue.name"))
		.setDesc(t("set.library.typeValue.desc"))
		.addText((tc) =>
			tc.setValue(settings.recipeType).onChange(async (v) => {
				settings.recipeType = v;
				await save();
				updateWarning();
			})
		);


	new Setting(container)
		.setName(t("set.library.dashboard.name"))
		.setDesc(t("set.library.dashboard.desc"))
		.addToggle((tc) =>
			tc.setValue(settings.enableDashboard).onChange(async (v) => {
				settings.enableDashboard = v;
				await save();
				rerender();
			})
		);

	new Setting(container)
		.setName(t("set.library.folderClick.name"))
		.setDesc(t("set.library.folderClick.desc"))
		.addToggle((tc) =>
			tc.setValue(settings.openGalleryOnFolderClick).onChange(async (v) => {
				settings.openGalleryOnFolderClick = v;
				await save();
				rerender();
			})
		);

	if (settings.openGalleryOnFolderClick) {
		new Setting(container)
			.setName(t("set.library.subfolders.name"))
			.setDesc(t("set.library.subfolders.desc"))
			.addToggle((tc) =>
				tc.setValue(settings.openGalleryOnFolderClickSubfolders).onChange(async (v) => {
					settings.openGalleryOnFolderClickSubfolders = v;
					await save();
				})
			);
	}
}
