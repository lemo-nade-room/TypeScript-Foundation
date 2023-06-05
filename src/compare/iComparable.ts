import { IEquatableObject } from "../equality";

export interface Comparable<Self> extends IEquatableObject<Self> {
  compare(compared: Self): boolean;
}

export type IComparable = string | number | bigint | Comparable<unknown>;

export function isComparableObject(
  value: unknown
): value is Comparable<unknown> {
  return (
    value != null &&
    typeof value === "object" &&
    "compare" in value &&
    typeof value.compare === "function"
  );
}

export function isComparable(value: unknown): value is IComparable {
  if (typeof value === "string") return true;
  if (typeof value === "number") return true;
  if (typeof value === "bigint") return true;
  return isComparableObject(value);
}

export function compare<T>(a: T, b: T): boolean {
  if (!isComparable(a)) {
    throw new Error(`should be comparable but: ${a}`);
  }
  if (isComparableObject(a)) {
    return a.compare(b);
  }
  return a < b;
}
