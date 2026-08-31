/**
 * Renders the dashboard's time-of-day greeting heading. Sits above the grid
 * with generous surrounding space so the view opens with some breathing room
 * instead of jumping straight into dense cards.
 */
import { t } from "../../i18n";

function timeOfDayGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 5) return t("dash.greeting.evening");
	if (hour < 12) return t("dash.greeting.morning");
	if (hour < 17) return t("dash.greeting.afternoon");
	return t("dash.greeting.evening");
}

export function renderGreeting(container: HTMLElement): void {
	const header = container.createDiv({ cls: "rb-dashboard-greeting" });
	header.createEl("h1", { cls: "rb-dashboard-greeting-text", text: timeOfDayGreeting() });
}
