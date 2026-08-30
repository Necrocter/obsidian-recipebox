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

	// ── Spanish spellings, mapped onto the same canonical forms ─────────────
	// Kept alongside the English keys rather than locale-switched so a vault
	// mixing English and Spanish recipes parses either.
	// teaspoon
	cucharadita: "tsp", cucharaditas: "tsp", cdta: "tsp", cdtas: "tsp", cdita: "tsp",
	// tablespoon
	cucharada: "tbsp", cucharadas: "tbsp", cda: "tbsp", cdas: "tbsp",
	// cup
	taza: "cup", tazas: "cup",
	// milliliter / liter
	mililitro: "ml", mililitros: "ml", litro: "l", litros: "l",
	// gram / kilogram
	gramo: "g", gramos: "g", kilo: "kg", kilos: "kg", kilogramo: "kg", kilogramos: "kg",
	// ounce / pound
	onza: "oz", onzas: "oz", libra: "lb", libras: "lb",
	// piece / unit
	pieza: "piece", piezas: "piece", unidad: "piece", unidades: "piece",
	// can / jar / bag / box / bottle / pack
	lata: "can", latas: "can",
	bote: "jar", botes: "jar", tarro: "jar", tarros: "jar", frasco: "jar", frascos: "jar",
	bolsa: "bag", bolsas: "bag",
	caja: "box", cajas: "box",
	botella: "bottle", botellas: "bottle",
	paquete: "pack", paquetes: "pack", sobre: "pack", sobres: "pack",
	// bunch / head / clove / slice / sprig / stalk / loaf
	manojo: "bunch", manojos: "bunch",
	cabeza: "head", cabezas: "head",
	diente: "clove", dientes: "clove",
	rodaja: "slice", rodajas: "slice", rebanada: "slice", rebanadas: "slice",
	loncha: "slice", lonchas: "slice",
	ramita: "sprig", ramitas: "sprig", rama: "sprig", ramas: "sprig",
	tallo: "stalk", tallos: "stalk",
	barra: "loaf", barras: "loaf",
	// pinch / dash
	pizca: "pinch", pizcas: "pinch",
};
