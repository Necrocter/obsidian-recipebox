/**
 * Per-badge edit modal -- holds a draft copy of one badge and only
 * commits to settings on explicit Save. Cancel discards with no write.
 *
 * Modes:
 *  isNew=true  -> "Add badge" title, Use-formula toggle at top
 *  builtin     -> "Edit badge: {name}" title, label/icon/color only
 *  formula     -> "Edit badge: {name}" title, formula + label/icon/color
 *  regular     -> "Edit badge: {name}" title, property/prefix/suffix/split + label/icon/color
 */
import { App, Setting, setIcon } from "obsidian";
import { CustomBadge, BadgeColor } from "../../types";
import { BaseModal } from "./modal-shell";
import { DiscoveryResult } from "../../discovery/discovery-cache";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { buildFieldPickerBtn, buildPickerFieldList } from "../components/field-picker";
import { propertyToLabel } from "../../utils/property-label";
import { t } from "../../i18n";

function colorOptions(): Record<BadgeColor, string> {
	return {
		default: t("badge.color.default"),
		green: t("badge.color.green"),
		blue: t("badge.color.blue"),
		purple: t("badge.color.purple"),
		yellow: t("badge.color.yellow"),
		red: t("badge.color.red"),
	};
}

export class BadgeEditModal extends BaseModal {
	private draft: CustomBadge;
	private useFormula: boolean;
	/** Tracks whether the user has manually changed the label, suppressing auto-populate from property. */
	private labelManuallyEdited = false;

	constructor(
		app: App,
		private readonly source: CustomBadge,
		private readonly onSave: (updated: CustomBadge) => void,
		private readonly isNew: boolean = false,
		private readonly getDiscovery?: () => DiscoveryResult | null,
		private readonly getSettings?: () => RecipeBoxSettings,
	) {
		super(app);
		this.draft = { ...source };
		this.useFormula = !!source.formula;
	}

	getTitle(): string {
		return this.isNew ? t("modal.badge.titleAdd") : t("modal.badge.titleEdit", { name: this.draft.label || this.draft.property });
	}
	getContentClasses(): string[] { return ["rb-badge-edit-modal"]; }

	renderBody(bodyEl: HTMLElement): void {
		this.rebuildFields(bodyEl);
	}

	renderFooter(footerEl: HTMLElement): void {
		this.rebuildButtons(footerEl);
	}

	/**
	 * Re-renders both body and footer when the "Use formula" toggle changes.
	 * Clears and rebuilds rather than patching, to keep state consistent.
	 */
	private rerenderAll(): void {
		const bodyEl = this.contentEl.querySelector<HTMLElement>(".rb-shell-body");
		const footerEl = this.contentEl.querySelector<HTMLElement>(".rb-shell-footer");
		if (bodyEl) { bodyEl.empty(); this.rebuildFields(bodyEl); }
		if (footerEl) { footerEl.empty(); this.rebuildButtons(footerEl); }
	}

	private rebuildFields(body: HTMLElement): void {
		const isBuiltin = this.source.builtin && !this.isNew;

		if (isBuiltin) {
			if (this.draft.formula) {
				this.renderFormulaSection(body);
			} else {
				new Setting(body)
					.setName(t("modal.badge.property"))
					.setDesc(t("modal.badge.propertyDesc"))
					.addText((c) =>
						c
							.setValue(this.draft.property)
							.setPlaceholder(t("modal.badge.egProperty"))
							.onChange((v) => { this.draft.property = v; }),
					);
			}
			this.renderLabelSection(body);
		} else {
			new Setting(body)
				.setName(t("modal.badge.useFormula"))
				.setDesc(t("modal.badge.useFormulaDesc"))
				.addToggle((c) =>
					c.setValue(this.useFormula).onChange((v) => {
						this.useFormula = v;
						if (!v) this.draft.formula = undefined;
						else if (!this.draft.formula) this.draft.formula = "";
						this.rerenderAll();
					}),
				);

			if (this.useFormula) {
				this.renderFormulaSection(body);
			} else {
				this.renderPropertySection(body);
			}
			this.renderLabelSection(body);
		}
	}

	private rebuildButtons(footer: HTMLElement): void {
		footer.createEl("button", { cls: "rb-shell-cancel-btn", text: t("common.cancel") })
			.addEventListener("click", () => this.close());
		footer.createEl("button", { cls: "mod-cta", text: t("common.save") })
			.addEventListener("click", () => {
				this.onSave({ ...this.draft });
				this.close();
			});
	}

	private renderFormulaSection(body: HTMLElement): void {
		new Setting(body)
			.setName(t("modal.badge.formula"))
			.setDesc(
				t("modal.badge.formulaDesc")
			)
			.addTextArea((t) =>
				t
					.setValue(this.draft.formula ?? "")
					.onChange((v) => {
						this.draft.formula = v.trim() || undefined;
					}),
			);
	}

	private renderPropertySection(body: HTMLElement): void {
		const discovery = this.getDiscovery?.() ?? null;
		const settings = this.getSettings?.();
		const fields = settings ? buildPickerFieldList(settings, discovery) : [];
		const selectedField = fields.find(f => f.key === this.draft.property);

		const propSetting = new Setting(body)
			.setName(t("modal.badge.property"))
			.setDesc(t("modal.badge.propertyDesc"));

		if (fields.length > 0) {
			propSetting.settingEl.createDiv({ cls: "rb-badge-prop-picker" }, (el) => {
				buildFieldPickerBtn(el, this.draft.property, fields, (val) => {
					this.draft.property = val;
					// Auto-populate label from property name unless the user already customized it.
					if (!this.labelManuallyEdited && val) {
						this.draft.label = propertyToLabel(val);
					}
					this.rerenderAll();
				});
			});
		} else {
			// No discovery available -- fall back to text input.
			propSetting.addText((c) =>
				c.setValue(this.draft.property).setPlaceholder(t("modal.badge.egCuisine"))
					.onChange((v) => { this.draft.property = v; }),
			);
		}

		new Setting(body)
			.setName(t("modal.badge.prefix"))
			.setDesc(t("modal.badge.prefixDesc"))
			.addText((c) =>
				c
					.setValue(this.draft.prefix ?? "")
					.setPlaceholder(t("modal.badge.egPrefix"))
					.onChange((v) => {
						this.draft.prefix = v || undefined;
					}),
			);

		new Setting(body)
			.setName(t("modal.badge.suffix"))
			.setDesc(t("modal.badge.suffixDesc"))
			.addText((c) =>
				c
					.setValue(this.draft.suffix ?? "")
					.setPlaceholder(t("modal.badge.egSuffix"))
					.onChange((v) => {
						this.draft.suffix = v || undefined;
					}),
			);

		// Only show "Split array" when discovery confirms this field carries array values.
		// If discovery is unavailable, show it unconditionally rather than hiding a useful option.
		const showSplitArray = !selectedField || selectedField.hasArrayValues;
		if (showSplitArray) {
			new Setting(body)
				.setName(t("modal.badge.splitArray"))
				.setDesc(
					t("modal.badge.splitArrayDesc"),
				)
				.addToggle((c) =>
					c.setValue(this.draft.splitArray).onChange((v) => {
						this.draft.splitArray = v;
					}),
				);
		}
	}

	private renderLabelSection(body: HTMLElement): void {
		new Setting(body)
			.setName(t("modal.badge.showLabel"))
			.setDesc(t("modal.badge.showLabelDesc"))
			.addToggle((c) =>
				c.setValue(!(this.draft.hideLabel ?? false)).onChange((v) => {
					this.draft.hideLabel = !v;
					this.rerenderAll();
				}),
			);

		if (!this.draft.hideLabel) {
			new Setting(body)
				.setName(t("modal.badge.label"))
				.setDesc(t("modal.badge.labelDesc"))
				.addText((c) =>
					c
						.setValue(this.draft.label)
						.setPlaceholder(t("modal.badge.egCuisine"))
						.onChange((v) => {
							this.draft.label = v;
							this.labelManuallyEdited = true;
						}),
				);
		}

		new Setting(body)
			.setName(t("modal.badge.icon"))
			.setDesc(t("modal.badge.iconDesc"))
			.addText((c) => {
				c.setValue(this.draft.icon ?? "")
					.setPlaceholder(t("modal.badge.egIcon"))
					.onChange((v) => {
						this.draft.icon = v.trim() || undefined;
					});

				const preview = c.inputEl.parentElement!.createEl("button", {
					cls: "rb-badge-icon-preview",
					attr: { type: "button" },
				});
				const previewIcon = preview.createSpan();
				if (this.draft.icon) setIcon(previewIcon, this.draft.icon);

				c.inputEl.addEventListener("input", () => {
					previewIcon.empty();
					if (c.inputEl.value.trim()) setIcon(previewIcon, c.inputEl.value.trim());
				});
			});

		new Setting(body)
			.setName(t("modal.badge.color"))
			.addDropdown((dd) =>
				dd
					.addOptions(colorOptions())
					.setValue(this.draft.color)
					.onChange((v) => {
						this.draft.color = v as BadgeColor;
					}),
			);
	}
}
