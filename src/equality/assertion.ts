import { expect } from "vitest";
import { IEquatableObject } from "./iEquatableObject";

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
