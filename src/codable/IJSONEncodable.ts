export interface IJSONEncodable {
  readonly json: unknown;
}

export function isJSONEncodable(object: unknown): object is IJSONEncodable {
  return typeof object === "object" && object !== null && "json" in object;
}

export function JSONEncode(object: unknown): unknown {
  if (object == null) return object;
  if (typeof object !== "object") return object;
  if (isJSONEncodable(object)) return object.json;
  if (Array.isArray(object)) {
    return object.map((value) => JSONEncode(value));
  }
  const clone: Record<string, unknown> = {};
  for (const key in object) {
    clone[key] = JSONEncode((object as Record<string, unknown>)[key]);
  }
  return clone;
}
