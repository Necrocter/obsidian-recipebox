/**
 * Renders the seven-column week grid and the unscheduled queue column for
 * the meal plan view, wiring drag-drop, recipe picker, and meal type popover.
 */
import { App, setIcon } from "obsidian";
import { t, canonicalDay, dayLabel } from "../../i18n";
import { MealPlanEntry } from "../../types";
import { MealPlanViewDeps } from "./meal-plan-view-deps";
import { renderRecipeCard } from "./recipe-card";
import { makeDropTarget, makeDraggable } from "./drag-reschedule";
import { RecipePickerModal } from "../modals/recipe-picker-modal";
import { showMealTypePopover, PopoverAnchor } from "./meal-type-popover";

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const KNOWN_DAY_KEYS = new Set<string>(DAY_KEYS);

// Built per render, not at module load: the active language is not resolved
// until after settings load, so a module-level t() call would freeze the
// column labels in English.
function dayColumns(): Array<{ label: string; dayKey: string }> {
	return DAY_KEYS.map((dayKey) => ({ label: dayLabel(dayKey), dayKey }));
}

function renderCustomMealCard(container: HTMLElement, entry: MealPlanEntry, deps: MealPlanViewDeps): void {
	const card = container.createDiv({ cls: "rb-mpv-card rb-mpv-card--custom" });
	if (entry.isLeftovers) card.addClass("rb-mpv-card--leftovers");
	makeDraggable(card, entry.id);

	// Thumbnail placeholder: same block as recipe cards, but with a lighter tint
	// and a centered icon so the card shape is identical.
	const thumb = card.createDiv({ cls: "rb-mpv-card-thumb rb-mpv-card-thumb--empty rb-mpv-card-thumb--custom" });
	setIcon(thumb, entry.isLeftovers ? "utensils-crossed" : "utensils");

	const body = card.createDiv({ cls: "rb-mpv-card-body" });
	body.createDiv({ cls: "rb-mpv-card-name", text: entry.label ?? t("mpv.customMeal") });
	if (entry.meal) body.createDiv({ cls: "rb-mpv-card-meal", text: entry.meal });
	if (entry.isLeftovers) body.createDiv({ cls: "rb-mpv-card-leftovers-badge", text: t("mpv.leftovers") });

	card.addEventListener("click", () => {
		deps.openEditEntryModal(entry);
	});

	const actions = card.createDiv({ cls: "rb-mpv-card-actions" });
	const editBtn = actions.createEl("button", { cls: "rb-mpv-card-action-btn", attr: { title: t("common.edit") } });
	setIcon(editBtn, "pencil");
	editBtn.addEventListener("click", (e) => { e.stopPropagation(); deps.openEditEntryModal(entry); });
	const removeBtn = actions.createEl("button", { cls: "rb-mpv-card-action-btn rb-mpv-card-action-btn--danger", attr: { title: t("common.remove") } });
	setIcon(removeBtn, "trash-2");
	removeBtn.addEventListener("click", (e) => { e.stopPropagation(); void deps.removeFromMealPlan(entry.id); });
}

function renderColumn(
	container: HTMLElement,
	label: string,
	colEntries: MealPlanEntry[],
	dayKey: string | undefined,
	app: App,
	deps: MealPlanViewDeps,
): void {
	const colEl = container.createDiv({ cls: "rb-mpv-col" });

	const header = colEl.createDiv({ cls: "rb-mpv-col-header" });
	header.createSpan({ cls: "rb-mpv-col-day", text: label });
	header.createSpan({ cls: "rb-mpv-col-count", text: String(colEntries.length) });

	const addBtn = header.createEl("button", { cls: "rb-mpv-col-add", attr: { title: t("mpv.col.addTo", { label }), "aria-label": t("mpv.col.addTo", { label }) } });
	addBtn.setText("+");
	addBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		new RecipePickerModal(
			app, deps.getSettings(), dayKey,
			(file) => { deps.openAddToMealPlanModal(file, { day: dayKey }); },
			(label) => { deps.openAddCustomMealModal(label, dayKey); },
		).open();
	});

	const body = colEl.createDiv({ cls: "rb-mpv-col-body" });

	if (colEntries.length === 0) {
		body.createDiv({ cls: "rb-mpv-col-empty", text: t("mpv.col.dropHere") });
	} else {
		for (const entry of colEntries) {
			if (entry.recipePath) {
				renderRecipeCard(body, entry, app, deps);
			} else {
				renderCustomMealCard(body, entry, deps);
			}
		}
	}

	makeDropTarget(colEl, dayKey, app, (payload, newDay, dropPoint) => {
		const anchor: PopoverAnchor = { kind: "point", x: dropPoint.x, y: dropPoint.y };
		if (payload.kind === "entry") {
			const existing = deps.getMealPlan().find(e => e.id === payload.id);
			void deps.rescheduleMealPlanEntry(payload.id, newDay).then(() => {
				if (existing && existing.recipePath && !existing.meal) showMealTypePopover(anchor, payload.id, deps);
			});
		} else {
			void deps.addToMealPlan(payload.path, newDay).then((newId) => {
				if (newId) showMealTypePopover(anchor, newId, deps);
			});
		}
	});
}

export function renderWeekGrid(
	container: HTMLElement,
	entries: MealPlanEntry[],
	app: App,
	deps: MealPlanViewDeps
): void {
	const grid = container.createDiv({ cls: "rb-mpv-grid" });

	// Queue — full-width strip at top
	const unscheduledEntries = entries.filter(e => !e.day || !KNOWN_DAY_KEYS.has(e.day.toLowerCase()));
	renderColumn(grid, t("mpv.queue"), unscheduledEntries, undefined, app, deps);

	// Day columns — wrap naturally to available width
	const daysRow = grid.createDiv({ cls: "rb-mpv-days-row" });
	for (const col of dayColumns()) {
		const colEntries = entries.filter(e => e.day?.toLowerCase() === col.dayKey);
		// Pass the canonical English day ("Monday"), not the localised label,
		// as the column's day: it becomes the drop-target day and is written
		// into entry.day, which the rest of the plugin keys off in English.
		// (Previously this passed col.label, which happened to be "Monday" in
		// English but "Lunes" once the UI language changed, corrupting state.)
		renderColumn(daysRow, col.label, colEntries, canonicalDay(col.dayKey), app, deps);
	}
}
