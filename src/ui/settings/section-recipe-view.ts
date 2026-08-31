/**
 * Recipe view settings section. Owns view toggles, tag display,
 * and the collapsible header-badge list.
 */
import { App, Platform, setIcon, Setting } from "obsidian";
import { t } from "../../i18n";
import { CustomBadge } from "../../types";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { DEFAULT_SETTINGS } from "../../settings/settings-defaults";
import { BadgeEditModal } from "../modals/modal-badge-edit";
import { SeparatorEditModal } from "../modals/modal-separator-edit";
import { DiscoveryResult } from "../../discovery/discovery-cache";

export function renderSectionRecipeView(
	container: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	rerender: () => void,
	app: App,
	getDiscovery?: () => DiscoveryResult | null,
): void {
	new Setting(container).setName(t("set.recipeView.title")).setHeading();

	new Setting(container)
		.setName(t("set.rv.autoOpen.name"))
		.setDesc(t("set.rv.autoOpen.desc"))
		.addToggle((c) =>
			c.setValue(settings.autoOpenRecipeView).onChange(async (v) => {
				settings.autoOpenRecipeView = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.rv.layout.name"))
		.setDesc(t("set.rv.layout.desc"))
		.addDropdown((d) =>
			d
				.addOption("two-column", t("set.rv.layout.twoColumn"))
				.addOption("classic", t("set.rv.layout.classic"))
				.setValue(settings.desktopRecipeLayout)
				.onChange(async (value) => {
					settings.desktopRecipeLayout = value === "classic" ? "classic" : "two-column";
					await save();
					rerender();
				})
		);

	new Setting(container)
		.setName(t("set.rv.resetSplit.name"))
		.setDesc(t("set.rv.resetSplit.desc"))
		.addButton((b) =>
			b.setButtonText(t("common.reset"))
				.setDisabled(settings.desktopTwoColumnSplitRatio === DEFAULT_SETTINGS.desktopTwoColumnSplitRatio)
				.onClick(() => {
					settings.desktopTwoColumnSplitRatio = DEFAULT_SETTINGS.desktopTwoColumnSplitRatio;
					void save().then(() => rerender());
				})
		);

	new Setting(container)
		.setName(t("set.rv.showSource.name"))
		.setDesc(t("set.rv.showSource.desc"))
		.addToggle((c) =>
			c.setValue(settings.showRecipeSource).onChange(async (v) => {
				settings.showRecipeSource = v;
				await save();
				rerender();
			})
		);

	new Setting(container)
		.setName(t("set.rv.showMethodsEquipment.name"))
		.setDesc(t("set.rv.showMethodsEquipment.desc"))
		.addToggle((c) =>
			c.setValue(settings.showMethodsEquipment).onChange(async (v) => {
				settings.showMethodsEquipment = v;
				await save();
				rerender();
			})
		);

	new Setting(container)
		.setName(t("set.rv.showTags.name"))
		.addToggle((c) =>
			c.setValue(settings.showTagsInHeader).onChange(async (v) => {
				settings.showTagsInHeader = v;
				await save();
				rerender();
			})
		);

	if (settings.showTagsInHeader) {
		new Setting(container)
			.setName(t("set.rv.prefixTags.name"))
			.addToggle((c) =>
				c.setValue(settings.prefixTagsWithHash).onChange(async (v) => {
					settings.prefixTagsWithHash = v;
					await save();
				})
			);
		new Setting(container)
			.setName(t("set.rv.fullTagPath.name"))
			.setDesc(t("set.rv.fullTagPath.desc"))
			.addToggle((c) =>
				c.setValue(settings.showFullTagPath).onChange(async (v) => {
					settings.showFullTagPath = v;
					await save();
				})
			);
	}
	new Setting(container)
		.setName(t("set.rv.crossOff.name"))
		.setDesc(t("set.rv.crossOff.desc"))
		.addToggle((c) =>
			c.setValue(settings.crossOffWhileCooking).onChange(async (v) => {
				settings.crossOffWhileCooking = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.rv.cleanBody.name"))
		.setDesc(t("set.rv.cleanBody.desc"))
		.addToggle((c) =>
			c.setValue(settings.cleanNoteBody).onChange(async (v) => {
				settings.cleanNoteBody = v;
				await save();
			})
		);

	new Setting(container)
		.setName(t("set.rv.firstImage.name"))
		.setDesc(t("set.rv.firstImage.desc"))
		.addToggle((c) =>
			c.setValue(settings.useFirstBodyImageWhenFrontmatterEmpty).onChange(async (v) => {
				settings.useFirstBodyImageWhenFrontmatterEmpty = v;
				await save();
				rerender();
			})
		);

	new Setting(container)
		.setName(t("set.rv.defaultImage.name"))
		.setDesc(t("set.rv.defaultImage.desc"))
		.addText((c) =>
			c.setPlaceholder(t("set.rv.defaultImage.placeholder"))
				.setValue(settings.defaultRecipeImage)
				.onChange(async (v) => {
					settings.defaultRecipeImage = v;
					await save();
					rerender();
				})
		);




	// ── Inline badge list ────────────────────────────────────────────────────
	const badgeSettings = new Setting(container)
		.setName(t("set.rv.badges.name"))
		.setDesc(t("set.rv.badges.desc"));

	badgeSettings.settingEl.addClass("rb-badge-stack");

	badgeSettings.settingEl.createDiv({ cls: "rb-settings-warning-text", text: t("set.rv.badges.warning") });

	const listEl = badgeSettings.settingEl.createDiv({ cls: "rb-badge-list" });
	renderBadgeList(listEl, settings, save, app, getDiscovery);
}

function badgePrimary(badge: CustomBadge): string {
	if (badge.type === "newline") return t("set.rv.badge.newline");
	if (badge.type === "separator") return t("set.rv.badge.separator", { sep: badge.property || "|" });
	if (badge.formula) return badge.label || t("set.rv.badge.formula");
	return badge.property || t("set.rv.badge.noProperty");
}

function badgeSecondary(badge: CustomBadge): string | null {
	if (badge.type === "newline" || badge.type === "separator") return null;
	if (badge.formula) {
		return badge.formula.length > 48 ? badge.formula.slice(0, 48) + "…" : badge.formula;
	}
	const label = badge.label?.trim();
	if (label && label !== badge.property) return label;
	return null;
}

function renderBadgeList(
	listEl: HTMLElement,
	settings: RecipeBoxSettings,
	save: () => Promise<void>,
	app: App,
	getDiscovery?: () => DiscoveryResult | null,
): void {
	listEl.empty();
	let dragFromIndex = -1;

	settings.headerBadges.forEach((badge, i) => {
		const row = listEl.createDiv({ cls: "rb-badge-row" });

		if (!Platform.isMobile) {
			row.setAttribute("draggable", "true");
			const handle = row.createSpan({ cls: "rb-badge-drag-handle", text: "⠿" });
			handle.setAttribute("aria-hidden", "true");
		}

		// Enabled checkbox
		const checkbox = row.createEl("input", { type: "checkbox" });
		checkbox.checked = badge.enabled;
		checkbox.addEventListener("change", () => {
			badge.enabled = checkbox.checked;
			void save();
		});


		const isFormula = !!badge.formula;
		const info = row.createDiv({ cls: "rb-badge-info" });
		if (isFormula) info.createSpan({ cls: "rb-badge-formula-tag", text: "f" });
		const textWrap = info.createDiv({ cls: "rb-badge-text" });
		textWrap.createSpan({ cls: "rb-badge-primary", text: badgePrimary(badge) });
		const sub = badgeSecondary(badge);
		if (sub) textWrap.createSpan({ cls: "rb-badge-secondary", text: sub });



		// Delete button — available for all badges
		const del = row.createEl("button", { cls: "rb-badge-delete clickable-icon" });
		del.setAttribute("aria-label", t("set.rv.badges.removeBadge"));
		setIcon(del, "trash-2");
		del.addEventListener("click", (e) => {
			e.stopPropagation();
			settings.headerBadges.splice(i, 1);
			void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
		});

		// Click info area to edit (not checkbox/delete/handle)
		if (badge.type !== "newline") {
			info.setCssProps({ cursor: "pointer" });
			info.addEventListener("click", () => {
				if (badge.type === "separator") {
					new SeparatorEditModal(app, badge, (updated) => {
						Object.assign(badge, updated);
						void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
					}).open();
				} else {
					new BadgeEditModal(app, badge, (updated) => {
						Object.assign(badge, updated);
						void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
					}, false, getDiscovery, () => settings).open();
				}
			});
		}

		if (Platform.isMobile) {
			// ↑/↓ buttons replace drag on mobile — HTML5 drag-and-drop freezes the touch UI
			const up = row.createEl("button", { cls: "rb-badge-delete clickable-icon", text: "↑" });
			const dn = row.createEl("button", { cls: "rb-badge-delete clickable-icon", text: "↓" });
			up.disabled = i === 0;
			dn.disabled = i === settings.headerBadges.length - 1;
			up.addEventListener("click", (e) => {
				e.stopPropagation();
				[settings.headerBadges[i - 1], settings.headerBadges[i]] =
					[settings.headerBadges[i], settings.headerBadges[i - 1]];
				void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
			});
			dn.addEventListener("click", (e) => {
				e.stopPropagation();
				[settings.headerBadges[i], settings.headerBadges[i + 1]] =
					[settings.headerBadges[i + 1], settings.headerBadges[i]];
				void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
			});
		} else {
			// Desktop: HTML5 drag-and-drop reorder
			row.addEventListener("dragstart", (e) => {
				dragFromIndex = i;
				e.dataTransfer!.effectAllowed = "move";
				row.addClass("is-dragging");
			});
			row.addEventListener("dragend", () => row.removeClass("is-dragging"));
			row.addEventListener("dragover", (e) => {
				e.preventDefault();
				e.dataTransfer!.dropEffect = "move";
				listEl.querySelectorAll(".rb-badge-row").forEach((r) => r.removeClass("drop-target"));
				row.addClass("drop-target");
			});
			row.addEventListener("dragleave", () => row.removeClass("drop-target"));
			row.addEventListener("drop", (e) => {
				e.preventDefault();
				row.removeClass("drop-target");
				if (dragFromIndex < 0 || dragFromIndex === i) return;
				const [moved] = settings.headerBadges.splice(dragFromIndex, 1);
				settings.headerBadges.splice(i, 0, moved);
				dragFromIndex = -1;
				void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
			});
		}
	});

	// Footer actions
	const footer = listEl.createDiv({ cls: "rb-badge-footer" });

	footer.createEl("button", { text: t("set.rv.badges.addBadge") }).addEventListener("click", () => {
		const blank: CustomBadge = {
			type: "badge", property: "", label: "",
			color: "default", valueType: "auto", splitArray: false,
			enabled: true, builtin: false,
		};
		new BadgeEditModal(app, blank, (created) => {
			settings.headerBadges.push(created);
			void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
		}, true, getDiscovery, () => settings).open();
	});

	footer.createEl("button", { text: t("set.rv.badges.addSeparator") }).addEventListener("click", () => {
		new SeparatorEditModal(app, null, (badge) => {
			settings.headerBadges.push(badge);
			void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
		}).open();
	});

	footer.createEl("button", { text: t("set.rv.badges.addNewline") }).addEventListener("click", () => {
		settings.headerBadges.push({
			type: "newline", property: "", label: "",
			color: "default", valueType: "auto", splitArray: false,
			enabled: true, builtin: false,
		});
		void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
	});

	let resetPending = false;
	let resetTimer: number | null = null;
	const resetBtn = footer.createEl("button", { text: t("set.rv.badges.reset") });
	resetBtn.addEventListener("click", () => {
		if (!resetPending) {
			resetPending = true;
			resetBtn.textContent = t("set.rv.badges.confirmReset");
			resetTimer = window.setTimeout(() => { resetPending = false; resetBtn.textContent = t("set.rv.badges.reset"); }, 3000);
		} else {
			if (resetTimer) window.clearTimeout(resetTimer);
			settings.headerBadges = structuredClone(DEFAULT_SETTINGS.headerBadges);
			void save().then(() => renderBadgeList(listEl, settings, save, app, getDiscovery));
		}
	});
}
