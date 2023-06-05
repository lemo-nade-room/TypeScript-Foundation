export interface IEncodable {
  readonly encode: unknown;
}

export function isEncodable(object: unknown): object is IEncodable {
  return typeof object === "object" && object !== null && "encode" in object;
}
