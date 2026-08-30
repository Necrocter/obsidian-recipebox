/**
 * Spanish (es) string catalogue. Typed as a complete map of every key in
 * en.ts, so adding a key upstream without a Spanish translation fails the
 * build instead of silently shipping English.
 *
 * Style: neutral/international Spanish, "tú" address for actions the user
 * takes, no regionalisms. No em dashes (project convention).
 */
import type { TranslationKey } from "./en";

export const es: Record<TranslationKey, string> = {
	// ── Iconos de la barra lateral ─────────────────────────────────────────
	"ribbon.dashboard": "Panel de Recipe Box",
	"ribbon.openGrocery": "Abrir lista de la compra",
	"ribbon.openMealPlan": "Abrir plan de comidas",
	"ribbon.browseRecipes": "Explorar recetas",

	// ── Paleta de comandos ────────────────────────────────────────────────
	"command.openGrocery": "Abrir lista de la compra",
	"command.openMealPlan": "Abrir plan de comidas",
	"command.openGallery": "Abrir galería de recetas",
	"command.importRecipe": "Importar receta",
	"command.addGroceryItem": "Añadir artículo a la lista de la compra",
	"command.toggleRecipeInMealPlan": "Añadir o quitar la receta actual del plan de comidas",
	"command.openCurrentAsRecipe": "Abrir el archivo actual como receta",
	"command.openCurrentAsMarkdown": "Abrir el archivo actual como Markdown",
	"command.exportCurrentRecipe": "Exportar la receta actual",
	"command.shareThisRecipe": "Compartir esta receta",
	"command.suggestMeal": "Sugerir una comida",
	"command.openDashboard": "Abrir el panel de recetas",

	// ── Avisos (mensajes temporales) ──────────────────────────────────────
	"notice.mealPlanCleared.one": "Se ha borrado 1 entrada del plan de comidas.",
	"notice.mealPlanCleared.other": "Se han borrado {count} entradas del plan de comidas.",
	"notice.timerDone": "Temporizador terminado: {label}",
	"notice.groceryListCleared": "Lista de la compra vaciada.",
	"notice.cookModeOn": "Modo cocina activado · la pantalla permanecerá encendida",
	"notice.cookModeOff": "Modo cocina desactivado",
	"notice.wakeLockUnsupported": "Este dispositivo no permite mantener la pantalla encendida.",
	"notice.wakeLockFailed": "No se pudo mantener la pantalla encendida.",
	"notice.nameRequired": "El nombre es obligatorio.",
	"notice.enterNotePath": "Introduce la ruta de una nota.",
	"notice.nothingToExportList": "No hay nada que exportar: la lista está vacía con las opciones actuales.",
	"notice.targetMustBeMarkdown": "El destino debe ser un archivo Markdown.",
	"notice.exportedTo": "Exportado a {path}.",
	"notice.appendedTo": "Añadido a {path}.",
	"notice.failedWriteNote": "No se pudo escribir la nota: {error}",
	"notice.nothingToExport": "No hay nada que exportar.",
	"notice.pathExists": "{path} ya existe. Elige otra ruta.",
	"notice.downloadedFile": "Descargado {filename}.",
	"notice.linkCopied": "Enlace copiado al portapapeles.",
	"notice.failedShare": "No se pudo compartir la receta: {error}",
	"notice.recipeUnshared": "Se ha dejado de compartir la receta.",
	"notice.failedUnshare": "No se pudo dejar de compartir la receta: {error}",
	"notice.tiktokTruncated": "Los textos de TikTok pueden aparecer recortados en los metadatos de la página; revisa que la lista de ingredientes esté completa.",
	"notice.pasteRecipeText": "Pega el texto de una receta.",
	"notice.recipeSaved": "Receta guardada: {filename}",
	"notice.failedSaveRecipe": "No se pudo guardar la receta: {error}",
	"notice.itemAddedToGrocery": "{name} añadido a la lista de la compra.",
	"notice.itemRemovedFromGrocery": "{name} eliminado de la lista de la compra.",
	"notice.recipeAddedToMealPlan": "{name} añadido al plan de comidas",
	"notice.recipeAddedToMealPlanWhen": "{name} añadido al plan de comidas ({when})",
	"notice.recipeRemovedFromMealPlan": "{name} eliminado del plan de comidas.",
	"notice.groceryItemsAdded.one": "1 artículo añadido a la lista de la compra.",
	"notice.groceryItemsAdded.other": "{count} artículos añadidos a la lista de la compra.",
	"notice.itemsAdded.one": "1 artículo añadido",
	"notice.itemsAdded.other": "{count} artículos añadidos",
	"notice.itemsRemoved.one": "1 artículo eliminado",
	"notice.itemsRemoved.other": "{count} artículos eliminados",
};
