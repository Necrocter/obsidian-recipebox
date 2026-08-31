/**
 * Registers the bundled Tabler subset + the hand-authored icons with Obsidian's
 * icon registry so `setIcon(el, "rb-<name>")` works anywhere. Call once from
 * onload(), before views/commands register. Idempotent.
 *
 * Obsidian's addIcon() drops the content into an SVG with a `0 0 100 100`
 * viewBox, so the stored 24-grid markup is unwrapped and scaled ~4.167x to fill
 * it.
 */
import { addIcon } from "obsidian";
import { RB_TABLER_ICONS } from "./rb-icons";
import { RB_AUTHORED_ICONS, RB_AUTHORED_ICON_NAMES } from "./rb-icons.authored";

let registered = false;

const SCALE = (100 / 24).toFixed(5); // 4.16667

/** Strip the outer <svg …> wrapper and scale the 24-grid content into 0 0 100 100. */
function toObsidianIcon(svg: string): string {
	const inner = svg.replace(/^\s*<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
	return `<g transform="scale(${SCALE})">${inner}</g>`;
}

export function registerRbIcons(): void {
	if (registered) return;
	for (const [name, svg] of Object.entries({ ...RB_TABLER_ICONS, ...RB_AUTHORED_ICONS })) {
		addIcon(name, toObsidianIcon(svg));
	}
	registered = true;
}

/** Every icon id the method/equipment map is allowed to reference: bundled
 *  Tabler ids + the intended hand-authored ids. */
export function rbIconIds(): string[] {
	return [...Object.keys(RB_TABLER_ICONS), ...RB_AUTHORED_ICON_NAMES];
}
