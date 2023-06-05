import { Equatable } from "../equality";
import { isClonable } from "./iClonable";

export class Clonable<Self extends object> extends Equatable<Self> {
  constructor() {
    super();
  }

  get clone(): Self {
    const copy = Object.create(this);
    this.keys.forEach((key) => {
      const property = (this as Record<string, unknown>)[key];
      if (isClonable(property)) {
        copy[key] = property.clone;
        return;
      }
      if (Array.isArray(property)) {
        copy[key] = property.map((value) => {
          if (isClonable(value)) {
            return value.clone;
          }
          return value;
        });
        return;
      }
    });
    return copy;
  }
}
