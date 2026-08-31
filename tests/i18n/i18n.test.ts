import { describe, it, expect, vi } from "vitest";

// i18n's index module imports getLanguage() from obsidian; Node can't resolve
// the real package in tests, so stub the single symbol it uses.
vi.mock("obsidian", () => ({ getLanguage: () => "" }));

import { en } from "../../src/i18n/locales/en";
import { es } from "../../src/i18n/locales/es";
import { t, tPlural, setActiveLanguage, resolveLocale, dayLabel, canonicalDay } from "../../src/i18n";

const PLACEHOLDER_RE = /\{(\w+)\}/g;

function placeholders(s: string): Set<string> {
	return new Set([...s.matchAll(PLACEHOLDER_RE)].map((m) => m[1]));
}

describe("i18n catalogues", () => {
	it("es defines every en key and nothing extra", () => {
		expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
	});

	it("es placeholders match en placeholders for every key", () => {
		const mismatches: string[] = [];
		for (const key of Object.keys(en) as (keyof typeof en)[]) {
			const a = placeholders(en[key]);
			const b = placeholders(es[key]);
			if (a.size !== b.size || [...a].some((p) => !b.has(p))) {
				mismatches.push(`${key}: en{${[...a]}} vs es{${[...b]}}`);
			}
		}
		expect(mismatches).toEqual([]);
	});

	it("no es value is left blank", () => {
		const blank = Object.entries(es).filter(([, v]) => v.trim() === "");
		expect(blank.map(([k]) => k)).toEqual([]);
	});

	it("plural keys come in .one/.other pairs on both locales", () => {
		for (const key of Object.keys(en)) {
			if (key.endsWith(".one")) {
				const other = key.slice(0, -4) + ".other";
				expect(en).toHaveProperty([other]);
				expect(es).toHaveProperty([other]);
			}
		}
	});
});

describe("t / tPlural", () => {
	it("fills named placeholders and leaves unknown ones intact", () => {
		setActiveLanguage("en");
		expect(t("notice.exportedTo", { path: "Foo/Bar.md" })).toBe("Exported to Foo/Bar.md.");
		expect(t("notice.timerDone", {})).toBe("Timer done: {label}");
	});

	it("switches catalogue when the language changes", () => {
		setActiveLanguage("es");
		expect(t("common.cancel")).toBe("Cancelar");
		setActiveLanguage("en");
		expect(t("common.cancel")).toBe("Cancel");
	});

	it("tPlural picks .one for exactly 1 and .other otherwise", () => {
		setActiveLanguage("en");
		expect(tPlural("notice.itemsAdded.one", "notice.itemsAdded.other", 1)).toBe("1 item added");
		expect(tPlural("notice.itemsAdded.one", "notice.itemsAdded.other", 3)).toBe("3 items added");
	});

	it("resolveLocale honours an explicit preference and falls back to en", () => {
		expect(resolveLocale("es")).toBe("es");
		expect(resolveLocale("en")).toBe("en");
		expect(resolveLocale("auto")).toBe("en"); // mocked getLanguage() returns ""
	});
});

describe("dayLabel / canonicalDay", () => {
	it("dayLabel localises a canonical key, canonicalDay is its inverse", () => {
		setActiveLanguage("es");
		expect(dayLabel("Monday")).toBe("Lunes");
		expect(canonicalDay("Lunes")).toBe("Monday");
		expect(canonicalDay(dayLabel("Saturday"))).toBe("Saturday");
		setActiveLanguage("en");
	});

	it("canonicalDay accepts English names and any case, in any active language", () => {
		setActiveLanguage("es");
		expect(canonicalDay("monday")).toBe("Monday");
		expect(canonicalDay("MIÉRCOLES")).toBe("Wednesday");
		expect(canonicalDay("Domingo")).toBe("Sunday");
		setActiveLanguage("en");
	});

	it("canonicalDay returns non-weekday input unchanged", () => {
		expect(canonicalDay("Meal Plan Queue")).toBe("Meal Plan Queue");
		expect(canonicalDay("Taco Night")).toBe("Taco Night");
	});
});
