/**
 * Renders a row of stats about the current gallery view, based on the current
 * GallerySavedState and the number of files that passed the filters.
 */
import { TFile } from "obsidian";
import { t } from "../../i18n";
import { GallerySavedState, GallerySortField } from "../../settings/settings-types";



function sortFieldLabel(f: GallerySortField): string {
	const map: Record<GallerySortField, string> = {
		title: t("gallery.sort.title"),
		"date-added": t("gallery.sort.dateAdded"),
		"date-modified": t("gallery.sort.dateModified"),
		"last-cooked": t("gallery.sort.lastCooked"),
		rating: t("gallery.sort.rating"),
		"times-cooked": t("gallery.sort.timesCooked"),
	};
	return map[f];
}

export function renderStatsRow(
	container: HTMLElement,
	files: TFile[],
	state: GallerySavedState
): void {

	type FilterChip = { key: keyof GallerySavedState; label: string };

	const filterChips: FilterChip[] = [];
	if (state.folder) filterChips.push({ key: "folder", label: t("gallery.stats.inFolder", { folder: state.folder }) });
	if (state.favoriteOnly) filterChips.push({ key: "favoriteOnly", label: t("gallery.stats.favoritesOnly") });
	if (state.tag) filterChips.push({ key: "tag", label: t("gallery.stats.tagged", { tag: state.tag }) });
	if (state.minRating > 0) filterChips.push({ key: "minRating", label: t("gallery.stats.minRating", { n: state.minRating }) });
	if (state.neverCooked) filterChips.push({ key: "neverCooked", label: t("gallery.stats.neverCooked") });
	if (state.excludeAllergens) filterChips.push({ key: "excludeAllergens", label: t("gallery.stats.excludingAllergens") });

	const statsrow = container.createDiv({ cls: "rb-gallery-stats-row" });

	const countDiv = statsrow.createDiv({ cls: "rb-gallery-stats-count" });
	countDiv.createEl("strong", { text: String(files.length) });
	countDiv.createSpan({
		text: " " + (files.length === 1 ? t("gallery.stats.foundSuffix.one") : t("gallery.stats.foundSuffix.other")),
	});

	if (filterChips.length > 0) {
		const filterGroup = statsrow.createDiv({ cls: "rb-gallery-stats-filters" });
		for (const chip of filterChips) {
			filterGroup.createDiv({ cls: "rb-gallery-stats", text: chip.label });
		}
	}

	statsrow.createDiv({
		cls: "rb-gallery-stats-sort",
		text: t("gallery.stats.sortedBy", { field: sortFieldLabel(state.sortField), dir: t(state.sortDirection === "asc" ? "gallery.dir.asc" : "gallery.dir.desc") }),
	});
}
