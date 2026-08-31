/**
 * Hand-authored line icons for kitchen concepts Tabler has no icon for, drawn to
 * the exact Tabler spec (24x24 grid, fill:none, stroke:currentColor,
 * stroke-width:2, round caps/joins, ~2px padding) so they are indistinguishable
 * from the bundled Tabler set. Original work — no attribution required.
 *
 * RB_AUTHORED_ICON_NAMES is the id list (also used by tests / the icon map).
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

export const RB_AUTHORED_ICONS: Record<string, string> = {
	"rb-pan": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"10\" cy=\"13\" r=\"6\"/><path d=\"M16 13h5\"/></g></svg>",
	"rb-pot": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 8h14v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z\"/><path d=\"M3 9h2M19 9h2\"/><path d=\"M4 8h16\"/><path d=\"M10 5h4\"/></g></svg>",
	"rb-baking-dish": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 9h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z\"/><path d=\"M2 11h2M20 11h2\"/></g></svg>",
	"rb-colander": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 10h18a9 8 0 0 1-9 9a9 8 0 0 1-9-9z\"/><path d=\"M9 19v1M15 19v1\"/><path d=\"M8 13h.01M12 13h.01M16 13h.01M10 16h.01M14 16h.01\"/></g></svg>",
	"rb-grater": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 3h6l4 15H4z\"/><path d=\"M9 3a3 2 0 0 1 6 0\"/><path d=\"M9 8l1-1M12 8l1-1M9 12l1-1M13 12l1-1M11 16l1-1\"/></g></svg>",
	"rb-mortar": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 13h16a8 7 0 0 1-8 6a8 7 0 0 1-8-6z\"/><path d=\"M9 19h6\"/><path d=\"M14 4l-3.5 8\"/><circle cx=\"15\" cy=\"3.5\" r=\"1.5\"/></g></svg>",
	"rb-peeler": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 3l3 7l3-7\"/><path d=\"M6 13h12l-1.5 5a2 2 0 0 1-2 1.5h-5a2 2 0 0 1-2-1.5z\"/></g></svg>",
	"rb-fork": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 3v6M12 3v6\"/><path d=\"M6 9h8\"/><path d=\"M10 9v12\"/></g></svg>",
	"rb-plate": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/></g></svg>",
	"rb-platter": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"6\"/><ellipse cx=\"12\" cy=\"12\" rx=\"6\" ry=\"3\"/></g></svg>",
	"rb-jar": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9h12v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z\"/><path d=\"M7 9V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3\"/></g></svg>",
	"rb-cutting-board": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 7h13a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z\"/><path d=\"M19 10h2v4h-2\"/><path d=\"M8 10l5 5\"/></g></svg>",
	"rb-towel": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 6h18\"/><path d=\"M7 6v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V6\"/><path d=\"M13 6v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V6\"/></g></svg>",
	"rb-crumble": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 4c1 1 5 1 6 0\"/><path d=\"M12 8h.01M8 11h.01M16 11h.01M10 15h.01M14 15h.01M12 18h.01M7 18h.01M17 18h.01\"/></g></svg>",
};
