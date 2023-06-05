import { describe, test, expect } from "vitest";
import { from } from "./openRange";
import { Range } from "./range";
import { ClosedRange } from "./closedRange";

describe("Open Range Tests", () => {
  test("containsで含むか確認できる", () => {
    const range = from<number>(4);

    expect(range.contains(3)).toBeFalsy();
    expect(range.contains(4)).toBeTruthy();
    expect(range.contains(5)).toBeTruthy();
  });

  test("minimumで最小値が取れる", () => {
    const range = from<number>(4);
    expect(range.minimum).toBe(4);
  });

  test("untilでRange型が生成できる", () => {
    const expected = new Range(4, 6);
    const actual = from<number>(4).until(6);
    expect(actual).toEqual(expected);
  });

  test("toでClosedRange型が生成できる", () => {
    const expected = new ClosedRange(4, 6);
    const actual = from<number>(4).to(6);
    expect(actual).toEqual(expected);
  });
});
