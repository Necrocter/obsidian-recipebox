/**
 * Reads a recipe's source from frontmatter, if any. `sourceProperty` (the
 * configurable settings key, default "source") is checked first, then the
 * historical fallbacks so existing notes keep working. Left optional: the
 * share-image origin heuristic calls this without settings in scope.
 */
const DEFAULT_SOURCE_KEYS = ["source", "url", "sourceUrl", "source_url"] as const;

export function findSourceUrl(
	frontmatter: Record<string, unknown>,
	sourceProperty?: string,
): string | null {
	const configured = sourceProperty?.trim();
	const keys = configured ? [configured, ...DEFAULT_SOURCE_KEYS] : [...DEFAULT_SOURCE_KEYS];
	for (const key of new Set(keys)) {
		const value = frontmatter[key];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
	return null;
}
