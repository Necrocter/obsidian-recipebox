import { describe, it, expect } from "vitest";
import {
	methodIcon,
	equipmentIcon,
	referencedIconIds,
	METHOD_FALLBACK,
	EQUIPMENT_FALLBACK,
} from "../../src/parser/method-equipment-icons";
import { RB_TABLER_ICONS } from "../../src/ui/icons/rb-icons";
import { RB_AUTHORED_ICON_NAMES } from "../../src/ui/icons/rb-icons.authored";

// Every method / equipment term the sample vault currently uses (lowercased,
// as toTagArray emits).
const VAULT_METHODS = [
	"picar", "mezclar", "servir", "espolvorear", "rallar", "machacar", "licuar", "hornear",
	"rebanar", "decorar", "marinar", "engrasar", "refrigerar", "calentar", "montar", "aderezar",
	"colar", "exprimir", "batir", "precalentar", "cocer", "freír", "escurrir", "sellar", "reposar",
	"cocer huevo", "cortar en supremas", "desmoronar", "compactar", "pelar", "derretir",
	"incorporar", "secar", "sazonar", "desvenar", "cocción a presión", "emulsionar", "tostar",
];
const VAULT_EQUIPMENT = [
	"tazón", "licuadora", "horno", "tenedor", "toalla de papel", "sartén", "cuchillo",
	"platón plano", "colador", "olla", "plato extendido", "grill", "tabla de cortar",
	"batidor de globo", "mandolina", "frasco", "ensaladera", "sartén de hierro fundido",
	"molde para panqué", "toalla de cocina", "refrigerador", "molde para horno",
	"refractario para horno", "instant pot",
];

describe("method-equipment-icons", () => {
	it("every current vault method resolves to a specific (non-fallback) icon", () => {
		const unmapped = VAULT_METHODS.filter((t) => methodIcon(t) === METHOD_FALLBACK);
		expect(unmapped).toEqual([]);
	});

	it("every current vault equipment resolves to a specific (non-fallback) icon", () => {
		const unmapped = VAULT_EQUIPMENT.filter((t) => equipmentIcon(t) === EQUIPMENT_FALLBACK);
		expect(unmapped).toEqual([]);
	});

	it("an unknown term falls back to the category icon", () => {
		expect(methodIcon("teletransportar")).toBe(METHOD_FALLBACK);
		expect(equipmentIcon("reactor nuclear")).toBe(EQUIPMENT_FALLBACK);
		expect(methodIcon("")).toBe(METHOD_FALLBACK);
	});

	it("Spanish and English spellings map to the same icon", () => {
		expect(methodIcon("licuar")).toBe(methodIcon("blend"));
		expect(methodIcon("batir")).toBe(methodIcon("whisk"));
		expect(methodIcon("picar")).toBe(methodIcon("chop"));
		expect(equipmentIcon("sartén")).toBe(equipmentIcon("skillet"));
		expect(equipmentIcon("refrigerador")).toBe(equipmentIcon("fridge"));
		expect(equipmentIcon("colador")).toBe(equipmentIcon("strainer"));
	});

	it("multi-word terms match on the leading concept", () => {
		expect(equipmentIcon("sartén de hierro fundido")).toBe(equipmentIcon("sartén"));
		expect(equipmentIcon("molde para horno")).toBe("rb-baking-dish");
		expect(equipmentIcon("olla a presión")).toBe(equipmentIcon("olla"));
		expect(methodIcon("cortar en supremas")).toBe(methodIcon("cortar"));
	});

	it("case and surrounding whitespace do not matter", () => {
		expect(methodIcon("  Licuar ")).toBe(methodIcon("licuar"));
	});

	it("every icon the maps can return is a real registered id", () => {
		const known = new Set([...Object.keys(RB_TABLER_ICONS), ...RB_AUTHORED_ICON_NAMES]);
		const missing = referencedIconIds().filter((id) => !known.has(id));
		expect(missing).toEqual([]);
	});
});
