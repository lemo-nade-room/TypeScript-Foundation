import { expect } from "vitest";
import { IEquatableObject } from "./iEquatableObject";

/** Equatableの値をassertする */
export function assertEquals<T extends IEquatableObject<T>>(
  actual: T,
  expected: T
): void {
  expect(
    actual.equals(expected),
    `actual: ${String(actual)}, expected: ${String(expected)}`
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
