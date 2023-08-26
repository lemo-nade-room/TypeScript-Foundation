import { IJSONEncodable, JSONEncode } from "./IJSONEncodable";
import { Updatable } from "../update";

export class JSONEncodable<Self extends object>
  extends Updatable<Self>
  implements IJSONEncodable
{
  constructor() {
    super();
  }

  get json(): unknown {
    const clone: Record<string, unknown> = {};
    for (const key in this) {
      clone[key] = JSONEncode((this as Record<string, unknown>)[key]);
    }
    return clone;
  }
}
