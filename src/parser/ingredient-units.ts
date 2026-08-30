/**
 * Exhaustive synonym map from every known unit spelling and pluralisation to its
 * canonical abbreviated form, used during ingredient parsing to normalise units.
 */
// Maps every known spelling/pluralization to its canonical singular form.
// Filler words ("unit", "whole", "each") map to "" — consumed, contribute no unit.
export const UNIT_SYNONYMS: Record<string, string> = {
	// teaspoon
	tsp: "tsp", tsps: "tsp", teaspoon: "tsp", teaspoons: "tsp",
	// tablespoon
	tbsp: "tbsp", tbsps: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp", tbs: "tbsp",
	// cup
	cup: "cup", cups: "cup", c: "cup",
	// pint
	pt: "pt", pts: "pt", pint: "pt", pints: "pt",
	// quart
	qt: "qt", qts: "qt", quart: "qt", quarts: "qt",
	// gallon
	gal: "gal", gals: "gal", gallon: "gal", gallons: "gal",
	// milliliter
	ml: "ml", mls: "ml", milliliter: "ml", milliliters: "ml",
	millilitre: "ml", millilitres: "ml",
	// liter
	l: "l", liter: "l", liters: "l", litre: "l", litres: "l",
	// fluid ounce (handled separately in consumeUnit as two-word)
	"fl oz": "fl oz", "fluid ounce": "fl oz", "fluid ounces": "fl oz",
	// ounce
	oz: "oz", ozs: "oz", ounce: "oz", ounces: "oz",
	// pound
	lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
	// gram
	g: "g", gram: "g", grams: "g",
	// kilogram
	kg: "kg", kilogram: "kg", kilograms: "kg",
	// milligram
	mg: "mg", milligram: "mg", milligrams: "mg",
	// piece
	piece: "piece", pieces: "piece",
	// can
	can: "can", cans: "can",
	// jar
	jar: "jar", jars: "jar",
	// bag
	bag: "bag", bags: "bag",
	// box
	box: "box", boxes: "box",
	// bottle
	bottle: "bottle", bottles: "bottle",
	// pack
	pack: "pack", packs: "pack", packet: "pack", packets: "pack",
	// bunch
	bunch: "bunch", bunches: "bunch",
	// head
	head: "head", heads: "head",
	// clove
	clove: "clove", cloves: "clove",
	// slice
	slice: "slice", slices: "slice",
	// stick
	stick: "stick", sticks: "stick",
	// pinch
	pinch: "pinch", pinches: "pinch",
	// dash
	dash: "dash", dashes: "dash",
	// sprig
	sprig: "sprig", sprigs: "sprig",
	// stalk
	stalk: "stalk", stalks: "stalk",
	// loaf
	loaf: "loaf", loaves: "loaf",
	// dozen
	dozen: "dozen", dozens: "dozen",
	// filler words
	unit: "", units: "", whole: "", each: "",

	// ── Spanish spellings ─────────────────────────────────────────────────
	// Kept alongside the English keys (not locale-switched) so a vault mixing
	// English and Spanish recipes parses either. Crucially, Spanish units
	// canonicalise to a Spanish singular form, NOT the English abbreviation:
	// the parsed unit is shown verbatim in the recipe view, so mapping
	// "cucharadas" to "tbsp" would silently switch the displayed word to
	// English. Plurals still collapse (so grocery-list dedup works), just
	// within Spanish. Metric units (g/kg/ml/l) stay as their language-neutral
	// abbreviations because those are identical in Spanish.
	// teaspoon
	cucharadita: "cucharadita", cucharaditas: "cucharadita",
	cdta: "cucharadita", cdtas: "cucharadita", cdita: "cucharadita", cta: "cucharadita",
	// tablespoon
	cucharada: "cucharada", cucharadas: "cucharada", cda: "cucharada", cdas: "cucharada",
	// cup
	taza: "taza", tazas: "taza",
	// milliliter / liter
	mililitro: "ml", mililitros: "ml", litro: "l", litros: "l",
	// gram / kilogram
	gramo: "g", gramos: "g", kilo: "kg", kilos: "kg", kilogramo: "kg", kilogramos: "kg",
	// ounce / pound
	onza: "onza", onzas: "onza", libra: "libra", libras: "libra",
	// piece / unit  ("unidad" is a filler like English "unit"; "pieza" is kept)
	pieza: "pieza", piezas: "pieza", unidad: "", unidades: "",
	// can / jar / bag / box / bottle / pack
	lata: "lata", latas: "lata",
	bote: "bote", botes: "bote", tarro: "bote", tarros: "bote", frasco: "bote", frascos: "bote",
	bolsa: "bolsa", bolsas: "bolsa",
	caja: "caja", cajas: "caja",
	botella: "botella", botellas: "botella",
	paquete: "paquete", paquetes: "paquete", sobre: "paquete", sobres: "paquete",
	// bunch / head / clove / slice / sprig / stalk / loaf
	manojo: "manojo", manojos: "manojo",
	cabeza: "cabeza", cabezas: "cabeza",
	diente: "diente", dientes: "diente",
	rodaja: "rodaja", rodajas: "rodaja", rebanada: "rebanada", rebanadas: "rebanada",
	loncha: "loncha", lonchas: "loncha",
	ramita: "ramita", ramitas: "ramita", rama: "ramita", ramas: "ramita",
	tallo: "tallo", tallos: "tallo",
	barra: "barra", barras: "barra",
	// pinch
	pizca: "pizca", pizcas: "pizca",
};
