/**
 * Maps a recipe "method" (cooking verb) or "equipment" (utensil / appliance)
 * term to an icon id registered by src/ui/icons/register-rb-icons.ts. Keys are
 * lowercased and accent-preserving, matching how toTagArray() emits them, and
 * cover both Spanish and English spellings (like ingredient-units' UNIT_SYNONYMS).
 *
 * Every term currently used in the vault resolves to a specific icon. The
 * category fallback only catches a brand-new unknown term.
 */

export const METHOD_FALLBACK = "rb-chef-hat";
export const EQUIPMENT_FALLBACK = "rb-tools-kitchen";

const METHOD_ICONS: Record<string, string> = {
	// blend
	"licuar": "rb-blender", "blend": "rb-blender",
	// whisk / mix
	"batir": "rb-whisk", "beat": "rb-whisk", "whip": "rb-whisk", "whisk": "rb-whisk",
	"montar": "rb-whisk", "mezclar": "rb-whisk", "mix": "rb-whisk", "stir": "rb-whisk",
	"incorporar": "rb-whisk", "fold": "rb-whisk", "emulsionar": "rb-whisk", "emulsify": "rb-whisk",
	// mortar & pestle
	"machacar": "rb-mortar", "mash": "rb-mortar", "crush": "rb-mortar", "pound": "rb-mortar", "moler": "rb-mortar", "grind": "rb-mortar",
	// oven / bake
	"hornear": "rb-cooker", "bake": "rb-cooker", "precalentar": "rb-cooker", "preheat": "rb-cooker", "roast": "rb-cooker", "gratinar": "rb-cooker",
	"coccion a presion": "rb-cooker", "cocción a presión": "rb-cooker", "pressure cook": "rb-cooker",
	// pan / fry / sear
	"freir": "rb-pan", "freír": "rb-pan", "fry": "rb-pan", "sofreir": "rb-pan", "sofreír": "rb-pan",
	"saltear": "rb-pan", "saute": "rb-pan", "sauté": "rb-pan", "sellar": "rb-pan", "sear": "rb-pan", "dorar": "rb-pan",
	// heat
	"calentar": "rb-flame", "heat": "rb-flame", "warm": "rb-flame", "derretir": "rb-flame", "melt": "rb-flame",
	"tostar": "rb-flame", "toast": "rb-flame", "flambear": "rb-flame",
	// boil / simmer / stew
	"cocer": "rb-soup", "cook": "rb-soup", "boil": "rb-soup", "hervir": "rb-soup", "simmer": "rb-soup",
	"guisar": "rb-soup", "stew": "rb-soup", "escalfar": "rb-soup", "poach": "rb-soup",
	"cocer huevo": "rb-egg", "boil egg": "rb-egg",
	// chill
	"refrigerar": "rb-snowflake", "chill": "rb-snowflake", "refrigerate": "rb-snowflake",
	"enfriar": "rb-snowflake", "cool": "rb-snowflake", "congelar": "rb-snowflake", "freeze": "rb-snowflake",
	// serve
	"servir": "rb-ladle", "serve": "rb-ladle", "plate": "rb-ladle", "emplatar": "rb-ladle",
	// strain / sift
	"colar": "rb-filter", "strain": "rb-filter", "escurrir": "rb-filter", "drain": "rb-filter",
	"cernir": "rb-filter", "sift": "rb-filter", "tamizar": "rb-filter",
	// marinate / soak
	"marinar": "rb-droplet", "marinate": "rb-droplet", "remojar": "rb-droplet", "soak": "rb-droplet",
	// grease / brush / glaze
	"engrasar": "rb-brush", "grease": "rb-brush", "barnizar": "rb-brush", "glasear": "rb-brush", "glaze": "rb-brush",
	// dress / drizzle
	"aderezar": "rb-bottle", "dress": "rb-bottle", "drizzle": "rb-bottle",
	// squeeze / juice
	"exprimir": "rb-lemon", "squeeze": "rb-lemon", "juice": "rb-lemon",
	// dry
	"secar": "rb-wind", "dry": "rb-wind",
	// rest / proof
	"reposar": "rb-hourglass", "rest": "rb-hourglass", "leudar": "rb-hourglass", "proof": "rb-hourglass",
	// decorate / garnish
	"decorar": "rb-sparkles", "decorate": "rb-sparkles", "garnish": "rb-sparkles", "adornar": "rb-sparkles",
	// sprinkle / dust
	"espolvorear": "rb-pepper", "sprinkle": "rb-pepper", "dust": "rb-pepper", "rociar": "rb-pepper",
	// season
	"sazonar": "rb-salt", "season": "rb-salt", "salpimentar": "rb-salt", "salar": "rb-salt", "salt": "rb-salt",
	// cut / chop / slice
	"picar": "rb-slice", "chop": "rb-slice", "mince": "rb-slice", "rebanar": "rb-slice", "slice": "rb-slice",
	"cortar": "rb-slice", "cut": "rb-slice", "trocear": "rb-slice", "dice": "rb-slice",
	"cortar en supremas": "rb-slice", "desvenar": "rb-slice", "devein": "rb-slice", "filetear": "rb-slice",
	// peel
	"pelar": "rb-peeler", "peel": "rb-peeler",
	// grate / shred
	"rallar": "rb-grater", "grate": "rb-grater", "shred": "rb-grater",
	// compact / press
	"compactar": "rb-stack", "compact": "rb-stack", "press": "rb-stack", "prensar": "rb-stack",
	// crumble
	"desmoronar": "rb-crumble", "crumble": "rb-crumble", "desmenuzar": "rb-crumble",
};

const EQUIPMENT_ICONS: Record<string, string> = {
	"licuadora": "rb-blender", "blender": "rb-blender",
	"horno": "rb-cooker", "oven": "rb-cooker",
	"molde para horno": "rb-baking-dish", "molde": "rb-baking-dish", "baking dish": "rb-baking-dish",
	"refractario para horno": "rb-baking-dish", "refractario": "rb-baking-dish", "molde para panque": "rb-baking-dish",
	"molde para panqué": "rb-baking-dish", "loaf pan": "rb-baking-dish", "baking pan": "rb-baking-dish",
	"olla": "rb-pot", "pot": "rb-pot", "stockpot": "rb-pot", "cacerola": "rb-pot", "cazuela": "rb-pot",
	"instant pot": "rb-pot", "olla expres": "rb-pot", "olla exprés": "rb-pot", "olla a presion": "rb-pot", "olla a presión": "rb-pot",
	"pressure cooker": "rb-pot", "cooker": "rb-pot",
	"sarten": "rb-pan", "sartén": "rb-pan", "pan": "rb-pan", "skillet": "rb-pan", "frying pan": "rb-pan",
	"sarten de hierro fundido": "rb-pan", "sartén de hierro fundido": "rb-pan", "cast iron": "rb-pan", "wok": "rb-pan",
	"grill": "rb-grill", "parrilla": "rb-grill", "grill pan": "rb-grill",
	"refrigerador": "rb-fridge", "fridge": "rb-fridge", "refrigerator": "rb-fridge", "nevera": "rb-fridge", "heladera": "rb-fridge",
	"colador": "rb-colander", "colander": "rb-colander", "strainer": "rb-colander", "sieve": "rb-colander",
	"cedazo": "rb-colander", "chino": "rb-colander", "tamiz": "rb-colander",
	"batidor": "rb-whisk", "batidor de globo": "rb-whisk", "whisk": "rb-whisk", "balloon whisk": "rb-whisk", "batidor de mano": "rb-whisk",
	"tazon": "rb-bowl", "tazón": "rb-bowl", "bowl": "rb-bowl", "cuenco": "rb-bowl", "bol": "rb-bowl",
	"ensaladera": "rb-bowl", "salad bowl": "rb-bowl", "recipiente": "rb-bowl",
	"tenedor": "rb-fork", "fork": "rb-fork",
	"cuchillo": "rb-slice", "knife": "rb-slice", "mandolina": "rb-slice", "mandoline": "rb-slice", "mandolina de cocina": "rb-slice",
	"tabla de cortar": "rb-cutting-board", "cutting board": "rb-cutting-board", "chopping board": "rb-cutting-board", "tabla": "rb-cutting-board",
	"frasco": "rb-jar", "jar": "rb-jar", "tarro": "rb-jar", "bote": "rb-jar",
	"platon": "rb-platter", "platón": "rb-platter", "platon plano": "rb-platter", "platón plano": "rb-platter",
	"platter": "rb-platter", "fuente": "rb-platter",
	"plato": "rb-plate", "plato extendido": "rb-plate", "plate": "rb-plate", "plato hondo": "rb-plate",
	"toalla de papel": "rb-towel", "paper towel": "rb-towel", "toalla de cocina": "rb-towel", "kitchen towel": "rb-towel",
	"pano": "rb-towel", "paño": "rb-towel", "trapo": "rb-towel", "servilleta": "rb-towel", "toalla": "rb-towel",
};

function resolve(term: string, table: Record<string, string>, fallback: string): string {
	const key = term.trim().toLowerCase();
	if (!key) return fallback;
	if (table[key]) return table[key];
	// leading-word / whole-word contains pass, longest key first so
	// "sartén de hierro fundido" prefers a "sartén ..." entry over "hierro".
	const words = key.split(/\s+/);
	for (let n = words.length; n >= 1; n--) {
		const head = words.slice(0, n).join(" ");
		if (table[head]) return table[head];
	}
	for (const entry of Object.keys(table).sort((a, b) => b.length - a.length)) {
		if (entry.includes(" ") && key.includes(entry)) return table[entry];
	}
	return fallback;
}

export function methodIcon(term: string): string {
	return resolve(term, METHOD_ICONS, METHOD_FALLBACK);
}

export function equipmentIcon(term: string): string {
	return resolve(term, EQUIPMENT_ICONS, EQUIPMENT_FALLBACK);
}

/** Every icon id these maps can produce — for tests / tooling. */
export function referencedIconIds(): string[] {
	return [...new Set([...Object.values(METHOD_ICONS), ...Object.values(EQUIPMENT_ICONS), METHOD_FALLBACK, EQUIPMENT_FALLBACK])];
}
