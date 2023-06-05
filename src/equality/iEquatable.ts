import { IEquatableObject, isEquatableObject } from "./iEquatableObject";

export type IEquatable =
  | undefined
  | boolean
  | null
  | number
  | bigint
  | string
  | symbol
  | Function
  | IEquatableObject<unknown>;

export function equals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((element, index) => equals(element, b[index]));
  }
  if (isEquatableObject(a) && isEquatableObject(b)) {
    return a.equals(b);
  }
  return false;
}
