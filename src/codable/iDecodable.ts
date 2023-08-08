import { clone } from "../clone";

export interface IDecodable<Self> {
  decode(object: unknown): Self;
}

export function isDecodable<T>(object: unknown): object is IDecodable<T> {
  return (
    typeof object === "object" &&
    object !== null &&
    "decode" in object &&
    typeof object.decode === "function"
  );
}

export function decode<
  T extends
    | IDecodable<T>
    | string
    | number
    | boolean
    | bigint
    | undefined
    | null
>(json: unknown, origin: T): T {
  if (json == null && origin == null) {
    return origin;
  }
  if (origin instanceof Date && typeof json === "string") {
    return new Date(json) as unknown as T;
  }
  if (isDecodable<T>(origin)) {
    return origin.decode(json);
  }
  if (typeof json !== typeof origin) {
    throw new Error(
      `Decode Type Error! expected ${typeof json} but got ${origin} of ${typeof origin}`
    );
  }
  if (typeof json !== "object") {
    return json as T;
  }
  if (Array.isArray(origin)) {
    if (!Array.isArray(json)) {
      throw new Error(`Decode Type Error! expected Array but got ${json}`);
    }
    if (origin.length === 0) {
      throw new Error(`Decode Type Error! should be non-empty Array`);
    }
    return json.map((childJson) =>
      decode(childJson, origin[0])
    ) as unknown as T;
  }
  const newObject = clone(origin) as unknown as Record<string, unknown>;
  for (const key in json) {
    if (!(key in newObject)) continue;
    newObject[key] = decode<any>(
      (json as any)[key] as any,
      newObject[key] as unknown
    );
  }
  return newObject as T;
}
