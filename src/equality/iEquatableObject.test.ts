import { describe, test, expect } from "vitest";
import { IEquatableObject, isEquatableObject } from "./iEquatableObject";

describe("isEquatableObject Tests", () => {
  class E implements IEquatableObject<E> {
    equals(other: E): boolean {
      return false;
    }
  }
  test("準拠したものならばtrue", () => {
    expect(isEquatableObject(new E())).toBeTruthy();
  });

  test("関数のequalsがあればtrue", () => {
    expect(isEquatableObject({ equals: () => true })).toBeTruthy();
  });

  test("関数以外のequalsがあればfalse", () => {
    expect(isEquatableObject({ equals: "hello" })).toBeFalsy();
  });

  test("nullであればfalse", () => {
    expect(isEquatableObject(null)).toBeFalsy();
  });

  test("objectでなければfalse", () => {
    expect(isEquatableObject("hello")).toBeFalsy();
  });
});
