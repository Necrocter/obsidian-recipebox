/**
 * Renders the URL / paste-text input stage of the import modal into the
 * provided body and footer elements (supplied by BaseModal's shell).
 */
import { t } from "../../i18n";
import { App } from "obsidian";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { FolderSuggest } from "../components/folder-suggest";
import { ExtractedRecipe } from "../../importer/recipe-extract-types";
import { submitUrl, submitText, resolveDestinationFolder } from "./import-submit";

export interface InputStageState {
	tab: "url" | "text";
	url: string;
	text: string;
	titleOverride: string;
	folder: string;
}

export function renderInputStage(
	bodyEl: HTMLElement,
	footerEl: HTMLElement,
	app: App,
	settings: RecipeBoxSettings,
	state: InputStageState,
	onResult: (recipe: ExtractedRecipe, folder: string, warning: string | null) => void,
): void {
	// Tab switcher
	const tabs = bodyEl.createDiv({ cls: "rb-import-tabs" });
	const urlTab = tabs.createEl("button", { cls: "rb-import-tab", text: t("modal.import.fromUrl") });
	const textTab = tabs.createEl("button", { cls: "rb-import-tab", text: t("modal.import.fromText") });

	function setTab(tab: "url" | "text"): void {
		state.tab = tab;
		urlTab.toggleClass("rb-import-tab--active", tab === "url");
		textTab.toggleClass("rb-import-tab--active", tab === "text");
		urlPane.toggle(tab === "url");
		textPane.toggle(tab === "text");
	}

	urlTab.addEventListener("click", () => setTab("url"));
	textTab.addEventListener("click", () => setTab("text"));

	// URL pane
	const urlPane = bodyEl.createDiv({ cls: "rb-import-pane" });
	urlPane.createDiv({ cls: "rb-import-field-label", text: t("modal.import.recipeUrl") });
	const urlInput = urlPane.createEl("input", {
		cls: "rb-import-text-input",
		attr: { type: "url", placeholder: t("modal.import.urlPlaceholder") },
	});
	urlInput.value = state.url;
	const urlErrorBox = urlPane.createDiv({ cls: "rb-import-error-box" });
	urlErrorBox.hide();
	urlInput.addEventListener("input", () => {
		state.url = urlInput.value;
		urlErrorBox.empty();
		urlErrorBox.hide();
	});

	// Text pane
	const textPane = bodyEl.createDiv({ cls: "rb-import-pane" });
	textPane.createDiv({ cls: "rb-import-field-label", text: t("modal.import.titleOptional") });
	const titleInput = textPane.createEl("input", {
		cls: "rb-import-text-input",
		attr: { type: "text", placeholder: t("modal.import.titlePlaceholder") },
	});
	titleInput.value = state.titleOverride;
	titleInput.addEventListener("input", () => { state.titleOverride = titleInput.value; });
	textPane.createDiv({ cls: "rb-import-field-label", text: t("modal.import.pasteText") });
	const textArea = textPane.createEl("textarea", {
		cls: "rb-import-textarea rb-import-textarea--tall",
		attr: { placeholder: t("modal.import.pastePlaceholder") },
	});
	textArea.value = state.text;
	textArea.addEventListener("input", () => { state.text = textArea.value; });

	// Shared folder field
	const folderSection = bodyEl.createDiv({ cls: "rb-import-folder-row" });
	folderSection.createDiv({ cls: "rb-import-field-label", text: t("modal.import.destinationFolder") });
	const folderInput = folderSection.createEl("input", {
		cls: "rb-import-text-input",
		attr: { type: "text", placeholder: t("modal.import.folderPlaceholder") },
	});
	if (!state.folder) state.folder = resolveDestinationFolder(settings);
	folderInput.value = state.folder;
	folderInput.addEventListener("input", () => { state.folder = folderInput.value; });
	new FolderSuggest(app, folderInput);

	const importBtn = footerEl.createEl("button", { cls: "mod-cta", text: t("modal.import.importButton") });
	importBtn.addEventListener("click", () => { void (async () => {
		importBtn.disabled = true;
		importBtn.setText(t("modal.import.importing"));
		urlErrorBox.empty();
		urlErrorBox.hide();
		try {
			if (state.tab === "url") {
				const result = await submitUrl(state.url);
				if (result.kind === "success") {
					onResult(result.recipe, state.folder, result.warning);
				} else {
					urlErrorBox.setText(result.message);
					urlErrorBox.show();
				}
			} else {
				const recipe = submitText(state.text, state.titleOverride);
				if (recipe) onResult(recipe, state.folder, null);
			}
		} finally {
			importBtn.disabled = false;
			importBtn.setText(t("modal.import.importButton"));
		}
	})(); });

	setTab(state.tab);
}
