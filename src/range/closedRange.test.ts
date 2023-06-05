import { describe, expect, test } from "vitest";
import { from } from "./openRange";

describe("Range Tests", () => {
  test("containsで範囲内を判定できる", () => {
    const range = from<number>(4).to(6);

    expect(range.contains(3)).toBeFalsy();
    expect(range.contains(4)).toBeTruthy();
    expect(range.contains(5)).toBeTruthy();
    expect(range.contains(6)).toBeTruthy();
    expect(range.contains(7)).toBeFalsy();
  });

  test("minimumで最小値が取れる", () => {
    const range = from<number>(4).to(6);
    expect(range.minimum).toBe(4);
  });

  test("maximumで最大値が取れる", () => {
    const range = from<number>(4).to(6);
    expect(range.maximum).toBe(6);
  });
});
