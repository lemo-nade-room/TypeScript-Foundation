export interface IJSONEncodable {
  readonly encode: unknown;
}

export function isJSONEncodable(object: unknown): object is IJSONEncodable {
  return typeof object === "object" && object !== null && "encode" in object;
}

export function JSONEncode(object: unknown): unknown {
  if (isJSONEncodable(object)) {
    return object.encode;
  }
  if (typeof object === "object" && object !== null) {
    if (Array.isArray(object)) {
      return object.map((value) => JSONEncode(value));
    }
    const clone: Record<string, unknown> = {};
    for (const key in object) {
      clone[key] = JSONEncode((object as Record<string, unknown>)[key]);
    }
    return clone;
  }
  return object;
}
