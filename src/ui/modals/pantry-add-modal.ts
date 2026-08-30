/**
 * One-field modal for the "add to pantry" command: type ingredients
 * (comma- or newline-separated), they get appended to the pantry note as
 * had (checked) items.
 */
import { App } from "obsidian";
import { t } from "../../i18n";
import { BaseModal } from "./modal-shell";

export class PantryAddModal extends BaseModal {
	private input!: HTMLTextAreaElement;

	constructor(app: App, private readonly onAdd: (names: string[]) => Promise<void>) {
		super(app);
	}

	getTitle(): string { return t("modal.pantryAdd.title"); }
	getIcon(): string { return "plus"; }

	renderBody(bodyEl: HTMLElement): void {
		bodyEl.createEl("p", { cls: "rb-modal-section-desc", text: t("modal.pantryAdd.hint") });
		this.input = bodyEl.createEl("textarea", {
			cls: "rb-modal-input",
			attr: { rows: "5", placeholder: t("modal.pantryAdd.placeholder") },
		});
		window.requestAnimationFrame(() => this.input.focus());
	}

	renderFooter(footerEl: HTMLElement): void {
		footerEl.createEl("button", { cls: "rb-shell-cancel-btn", text: t("common.cancel") })
			.addEventListener("click", () => this.close());
		footerEl.createEl("button", { cls: "mod-cta", text: t("common.add") })
			.addEventListener("click", () => {
				const names = this.input.value
					.split(/[\n,]/)
					.map((s) => s.trim())
					.filter(Boolean);
				this.close();
				if (names.length > 0) void this.onAdd(names);
			});
	}
}
