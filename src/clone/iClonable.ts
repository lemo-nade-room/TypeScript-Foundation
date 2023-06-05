export interface IClonable<Self> {
  readonly clone: Self;
}

export function isClonable(object: unknown): object is IClonable<unknown> {
  return (
    typeof object === "object" &&
    object !== null &&
    "clone" in object &&
    typeof object.clone === "object"
  );
}

export function clone<T>(value: T): T {
  return isClonable(value) ? (value as IClonable<T>).clone : value;
}
