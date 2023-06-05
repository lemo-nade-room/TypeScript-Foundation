import { describe, test, expect } from "vitest";
import { isComparable } from "./iComparable";

describe("isComparable Tests", () => {
  test("string, number, bigintは比較可能", () => {
    expect(isComparable("")).toBeTruthy();
    expect(isComparable(1)).toBeTruthy();
    expect(isComparable(BigInt(3))).toBeTruthy();
  });

  test("通常のオブジェクトは比較できない", () => {
    expect(isComparable({})).toBeFalsy();
  });

  test("compareメソッドを持つオブジェクトは比較可能", () => {
    expect(isComparable({ compare: () => true })).toBeTruthy();
  });

  test("compareプロパティを持つオブジェクトは比較不可", () => {
    expect(isComparable({ compare: "" })).toBeFalsy();
  });
});
