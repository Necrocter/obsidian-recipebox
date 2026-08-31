import { describe, it, expect, vi, afterEach } from "vitest";

// render.ts now pulls in the i18n module (dayLabel / canonicalDay), which
// imports getLanguage() from obsidian; Node can't resolve the real package.
vi.mock("obsidian", () => ({ getLanguage: () => "en" }));

import { dayRank, renderMealPlanLine, insertMealPlanEntryIntoText, writeMealPlanNote, joinNoteLines } from "../../src/meal-plan/meal-plan-note/render";
import { DEFAULT_SETTINGS } from "../../src/settings/settings-defaults";
import { setActiveLanguage } from "../../src/i18n";
import type { MealPlanEntry } from "../../src/types";
import type { MealPlanSection } from "../../src/meal-plan/meal-plan-note/parse";

function entry(overrides: Partial<MealPlanEntry> = {}): MealPlanEntry {
	return { id: "1", recipePath: "Pasta.md", addedDate: "2024-01-01", contributions: {}, ...overrides };
}

describe("dayRank", () => {
	it("ranks weekdays in Monday-Sunday order", () => {
		expect(dayRank("Monday")).toBeLessThan(dayRank("Tuesday"));
		expect(dayRank("Saturday")).toBeLessThan(dayRank("Sunday"));
	});

	it("ranks queue/unscheduled labels first (rank 0)", () => {
		expect(dayRank(undefined)).toBe(0);
		expect(dayRank("Queue")).toBe(0);
		expect(dayRank("Meal Plan Queue")).toBe(0);
		expect(dayRank("Unscheduled")).toBe(0);
	});

	it("ranks an unrecognized day label after all weekdays", () => {
		expect(dayRank("Someday")).toBeGreaterThan(dayRank("Sunday"));
	});
});

describe("renderMealPlanLine", () => {
	it("renders a recipe entry as a wikilink checkbox line", () => {
		expect(renderMealPlanLine(entry(), "Pasta", DEFAULT_SETTINGS)).toBe("- [ ] [[Pasta]]");
	});

	it("renders a custom (no recipePath) entry using its label", () => {
		const e = entry({ recipePath: "", label: "Leftover Pizza" });
		expect(renderMealPlanLine(e, "Pasta", DEFAULT_SETTINGS)).toBe("- [ ] Leftover Pizza");
	});

	it("appends the #leftovers tag when isLeftovers is set", () => {
		const e = entry({ isLeftovers: true });
		expect(renderMealPlanLine(e, "Pasta", DEFAULT_SETTINGS)).toBe("- [ ] [[Pasta]] #leftovers");
	});

	it("formats the meal type suffix per the configured notation", () => {
		const e = entry({ meal: "Dinner" });
		const tag = { ...DEFAULT_SETTINGS, mealTypeNotation: "tag" as const, mealTypeFieldName: "meal" };
		expect(renderMealPlanLine(e, "Pasta", tag)).toBe("- [ ] [[Pasta]] #meal/dinner");

		const dataview = { ...DEFAULT_SETTINGS, mealTypeNotation: "dataview" as const, mealTypeFieldName: "meal" };
		expect(renderMealPlanLine(e, "Pasta", dataview)).toBe("- [ ] [[Pasta]] [meal:: Dinner]");

		const text = { ...DEFAULT_SETTINGS, mealTypeNotation: "text" as const };
		expect(renderMealPlanLine(e, "Pasta", text)).toBe("- [ ] [[Pasta]] (Dinner)");
	});
});

describe("joinNoteLines", () => {
	it("drops leading blanks, collapses runs of blank lines, and ends with one newline", () => {
		expect(joinNoteLines(["", "", "# Plan", "", "", "", "## Lunes", "- [ ] [[X]]", "", ""]))
			.toBe("# Plan\n\n## Lunes\n- [ ] [[X]]\n");
	});
});

describe("insertMealPlanEntryIntoText", () => {
	it("does not accrete blank lines after the H1 across repeated inserts", () => {
		let note = "# Plan de comida\n\n\n\n\n\n## Lunes\n";
		for (let i = 0; i < 4; i++) {
			note = insertMealPlanEntryIntoText(note, entry({ recipePath: `R${i}.md`, day: "Monday" }), `R${i}`, DEFAULT_SETTINGS);
		}
		expect(note).not.toMatch(/\n\n\n/);
		expect(note.indexOf("## Monday")).toBe("# Plan de comida\n\n".length);
	});

	it("inserts a new line into an existing day section", () => {
		const noteText = "# Meal Plan\n\n## Monday\n- [ ] [[Pasta]]\n";
		const e = entry({ recipePath: "Salad.md", day: "Monday" });
		const result = insertMealPlanEntryIntoText(noteText, e, "Salad", DEFAULT_SETTINGS);
		expect(result).toContain("- [ ] [[Salad]]");
		expect(result.indexOf("## Monday")).toBeLessThan(result.indexOf("[[Salad]]"));
	});

	it("creates a new day section in day-rank order when the day doesn't exist yet", () => {
		const noteText = "# Meal Plan\n\n## Monday\n- [ ] [[Pasta]]\n\n## Wednesday\n- [ ] [[Soup]]\n";
		const e = entry({ recipePath: "Salad.md", day: "Tuesday" });
		const result = insertMealPlanEntryIntoText(noteText, e, "Salad", DEFAULT_SETTINGS);
		const mondayIdx = result.indexOf("## Monday");
		const tuesdayIdx = result.indexOf("## Tuesday");
		const wednesdayIdx = result.indexOf("## Wednesday");
		expect(mondayIdx).toBeLessThan(tuesdayIdx);
		expect(tuesdayIdx).toBeLessThan(wednesdayIdx);
	});

	it("inserts a queue entry without creating a '## Meal Plan Queue' heading", () => {
		const noteText = "# Meal Plan\n";
		const e = entry({ recipePath: "Salad.md", day: undefined });
		const result = insertMealPlanEntryIntoText(noteText, e, "Salad", DEFAULT_SETTINGS);
		expect(result).not.toContain("## Meal Plan Queue");
		expect(result).toContain("- [ ] [[Salad]]");
	});
});

describe("writeMealPlanNote", () => {
	function section(header: string | undefined, raws: string[]): MealPlanSection {
		return { header, lines: raws.map((raw) => ({ kind: "raw" as const, wikilink: "", day: undefined, mealType: undefined, checked: false, raw })) };
	}

	it("writes new entries grouped and ordered by day", () => {
		const entries = [entry({ recipePath: "Soup.md", day: "Wednesday" }), entry({ recipePath: "Pasta.md", day: "Monday" })];
		const result = writeMealPlanNote([], entries, (p) => p.replace(".md", ""), DEFAULT_SETTINGS);
		const mondayIdx = result.indexOf("## Monday");
		const wednesdayIdx = result.indexOf("## Wednesday");
		expect(mondayIdx).toBeGreaterThan(-1);
		expect(mondayIdx).toBeLessThan(wednesdayIdx);
	});

	it("excludes leftovers-only entries (empty recipePath) from the rendered note", () => {
		const entries = [entry({ recipePath: "", label: "Leftovers", day: "Monday" })];
		const result = writeMealPlanNote([], entries, (p) => p, DEFAULT_SETTINGS);
		expect(result).not.toContain("Leftovers");
	});

	it("preserves raw non-entry lines from the existing section", () => {
		const sections = [section("Monday", ["Some note to keep."])];
		const result = writeMealPlanNote(sections, [], (p) => p, DEFAULT_SETTINGS);
		expect(result).toContain("Some note to keep.");
	});

	it("omits a day section entirely when it has no new entries and no preserved content", () => {
		const sections = [section("Monday", [""])];
		const result = writeMealPlanNote(sections, [], (p) => p, DEFAULT_SETTINGS);
		expect(result).not.toContain("## Monday");
	});

	it("starts with an H1 taken from the configured meal plan filename", () => {
		expect(writeMealPlanNote([], [], (p) => p, DEFAULT_SETTINGS).startsWith("# Meal Plan")).toBe(true);

		const es = { ...DEFAULT_SETTINGS, mealPlanPath: "Cocina/Plan de comida.md" };
		const entries = [entry({ recipePath: "Pasta.md", day: "Monday" })];
		const result = writeMealPlanNote([], entries, (p) => p.replace(".md", ""), es);
		expect(result.startsWith("# Plan de comida")).toBe(true);
		expect(result).not.toContain("# Meal Plan");
	});

	it("does not keep a stale '# Meal Plan' line when the filename title differs", () => {
		const es = { ...DEFAULT_SETTINGS, mealPlanPath: "Plan de comida.md" };
		const sections: MealPlanSection[] = [
			{ header: undefined, lines: [{ kind: "raw", wikilink: "", day: undefined, mealType: undefined, checked: false, raw: "# Meal Plan" }] },
		];
		const result = writeMealPlanNote(sections, [entry({ recipePath: "Pasta.md", day: "Monday" })], (p) => p.replace(".md", ""), es);
		expect(result.match(/^# /gm)?.length).toBe(1);
		expect(result.startsWith("# Plan de comida")).toBe(true);
	});
});

describe("localised day headings", () => {
	afterEach(() => setActiveLanguage("en"));

	it("writeMealPlanNote emits the heading in the active language", () => {
		setActiveLanguage("es");
		const entries = [entry({ recipePath: "Pasta.md", day: "Monday" })];
		const result = writeMealPlanNote([], entries, (p) => p.replace(".md", ""), DEFAULT_SETTINGS);
		expect(result).toContain("## Lunes");
		expect(result).not.toContain("## Monday");
	});

	it("insertMealPlanEntryIntoText writes a new localised section", () => {
		setActiveLanguage("es");
		const e = entry({ recipePath: "Salad.md", day: "Tuesday" });
		const result = insertMealPlanEntryIntoText("# Meal Plan\n", e, "Salad", DEFAULT_SETTINGS);
		expect(result).toContain("## Martes");
	});

	it("insertMealPlanEntryIntoText appends into an existing localised section", () => {
		setActiveLanguage("es");
		const noteText = "# Meal Plan\n\n## Lunes\n- [ ] [[Pasta]]\n";
		const e = entry({ recipePath: "Salad.md", day: "Monday" });
		const result = insertMealPlanEntryIntoText(noteText, e, "Salad", DEFAULT_SETTINGS);
		// no duplicate "## Monday" / second "## Lunes" section
		expect(result.match(/^## /gm)?.length).toBe(1);
		expect(result).toContain("- [ ] [[Salad]]");
	});

	it("dayRank accepts a localised heading", () => {
		setActiveLanguage("es");
		expect(dayRank("Lunes")).toBe(dayRank("Monday"));
		expect(dayRank("Lunes")).toBeLessThan(dayRank("Martes"));
	});

	it("insertMealPlanEntryIntoText relabels a stale '## Monday' section to the active language", () => {
		setActiveLanguage("es");
		const noteText = "# Plan de comida\n\n## Monday\n- [ ] [[Pasta]]\n";
		const e = entry({ recipePath: "Salad.md", day: "Monday" });
		const result = insertMealPlanEntryIntoText(noteText, e, "Salad", DEFAULT_SETTINGS);
		expect(result).toContain("## Lunes");
		expect(result).not.toContain("## Monday");
		expect(result.match(/^## /gm)?.length).toBe(1);
	});
});
