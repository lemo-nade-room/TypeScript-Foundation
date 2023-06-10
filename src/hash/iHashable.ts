import { IHashableObject } from "./iHashableObject";

export type IHashable =
  | undefined
  | boolean
  | null
  | number
  | bigint
  | string
  | symbol
  | IHashableObject<unknown>;

export function isHashable(object: unknown): object is IHashable {
  if (typeof object === "object" && object != null) {
    if (typeof object === "boolean") return true;
    if (typeof object === "number") return true;
    if (typeof object === "bigint") return true;
    if (typeof object === "string") return true;
    if (typeof object === "symbol") return true;
    if (object instanceof Date) return true;
    if (object instanceof RegExp) return true;
    if (object instanceof Map) return true;
    if (object instanceof Set) return true;
    if (Array.isArray(object)) return true;
    if ("hashValue" in object && typeof object.hashValue === "string")
      return true;
  }
  return false;
}
