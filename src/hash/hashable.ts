import { Equatable } from "../equality";
import { hash } from "./hash";
import { IHashableObject } from "./iHashableObject";

export class Hashable<Self extends object>
  extends Equatable<Self>
  implements IHashableObject<Self>
{
  constructor() {
    super();
  }

  get hashValue(): string {
    return hash(this.properties.map(hash).join(" "));
  }
}
