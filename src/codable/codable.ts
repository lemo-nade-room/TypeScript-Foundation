import { IEncodable } from "./iEncodable";
import { IDecodable, isDecodable } from "./iDecodable";
import { Updatable } from "../update";

export class Codable<Self extends object>
  extends Updatable<Self>
  implements IEncodable, IDecodable<Self>
{
  constructor() {
    super();
  }

  get encode(): unknown {
    return this;
  }

  decode(json: unknown): Self {
    if (!(typeof json === "object" && json !== null)) {
      throw new Error(`decode object should be an object, but got ${json}`);
    }
    const object = json as Record<string, unknown>;
    const clone = this.clone as unknown as Record<string, unknown>;
    for (const key in object) {
      if (!(key in clone)) continue;
      const property = clone[key];
      if (typeof property !== "object" || property == null) {
        clone[key] = object[key];
        continue;
      }
      if (isDecodable(property)) {
        clone[key] = property.decode(object[key]);
        continue;
      }
      if (!Array.isArray(property)) continue;
      if (property.length === 0 || !isDecodable(property[0])) {
        clone[key] = object[key];
        continue;
      }
      if (!Array.isArray(object[key])) continue;
      clone[key] = (object[key] as Array<unknown>).map((value) => {
        return property[0].decode(value);
      });
    }
    return clone as Self;
  }
}
