import { describe, test, expect } from "vitest";
import { isClonable } from "./iClonable";

describe("isClonable Tests", () => {
  test("objectでない場合はfalse", () => {
    expect(isClonable(1)).toBeFalsy();
    expect(isClonable("hello")).toBeFalsy();
    expect(isClonable(true)).toBeFalsy();
    expect(isClonable(undefined)).toBeFalsy();
    expect(isClonable(null)).toBeFalsy();
  });

  test("cloneプロパティがない場合はfalse", () => {
    expect(isClonable({})).toBe(false);
  });

  test("cloneプロパティがある場合はtrue", () => {
    expect(isClonable({ clone: {} })).toBeTruthy();
  });

  test("cloneがobject以外を返す場合はfalse", () => {
    expect(isClonable({ clone: "" })).toBeFalsy();
  });
});
