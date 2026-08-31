import { describe, it, expect, vi } from "vitest";

vi.mock("obsidian", () => ({
	Platform: { isMobile: false },
	Notice: class { constructor(_: string) { /* noop */ } },
	TFile: class {},
	getLanguage: () => "",
}));

import { resolveVaultPath } from "../../src/ui/meal-plan-view/drag-reschedule";

describe("resolveVaultPath", () => {
	it("passes through a vault-relative .md path", () => {
		expect(resolveVaultPath("Recetas/Albóndigas.md")).toBe("Recetas/Albóndigas.md");
	});

	it("decodes a full or partial Obsidian open URI, adding .md when missing", () => {
		expect(resolveVaultPath("obsidian://open?vault=samsy&file=Recetas%2FAlb%C3%B3ndigas"))
			.toBe("Recetas/Albóndigas.md");
		expect(resolveVaultPath("open?vault=samsy&file=Recetas%2FPasta%20al%20lim%C3%B3n"))
			.toBe("Recetas/Pasta al limón.md");
	});

	it("takes the first real URI from a multi-line text/uri-list payload", () => {
		expect(resolveVaultPath("# comment\r\nobsidian://open?vault=v&file=Recetas%2FA\r\n"))
			.toBe("Recetas/A.md");
	});

	it("returns null for an entry id, a bare wikilink, or empty input", () => {
		expect(resolveVaultPath("mtgf3imj-s9xi")).toBeNull();
		expect(resolveVaultPath("[[Albóndigas]]")).toBeNull();
		expect(resolveVaultPath("   ")).toBeNull();
	});
});
