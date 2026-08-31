import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { suppressMealPlanSync, isMealPlanSyncSuppressed } from "../../src/lifecycle/meal-plan-sync-guard";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("meal-plan-sync-guard", () => {
	it("is not suppressed by default", () => {
		expect(isMealPlanSyncSuppressed()).toBe(false);
	});

	it("suppresses for the given window, then clears", () => {
		suppressMealPlanSync(1000);
		expect(isMealPlanSyncSuppressed()).toBe(true);
		vi.advanceTimersByTime(999);
		expect(isMealPlanSyncSuppressed()).toBe(true);
		vi.advanceTimersByTime(2);
		expect(isMealPlanSyncSuppressed()).toBe(false);
	});

	it("a second call extends the window but never shortens it", () => {
		suppressMealPlanSync(2000);
		vi.advanceTimersByTime(500);
		suppressMealPlanSync(200); // shorter -- must not pull the deadline in
		vi.advanceTimersByTime(700); // now at 1200ms total, original window was 2000ms
		expect(isMealPlanSyncSuppressed()).toBe(true);
		vi.advanceTimersByTime(900); // 2100ms total
		expect(isMealPlanSyncSuppressed()).toBe(false);
	});
});
