/**
 * Filter expression shapes for the generic recipe filtering engine.
 * Tags are encoded as pseudo-fields with a "#" prefix (e.g. "#vegetarian").
 */

// FieldFilter lives in types.ts so that strategy-types.ts can import it without
// creating a transitive back-edge from discovery-cache.ts into this directory.
import type { FieldFilter } from "../suggester/strategy-types";
import type { TranslationKey } from "../i18n";
export type { FieldFilter };

/** Inferred data type for a discovered frontmatter field. */
export type FieldType = "number" | "date" | "boolean" | "string";

/** Tags form their own pseudo-type separate from the four inferred types. */
export type FilterableType = FieldType | "tag";

/**
 * Valid operators for each filterable type. `label` is the English display
 * string; `labelKey` is the i18n key the UI actually renders (label is kept
 * as a readable in-source reference and a fallback). `id` is the persisted
 * value and never localised.
 */
export const OPERATORS: Record<
	FilterableType,
	readonly { id: string; label: string; labelKey: TranslationKey }[]
> = {
	number: [
		{ id: "eq", label: "equals", labelKey: "filter.op.equals" },
		{ id: "gt", label: "greater than", labelKey: "filter.op.greaterThan" },
		{ id: "lt", label: "less than", labelKey: "filter.op.lessThan" },
		{ id: "between", label: "between", labelKey: "filter.op.between" },
	],
	date: [
		{ id: "eq", label: "is on", labelKey: "filter.op.isOn" },
		{ id: "before", label: "before", labelKey: "filter.op.before" },
		{ id: "after", label: "after", labelKey: "filter.op.after" },
		{ id: "within-last", label: "within last N days", labelKey: "filter.op.withinLast" },
		{ id: "not-within-last", label: "not within last N days", labelKey: "filter.op.notWithinLast" },
		{ id: "between", label: "between", labelKey: "filter.op.between" },
	],
	boolean: [
		{ id: "is-true", label: "is true", labelKey: "filter.op.isTrue" },
		{ id: "is-false", label: "is false", labelKey: "filter.op.isFalse" },
	],
	string: [
		{ id: "eq", label: "equals", labelKey: "filter.op.equals" },
		{ id: "contains", label: "contains", labelKey: "filter.op.contains" },
		{ id: "one-of", label: "is one of", labelKey: "filter.op.oneOf" },
	],
	tag: [
		{ id: "has", label: "has tag", labelKey: "filter.op.hasTag" },
		{ id: "not-has", label: "doesn't have tag", labelKey: "filter.op.notHasTag" },
	],
};

/** All filters are ANDed: a recipe must pass every filter. */
export type FilterSet = FieldFilter[];
