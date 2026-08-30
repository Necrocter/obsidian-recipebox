/**
 * "What can I cook?" modal: reads the pantry note, compares every recipe's
 * declared ingredient list (frontmatter array) against it, and groups recipes
 * by how many ingredients are missing.
 */
import { App, TFile, setIcon } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { findValue } from "../../parser/frontmatter-lookup";
import { matchRecipe } from "../../parser/pantry-match";
import { pantrySet } from "../../parser/pantry-note";
import { BaseModal } from "./modal-shell";

export interface PantryMatchDeps {
	getSettings: () => RecipeBoxSettings;
	/** Recipe files, already filtered to notes that count as recipes. */
	listRecipeFiles: () => TFile[];
	openRecipe: (file: TFile) => void;
	addToGrocery: (names: string[]) => Promise<void>;
	/** Open the pantry note, creating it if absent. */
	openPantryNote: () => Promise<void>;
}

// Recipes missing more than this are not shown -- past a few gaps it stops
// being a "could cook this" suggestion and turns into a shopping list.
const MAX_MISSING = 3;

interface Candidate {
	file: TFile;
	missing: string[];
	total: number;
	favorite: boolean;
}

function isTruthy(value: unknown): boolean {
	return value === true || value === "true" || value === 1;
}

export class PantryMatchModal extends BaseModal {
	constructor(app: App, private readonly deps: PantryMatchDeps) {
		super(app);
	}

	getTitle(): string { return t("modal.pantry.title"); }
	getIcon(): string { return "chef-hat"; }
	getContentClasses(): string[] { return ["rb-pantry-modal"]; }

	renderFooter(footerEl: HTMLElement): void {
		footerEl.createEl("button", { cls: "rb-shell-cancel-btn", text: t("common.close") })
			.addEventListener("click", () => this.close());
		footerEl.createEl("button", { cls: "mod-cta", text: t("modal.pantry.editPantry") })
			.addEventListener("click", () => { void this.deps.openPantryNote().then(() => this.close()); });
	}

	async renderBody(bodyEl: HTMLElement): Promise<void> {
		const settings = this.deps.getSettings();
		const pantryFile = this.app.vault.getFileByPath(settings.pantryNotePath);

		if (!pantryFile) {
			const empty = bodyEl.createDiv({ cls: "rb-modal-section" });
			empty.createEl("p", { cls: "rb-modal-section-desc", text: t("modal.pantry.noNote", { path: settings.pantryNotePath }) });
			empty.createEl("button", { cls: "mod-cta", text: t("modal.pantry.createNote") })
				.addEventListener("click", () => { void this.deps.openPantryNote().then(() => this.close()); });
			return;
		}

		const pantry = pantrySet(await this.app.vault.cachedRead(pantryFile));
		bodyEl.createEl("p", {
			cls: "rb-modal-section-desc",
			text: t("modal.pantry.summary", { count: pantry.size, path: settings.pantryNotePath }),
		});
		if (pantry.size === 0) {
			bodyEl.createEl("p", { cls: "rb-modal-section-desc", text: t("modal.pantry.emptyPantry") });
			return;
		}

		const keys = [settings.ingredientsListProperty, "ingredientes", "ingredients"];
		const favKeys = [settings.favoriteProperty, "favorite", "favorita"];
		let noListCount = 0;
		const candidates: Candidate[] = [];

		for (const file of this.deps.listRecipeFiles()) {
			const fm = (this.app.metadataCache.getFileCache(file)?.frontmatter ?? {}) as Record<string, unknown>;
			const listRaw = findValue(fm, keys);
			if (!Array.isArray(listRaw) || listRaw.length === 0) { noListCount++; continue; }
			const { covered, missing } = matchRecipe(listRaw, pantry);
			if (missing.length > MAX_MISSING) continue;
			candidates.push({
				file,
				missing,
				total: covered.length + missing.length,
				favorite: isTruthy(findValue(fm, favKeys)),
			});
		}

		const cmp = (a: Candidate, b: Candidate): number =>
			Number(b.favorite) - Number(a.favorite) ||
			a.total - b.total ||
			a.file.basename.localeCompare(b.file.basename);

		const ready = candidates.filter(c => c.missing.length === 0).sort(cmp);
		const one = candidates.filter(c => c.missing.length === 1).sort(cmp);
		const few = candidates.filter(c => c.missing.length >= 2).sort(cmp);

		this.renderBucket(bodyEl, t("modal.pantry.bucket.ready"), ready, t("modal.pantry.bucket.readyEmpty"));
		this.renderBucket(bodyEl, t("modal.pantry.bucket.missing1"), one, t("modal.pantry.bucket.missing1Empty"));
		this.renderBucket(bodyEl, t("modal.pantry.bucket.missing23"), few, t("modal.pantry.bucket.missing23Empty"));

		if (noListCount > 0) {
			bodyEl.createEl("p", {
				cls: "rb-modal-section-desc rb-pantry-footnote",
				text: t("modal.pantry.noListNote", { count: noListCount, prop: settings.ingredientsListProperty }),
			});
		}
	}

	private renderBucket(parent: HTMLElement, label: string, rows: Candidate[], emptyText: string): void {
		const section = parent.createDiv({ cls: "rb-modal-section rb-pantry-bucket" });
		section.createDiv({ cls: "rb-modal-section-heading", text: `${label} (${rows.length})` });
		if (rows.length === 0) {
			section.createEl("p", { cls: "rb-modal-section-desc", text: emptyText });
			return;
		}
		const list = section.createDiv({ cls: "rb-pantry-list" });
		for (const row of rows) this.renderRow(list, row);
	}

	private renderRow(list: HTMLElement, row: Candidate): void {
		const el = list.createDiv({ cls: "rb-pantry-row" });

		const nameBtn = el.createEl("button", { cls: "rb-pantry-row-name", text: row.file.basename });
		if (row.favorite) setIcon(nameBtn.createSpan({ cls: "rb-pantry-fav" }), "heart");
		nameBtn.addEventListener("click", () => { this.deps.openRecipe(row.file); this.close(); });

		if (row.missing.length > 0) {
			const missingWrap = el.createDiv({ cls: "rb-pantry-missing" });
			for (const m of row.missing) missingWrap.createSpan({ cls: "rb-ingredient-tag", text: m });

			const addBtn = el.createEl("button", {
				cls: "rb-pantry-add clickable-icon",
				attr: { "aria-label": t("modal.pantry.addMissing") },
			});
			setIcon(addBtn, "shopping-cart");
			addBtn.addEventListener("click", () => {
				addBtn.disabled = true;
				el.addClass("is-added");
				void this.deps.addToGrocery(row.missing);
			});
		}
	}
}
