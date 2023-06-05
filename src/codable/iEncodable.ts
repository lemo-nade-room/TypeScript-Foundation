export interface IEncodable {
  readonly encode: unknown;
}

export function isEncodable(object: unknown): object is IEncodable {
  return typeof object === "object" && object !== null && "encode" in object;
}

export function encode(object: unknown): unknown {
  if (isEncodable(object)) {
    return object.encode;
  }
  if (typeof object === "object" && object !== null) {
    if (Array.isArray(object)) {
      return object.map((value) => encode(value));
    }
    const clone: Record<string, unknown> = {};
    for (const key in object) {
      clone[key] = encode((object as Record<string, unknown>)[key]);
    }
    return clone;
  }
  return object;
}
