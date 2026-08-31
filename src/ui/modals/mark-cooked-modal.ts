/**
 * Modal for stamping a recipe as cooked, collecting a date, optional notes,
 * and an optional photo before writing the history entry.
 */
import { App, Platform, setIcon, TFile } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { CookedImageResult } from "../recipe-view/recipe-view-deps";
import { VaultImageSuggestModal } from "./vault-image-suggest-modal";
import { localDateISO } from "../../utils/date";
import { BaseModal } from "./modal-shell";

export class MarkCookedModal extends BaseModal {
	private selectedDate: string;
	private notes = "";
	private imageResult: CookedImageResult | null = null;
	private previewUrl: string | null = null;

	constructor(
		app: App,
		private readonly file: TFile,
		private readonly settings: RecipeBoxSettings,
		private readonly onStamp: (date: string, notes: string, image: CookedImageResult | null) => void,
	) {
		super(app);
		this.selectedDate = localDateISO();
	}

	getTitle(): string { return t("modal.markCooked.title"); }
	getIcon(): string { return "circle-check-big"; }
	getSubtitle(): string { return this.file.basename; }
	getContentClasses(): string[] { return ["rb-mark-cooked-modal"]; }

	renderBody(bodyEl: HTMLElement): void {
		const fields = bodyEl.createDiv({ cls: "rb-mark-cooked-fields" });

		const dateField = fields.createDiv({ cls: "rb-modal-field rb-mark-cooked-date-field" });
		dateField.createEl("label", { cls: "rb-modal-field-label", text: t("field.date") });
		const dateInput = dateField.createEl("input", {
			cls: "rb-modal-input",
			attr: { type: "date" },
		});
		dateInput.value = this.selectedDate;
		dateInput.addEventListener("change", () => {
			this.selectedDate = dateInput.value || localDateISO();
			if (!dateInput.value) dateInput.value = this.selectedDate;
		});

		if (this.settings.cookHistoryEnabled) {
			const notesField = fields.createDiv({ cls: "rb-modal-field rb-mark-cooked-notes-field" });
			notesField.createEl("label", { cls: "rb-modal-field-label", text: t("field.notes") });
			const notesInput = notesField.createEl("textarea", {
				cls: "rb-modal-input rb-mark-cooked-notes-input",
				attr: { rows: "6", placeholder: t("field.notesPlaceholder") },
			});
			notesInput.addEventListener("input", () => { this.notes = notesInput.value; });

			// don't autofocus the notes field on mobile, because it will pop up the keyboard and hide the image buttons
			if (!Platform.isMobile) window.requestAnimationFrame(() => notesInput.focus());

			this.buildImageSection(bodyEl);
		}
	}

	renderFooter(footerEl: HTMLElement): void {
		footerEl.createEl("button", { cls: "rb-shell-cancel-btn", text: t("common.cancel") })
			.addEventListener("click", () => this.close());
		footerEl.createEl("button", { cls: "mod-cta", text: t("modal.markCooked.title") })
			.addEventListener("click", () => {
				this.onStamp(this.selectedDate, this.notes.trim(), this.imageResult);
				this.close();
			});
	}

	override onClose(): void {
		this.releasePreview();
		this.contentEl.empty();
	}

	private buildImageSection(container: HTMLElement): void {
		container.createEl("p", { cls: "rb-modal-section-title", text: t("photo.heading") });

		const imageLayout = container.createDiv({ cls: "rb-modal-image-layout" });
		const btnRow = imageLayout.createDiv({ cls: "rb-modal-image-btns" });
		const previewWrap = imageLayout.createDiv({ cls: "rb-modal-image-preview" });
		const previewImg = previewWrap.createEl("img", { attr: { alt: "" }, cls: "rb-hidden" });

		// Image selection buttons: vault, upload, camera (mobile only), remove

		// VAULT
		const vaultBtn = btnRow.createEl("button", { cls: "rb-modal-btn", title: t("photo.chooseFromVault") });
		vaultBtn.addEventListener("click", () => {
			new VaultImageSuggestModal(this.app, vaultFile => {
				this.releasePreview();
				this.imageResult = { kind: "vault-file", file: vaultFile };
				showPreview(this.app.vault.getResourcePath(vaultFile));
			}).open();
		});
		const vaultIcon = vaultBtn.createSpan({ cls: "rb-modal-btn-icon" });
		setIcon(vaultIcon, "folder");
		if (!Platform.isMobile) vaultBtn.createSpan({ text: t("photo.selectFromVault") });

		// UPLOAD
		const uploadInput = container.createEl("input", {
			attr: { type: "file", accept: "image/*", style: "display:none" },
		});
		uploadInput.addEventListener("change", () => void this.handleFileInput(uploadInput, showPreview));

		const uploadBtn = btnRow.createEl("button", { cls: "rb-modal-btn", title: t("photo.uploadImage") });
		uploadBtn.addEventListener("click", () => uploadInput.click());

		const uploadIcon = uploadBtn.createSpan({ cls: "rb-modal-btn-icon" });
		setIcon(uploadIcon, "upload");
		if (!Platform.isMobile) uploadBtn.createSpan({ text: t("photo.upload") });


		if (Platform.isMobile) {

			// CAMERA (mobile only)
			const cameraInput = container.createEl("input", {
				attr: { type: "file", accept: "image/*", capture: "environment", style: "display:none" },
			});
			const cameraBtn = btnRow.createEl("button", { cls: "rb-modal-btn", title: t("photo.takePhoto"), text: "" });
			cameraBtn.addEventListener("click", () => cameraInput.click());
			setIcon(cameraBtn, "camera");
			cameraInput.addEventListener("change", () => void this.handleFileInput(cameraInput, showPreview));
		}

		// REMOVE
		const removeBtn = btnRow.createEl("button", { cls: "rb-modal-btn rb-modal-btn-danger rb-modal-btn-remove", title: t("photo.removeImage"), text: "" });
		removeBtn.addEventListener("click", () => { this.releasePreview(); this.imageResult = null; showPreview(null); });
		setIcon(removeBtn, "trash-2");
		if (!Platform.isMobile) removeBtn.createSpan({ text: t("common.remove") });


		// Show or hide the preview image and remove button based on whether an image is selected
		const showPreview = (src: string | null): void => {
			const hasImage = Boolean(src);
			if (src) { previewImg.src = src; }
			imageLayout.toggleClass("rb-modal-image-layout-has-preview", hasImage);
			previewWrap.toggleClass("rb-hidden", !hasImage);
			previewImg.toggleClass("rb-hidden", !hasImage);
			removeBtn.toggleClass("rb-hidden", !hasImage);
		};
		showPreview(null);

	}

	private async handleFileInput(input: HTMLInputElement, showPreview: (src: string | null) => void): Promise<void> {
		const file = input.files?.[0];
		if (!file) return;
		this.releasePreview();
		this.previewUrl = URL.createObjectURL(file);
		showPreview(this.previewUrl);
		const data = await file.arrayBuffer();
		this.imageResult = { kind: "upload", filename: file.name, data };
	}

	private releasePreview(): void {
		if (this.previewUrl) { URL.revokeObjectURL(this.previewUrl); this.previewUrl = null; }
	}
}
