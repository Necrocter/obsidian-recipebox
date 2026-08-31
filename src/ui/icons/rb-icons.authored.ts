/**
 * Hand-authored line icons for kitchen concepts Tabler has no icon for, drawn to
 * the exact Tabler spec (24x24 grid, fill:none, stroke:currentColor,
 * stroke-width:2, round caps/joins, ~2px padding) so they are indistinguishable
 * from the bundled Tabler set. Original work — no attribution required.
 *
 * RB_AUTHORED_ICON_NAMES is the full intended set (so the method/equipment map
 * can reference them and tests can validate). RB_AUTHORED_ICONS is populated
 * after the drafts are visually reviewed; until then the affected chips render a
 * label with no icon.
 */
export const RB_AUTHORED_ICON_NAMES = [
	"rb-pan",
	"rb-pot",
	"rb-baking-dish",
	"rb-colander",
	"rb-grater",
	"rb-mortar",
	"rb-peeler",
	"rb-fork",
	"rb-plate",
	"rb-platter",
	"rb-jar",
	"rb-cutting-board",
	"rb-towel",
	"rb-crumble",
] as const;

export const RB_AUTHORED_ICONS: Record<string, string> = {};
