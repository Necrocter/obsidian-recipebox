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
};
