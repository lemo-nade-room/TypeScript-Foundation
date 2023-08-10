import { IJSONEncodable } from "./IJSONEncodable";
import { decode, IDecodable } from "./iDecodable";
import { Updatable } from "../update";

export class Codable<Self extends object>
  extends Updatable<Self>
  implements IJSONEncodable, IDecodable<Self>
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
      clone[key] = decode(object[key], clone[key] as any);
    }
    return clone as Self;
  }
}
