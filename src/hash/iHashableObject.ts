import { IEquatableObject } from "../equality";

export interface IHashableObject<Self> extends IEquatableObject<Self> {
  readonly hashValue: string;
}

export function isHashableObject<T>(
  object: unknown
): object is IHashableObject<T> {
  if (typeof object !== "object") return false;
  if (object == null) return false;
  return "hashValue" in object && typeof object.hashValue === "string";
}
