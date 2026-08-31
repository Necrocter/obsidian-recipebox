/**
 * Registers the bundled Tabler subset + the hand-authored icons with Obsidian's
 * icon registry so `setIcon(el, "rb-<name>")` works anywhere. Call once from
 * onload(), before views/commands register. Idempotent (addIcon overwrites).
 */
import { addIcon } from "obsidian";
import { RB_TABLER_ICONS } from "./rb-icons";
import { RB_AUTHORED_ICONS, RB_AUTHORED_ICON_NAMES } from "./rb-icons.authored";

let registered = false;

export function registerRbIcons(): void {
	if (registered) return;
	for (const [name, svg] of Object.entries({ ...RB_TABLER_ICONS, ...RB_AUTHORED_ICONS })) {
		addIcon(name, svg);
	}
	registered = true;
}

/** Every icon id the method/equipment map is allowed to reference: bundled
 *  Tabler ids + the intended hand-authored ids (registered once drawn). */
export function rbIconIds(): string[] {
	return [...Object.keys(RB_TABLER_ICONS), ...RB_AUTHORED_ICON_NAMES];
}
