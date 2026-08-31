/**
 * The vault watcher runs a full state<->note reconciliation
 * (syncFromMealPlanNote) on every meal-plan-note change. Plugin-initiated edits
 * -- especially the remove-then-insert used to change an entry's day or meal
 * type -- leave the note momentarily missing a line; a reconcile in that gap
 * deletes the entry from state (it "disappears" from the view). Callers wrap
 * their own writes in a suppression window so the watcher skips those change
 * events. Genuine external edits after the window still reconcile normally.
 */
let suppressUntil = 0;

/** Ignore watcher-triggered meal-plan syncs for the next `ms` milliseconds.
 *  Extends an existing window rather than shortening it. */
export function suppressMealPlanSync(ms = 1200): void {
	suppressUntil = Math.max(suppressUntil, Date.now() + ms);
}

export function isMealPlanSyncSuppressed(): boolean {
	return Date.now() < suppressUntil;
}
