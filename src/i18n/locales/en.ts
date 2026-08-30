/**
 * English string catalogue and the single source of truth for translation
 * keys. Every user-facing string in the plugin has an entry here; other
 * locales (see es.ts) are typed against this object's keys, so a missing
 * translation is a compile error rather than a silent English fallback.
 *
 * Keys are flat and dot-namespaced by feature area ("settings.notes.*",
 * "notice.*", "modal.*") to keep them greppable. `{name}`-style placeholders
 * are filled by t()'s second argument.
 */
export const en = {
	// ── Ribbon icons ────────────────────────────────────────────────────────
	"ribbon.dashboard": "Recipe box dashboard",
	"ribbon.openGrocery": "Open grocery list",
	"ribbon.openMealPlan": "Open meal plan",
	"ribbon.browseRecipes": "Browse recipes",

	// ── Command palette ─────────────────────────────────────────────────────
	"command.openGrocery": "Open grocery list",
	"command.openMealPlan": "Open meal plan",
	"command.openGallery": "Open recipe gallery",
	"command.importRecipe": "Import recipe",
	"command.addGroceryItem": "Add grocery item",
	"command.toggleRecipeInMealPlan": "Toggle current recipe in meal plan",
	"command.openCurrentAsRecipe": "Open current file as recipe",
	"command.openCurrentAsMarkdown": "Open current file as Markdown",
	"command.exportCurrentRecipe": "Export current recipe",
	"command.shareThisRecipe": "Share this recipe",
	"command.suggestMeal": "Suggest a meal",
	"command.openDashboard": "Open recipe dashboard",

	// ── Notices (transient toasts) ─────────────────────────────────────────
	"notice.mealPlanCleared.one": "Cleared 1 meal plan entry.",
	"notice.mealPlanCleared.other": "Cleared {count} meal plan entries.",
	"notice.timerDone": "Timer done: {label}",
	"notice.groceryListCleared": "Grocery list cleared.",
	"notice.cookModeOn": "Cook mode on · screen will stay awake",
	"notice.cookModeOff": "Cook mode off",
	"notice.wakeLockUnsupported": "Screen wake lock is not supported on this device.",
	"notice.wakeLockFailed": "Could not activate screen wake lock.",
	"notice.nameRequired": "Name is required.",
	"notice.enterNotePath": "Please enter a note path.",
	"notice.nothingToExportList": "Nothing to export — the list is empty with the current options.",
	"notice.targetMustBeMarkdown": "Target must be a Markdown file.",
	"notice.exportedTo": "Exported to {path}.",
	"notice.appendedTo": "Appended to {path}.",
	"notice.failedWriteNote": "Failed to write note: {error}",
	"notice.nothingToExport": "Nothing to export.",
	"notice.pathExists": "{path} already exists. Choose a different path.",
	"notice.downloadedFile": "Downloaded {filename}.",
	"notice.linkCopied": "Link copied to clipboard.",
	"notice.failedShare": "Failed to share recipe: {error}",
	"notice.recipeUnshared": "Recipe unshared.",
	"notice.failedUnshare": "Failed to unshare recipe: {error}",
	"notice.tiktokTruncated": "Tiktok captions may be truncated in page metadata — double-check ingredient completeness.",
	"notice.pasteRecipeText": "Please paste some recipe text.",
	"notice.recipeSaved": "Recipe saved: {filename}",
	"notice.failedSaveRecipe": "Failed to save recipe: {error}",
	"notice.itemAddedToGrocery": "{name} added to grocery list.",
	"notice.itemRemovedFromGrocery": "{name} removed from grocery list.",
	"notice.recipeAddedToMealPlan": "{name} added to meal plan",
	"notice.recipeAddedToMealPlanWhen": "{name} added to meal plan ({when})",
	"notice.recipeRemovedFromMealPlan": "{name} removed from meal plan.",
	"notice.groceryItemsAdded.one": "1 item added to grocery list.",
	"notice.groceryItemsAdded.other": "{count} items added to grocery list.",
	"notice.itemsAdded.one": "1 item added",
	"notice.itemsAdded.other": "{count} items added",
	"notice.itemsRemoved.one": "1 item removed",
	"notice.itemsRemoved.other": "{count} items removed",
} as const;

export type TranslationKey = keyof typeof en;
