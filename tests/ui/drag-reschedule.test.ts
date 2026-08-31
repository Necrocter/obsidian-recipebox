import { describe, it, expect, vi } from "vitest";

const { MockTFile } = vi.hoisted(() => ({
	MockTFile: class {
		path: string;
		extension: string;
		constructor(path = "", extension = "md") { this.path = path; this.extension = extension; }
	},
}));

vi.mock("obsidian", () => ({
	Platform: { isMobile: false },
	Notice: class { constructor(_: string) { /* noop */ } },
	TFile: MockTFile,
	getLanguage: () => "",
}));

import { resolveVaultPath, explorerFilePath } from "../../src/ui/meal-plan-view/drag-reschedule";

function fakeApp(byLinktext: Record<string, MockTFile>, dragManager?: unknown) {
	return {
		metadataCache: { getFirstLinkpathDest: (lt: string) => byLinktext[lt] ?? null },
		dragManager,
	} as unknown as Parameters<typeof explorerFilePath>[0];
}
function dragEvent(data: Record<string, string>): DragEvent {
	return { dataTransfer: { types: Object.keys(data), getData: (t: string) => data[t] ?? "" } } as unknown as DragEvent;
}

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

describe("explorerFilePath — Obsidian file-explorer drag", () => {
	const app = fakeApp({ "Albóndigas": new MockTFile("Recetas/Albóndigas.md") });

	it("resolves a text/plain wikilink via metadataCache (the file-explorer drop payload)", () => {
		expect(explorerFilePath(app, dragEvent({ "text/plain": "[[Albóndigas]]" }))).toBe("Recetas/Albóndigas.md");
	});

	it("resolves a wikilink with a subpath/alias, and a bare name", () => {
		const a2 = fakeApp({ "Recetas/Albóndigas": new MockTFile("Recetas/Albóndigas.md") });
		expect(explorerFilePath(a2, dragEvent({ "text/plain": "[[Recetas/Albóndigas|Alias]]" }))).toBe("Recetas/Albóndigas.md");
		expect(explorerFilePath(app, dragEvent({ "text/plain": "Albóndigas" }))).toBe("Recetas/Albóndigas.md");
	});

	it("finds the file deep in a dragManager payload of any shape", () => {
		const f = new MockTFile("Recetas/Pasta.md");
		expect(explorerFilePath(fakeApp({}, { draggable: { type: "file", file: f } }))).toBe("Recetas/Pasta.md");
		expect(explorerFilePath(fakeApp({}, { draggables: [{ files: [f] }] }))).toBe("Recetas/Pasta.md");
	});

	it("returns null when nothing in the drag names a markdown file", () => {
		expect(explorerFilePath(fakeApp({}), dragEvent({ "text/plain": "just some words" }))).toBeNull();
		expect(explorerFilePath(fakeApp({}, { draggable: { file: new MockTFile("img.png", "png") } }))).toBeNull();
	});
});
