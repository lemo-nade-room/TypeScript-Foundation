export interface IDecodable<Self> {
  decode(object: unknown): Self;
}

export function isDecodable(object: unknown): object is IDecodable<unknown> {
  return (
    typeof object === "object" &&
    object !== null &&
    "decode" in object &&
    typeof object.decode === "function"
  );
}
