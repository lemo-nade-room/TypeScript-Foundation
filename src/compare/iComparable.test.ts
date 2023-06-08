import { describe, test, expect } from "vitest";
import { compareTo, isComparable } from "./iComparable";

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

  test("compareToで同じならば0を返す", () => {
    const a = { compare: () => false, equals: () => true };
    const b = { compare: () => true, equals: () => true };
    expect(compareTo(a, b)).toBe(0);
  });

  test("左の方が小さいならばで同じならば-1を返す", () => {
    const a = { compare: () => true, equals: () => false };
    const b = { compare: () => false, equals: () => false };
    expect(compareTo(a, b)).toBe(-1);
  });

  test("右の方が小さいならばで同じならば1を返す", () => {
    const a = { compare: () => false, equals: () => false };
    const b = { compare: () => true, equals: () => false };
    expect(compareTo(a, b)).toBe(1);
  });
});
