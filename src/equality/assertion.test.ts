import { expect, describe, test } from "vitest";
import { IEquatableObject } from "./iEquatableObject";
import { Equatable } from "./equatable";

/** Equatableの値をassertする */
export function assertEquals<T extends IEquatableObject<T>>(
  actual: T,
  expected: T
): void {
  expect(
    actual.equals(expected),
    `actual: \n${JSON.stringify(actual)}\nexpected: \n${JSON.stringify(
      expected
    )}\n`
  ).toBeTruthy();
}

/** Equatableの値をassertする */
export function assertNotEquals<T extends IEquatableObject<T>>(
  actual: T,
  expected: T
): void {
  expect(
    actual.equals(expected),
    `should be not same object but actual: ${String(actual)}`
  ).toBeFalsy();
}

describe("Assertion Tests", function () {
  class Equality extends Equatable<Equality> {
    constructor(readonly value: string) {
      super();
    }
  }

  test("assertEquals", () => {
    const actual = new Equality("hello");
    const expected = new Equality("hello");
    assertEquals(actual, expected);
  });

  test("true", () => {
    const actual = { equals: () => true };
    const expected = { equals: () => false };
    assertEquals(actual, expected);
  });
});
