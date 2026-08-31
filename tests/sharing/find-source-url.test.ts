import { describe, it, expect } from "vitest";
import { findSourceUrl } from "../../src/sharing/find-source-url";

describe("findSourceUrl", () => {
	it("finds a URL under any recognized candidate key", () => {
		expect(findSourceUrl({ source: "https://example.com" })).toBe("https://example.com");
		expect(findSourceUrl({ url: "https://example.com" })).toBe("https://example.com");
		expect(findSourceUrl({ sourceUrl: "https://example.com" })).toBe("https://example.com");
		expect(findSourceUrl({ source_url: "https://example.com" })).toBe("https://example.com");
	});

	it("checks a configured property name first, then the defaults", () => {
		expect(findSourceUrl({ fuente: "https://a.com" }, "fuente")).toBe("https://a.com");
		expect(findSourceUrl({ fuente: "https://a.com", source: "https://b.com" }, "fuente")).toBe("https://a.com");
		expect(findSourceUrl({ source: "https://b.com" }, "fuente")).toBe("https://b.com");
		expect(findSourceUrl({ enlace: "https://a.com" }, "  ")).toBeNull();
	});

	it("trims whitespace", () => {
		expect(findSourceUrl({ source: "  https://example.com  " })).toBe("https://example.com");
	});

	it("returns null when no candidate key has a usable string value", () => {
		expect(findSourceUrl({})).toBeNull();
		expect(findSourceUrl({ source: "   " })).toBeNull();
		expect(findSourceUrl({ source: 123 })).toBeNull();
	});
});
