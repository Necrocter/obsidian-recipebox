/**
 * The H1 title a note gets when the plugin creates or re-renders it: the
 * file's own name, without folders or the ".md" extension. Keeps a renamed
 * note's heading in step with its filename -- "Plan de comida.md" stays
 * "# Plan de comida" instead of being forced back to "# Meal Plan".
 */
export function noteTitleFromPath(notePath: string): string {
	const base = notePath.split("/").pop() ?? notePath;
	return base.replace(/\.md$/i, "").trim() || "Untitled";
}

/** True for a top-level "# Title" line, not a "## Section" heading. */
export function isH1Line(line: string): boolean {
	const t = line.trim();
	return t === "#" || t.startsWith("# ");
}
