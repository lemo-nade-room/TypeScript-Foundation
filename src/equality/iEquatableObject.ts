/** 比較可能なオブジェクトのインターフェース */
export interface IEquatableObject<Self> {
  equals(other: Self): boolean;
}

export function isEquatableObject(
  object: unknown
): object is IEquatableObject<typeof object> {
  return (
    typeof object === "object" &&
    object != null &&
    "equals" in object &&
    typeof object.equals === "function"
  );
}
