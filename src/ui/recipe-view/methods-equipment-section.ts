/**
 * Renders the recipe's cooking methods and equipment as flat rows of icons
 * beneath the meta banner. Icons are always visible; the group label doubles as
 * a toggle that reveals every label at once, and tapping a single icon reveals
 * just its label. No-op when the toggle is off or both lists are empty.
 */
import { setIcon } from "obsidian";
import { t } from "../../i18n";
import { RecipeBoxSettings } from "../../settings/settings-types";
import { RecipeMeta } from "../../parser/recipe-meta-read";
import { methodIcon, equipmentIcon, METHOD_FALLBACK, EQUIPMENT_FALLBACK } from "../../parser/method-equipment-icons";

function titleCase(term: string): string {
	return term.charAt(0).toUpperCase() + term.slice(1);
}

function renderGroup(
	parent: HTMLElement,
	label: string,
	terms: string[],
	iconFor: (t: string) => string,
	fallback: string,
): void {
	if (terms.length === 0) return;
	const group = parent.createDiv({ cls: "rb-me-group" });

	// The label is the "show all labels" toggle.
	const toggle = group.createSpan({
		cls: "rb-me-group-toggle",
		attr: { role: "button", tabindex: "0", "aria-label": t("rview.methodsEquipment.toggleAll") },
	});
	toggle.createSpan({ cls: "rb-me-group-label", text: label });
	setIcon(toggle.createSpan({ cls: "rb-me-chevron" }), "chevron-right");
	const toggleAll = (): void => { group.classList.toggle("is-expanded"); };
	toggle.addEventListener("click", toggleAll);
	toggle.addEventListener("keydown", (e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleAll(); }
	});

	const chips = group.createDiv({ cls: "rb-me-chips" });
	for (const term of terms) {
		const display = titleCase(term);
		const icon = iconFor(term);
		const chip = chips.createSpan({
			cls: "rb-me-chip",
			attr: { role: "button", tabindex: "0", "aria-label": display, title: display },
		});
		setIcon(chip.createSpan({ cls: "rb-me-icon" }), icon);
		chip.createSpan({ cls: "rb-me-label", text: display });

		const toggleOne = (): void => { chip.classList.toggle("is-open"); };
		chip.addEventListener("click", toggleOne);
		chip.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleOne(); }
		});

		if (icon === fallback) console.debug(`[recipe-box] no icon mapped for "${term}"`);
	}
}

export function renderMethodsEquipmentSection(
	container: HTMLElement,
	meta: RecipeMeta,
	settings: RecipeBoxSettings,
): void {
	if (!settings.showMethodsEquipment) return;
	if (meta.methods.length === 0 && meta.equipment.length === 0) return;

	const section = container.createDiv({ cls: "rb-me-section" });
	renderGroup(section, t("rview.methods"), meta.methods, methodIcon, METHOD_FALLBACK);
	renderGroup(section, t("rview.equipment"), meta.equipment, equipmentIcon, EQUIPMENT_FALLBACK);
}
