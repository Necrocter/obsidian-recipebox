/**
 * Read/write helpers for the pantry note used by the "what can I cook?"
 * matcher. The note is plain markdown, one ingredient per list item, in any
 * section. Checkbox state is honoured:
 *
 *   - [x] sal        -> have it
 *   - [ ] cilantro   -> ran out (does NOT count as available)
 *   - harina         -> have it (a plain list without checkboxes still works)
 *
 * Headings, blockquotes and prose are ignored, so the note can carry section
 * headers and a "normally don't stock" comment block.
 *
 * No Obsidian imports: pure string in / string out, unit tested.
 */
import { normaliseName, stripListMarkers } from "./ingredient-clean";

// group 1: list marker · group 2: checkbox char (undefined when there is no
// "[ ]" at all) · group 3: the item text
const ITEM_RE = /^(?:[-*+]|\d+\.)\s+(?:\[([ xX])\]\s+)?(.*\S)\s*$/;
const TRAILING_PAREN_RE = /\s*\([^)]*\)\s*$/;
const TRAILING_TAGS_RE = /(?:\s+#[\w/-]+)+\s*$/;

export interface PantryItem {
	/** normaliseName() of the display text -- the match key. */
	name: string;
	/** the item text as written, sans trailing "(note)" / "#tag". */
	display: string;
	/** false only for an explicitly unchecked "[ ]" item. */
	have: boolean;
}

function isSkippable(line: string): boolean {
	return !line || line.startsWith("#") || line.startsWith(">");
}

export function parsePantryItems(text: string): PantryItem[] {
	const items: PantryItem[] = [];
	for (const rawLine of text.split("\n")) {
		const line = rawLine.trim();
		if (isSkippable(line)) continue;
		const m = ITEM_RE.exec(line);
		if (!m) continue;
		const checkbox = m[1]; // undefined | " " | "x" | "X"
		const have = checkbox === undefined ? true : checkbox.toLowerCase() === "x";
		const display = stripListMarkers(line)
			.replace(/^\[[ xX]\]\s+/, "")
			.replace(TRAILING_TAGS_RE, "")
			.replace(TRAILING_PAREN_RE, "")
			.trim();
		const name = normaliseName(display);
		if (name) items.push({ name, display, have });
	}
	return items;
}

/** The set of ingredient names the pantry currently has. */
export function pantrySet(text: string): Set<string> {
	const out = new Set<string>();
	for (const item of parsePantryItems(text)) {
		if (item.have) out.add(item.name);
	}
	return out;
}

/**
 * Ensure each of `names` is present in the pantry note and marked as had:
 * an existing "[ ]" line is ticked, a missing item is appended as "- [x] name"
 * at the end of the note. Returns the new note text (unchanged if nothing to
 * do). Order-preserving; appended items keep their given display casing.
 */
export function addToPantry(text: string, names: string[]): { text: string; added: number; ticked: number } {
	const wanted = new Map<string, string>(); // key -> display
	for (const raw of names) {
		const display = raw.trim();
		const key = normaliseName(display);
		if (key && !wanted.has(key)) wanted.set(key, display);
	}
	if (wanted.size === 0) return { text, added: 0, ticked: 0 };

	const lines = text.split("\n");
	let ticked = 0;
	const present = new Set<string>();

	for (let i = 0; i < lines.length; i++) {
		const trimmed = lines[i].trim();
		if (isSkippable(trimmed)) continue;
		const m = ITEM_RE.exec(trimmed);
		if (!m) continue;
		const body = stripListMarkers(trimmed).replace(/^\[[ xX]\]\s+/, "");
		const key = normaliseName(body.replace(TRAILING_TAGS_RE, "").replace(TRAILING_PAREN_RE, "").trim());
		if (!key || !wanted.has(key)) continue;
		present.add(key);
		if (m[1] === " ") {
			lines[i] = lines[i].replace(/\[ \]/, "[x]");
			ticked++;
		}
	}

	const toAppend = [...wanted].filter(([key]) => !present.has(key)).map(([, display]) => `- [x] ${display}`);
	if (toAppend.length === 0) return { text: lines.join("\n"), added: 0, ticked };

	// normalise to exactly one trailing newline before appending
	while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
	lines.push("", ...toAppend, "");
	return { text: lines.join("\n"), added: toAppend.length, ticked };
}
