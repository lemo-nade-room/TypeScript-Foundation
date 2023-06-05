import { IEquatableObject } from "./iEquatableObject";
import { equals, IEquatable } from "./iEquatable";

export class Equatable<Self extends object> implements IEquatableObject<Self> {
  equals(other: Self): boolean {
    if (!("properties" in other && Array.isArray(other.properties))) {
      return false;
    }
    if (this.properties.length !== other.properties.length) {
      return false;
    }
    return this.properties.every((property, index) => {
      return equals(property, (other.properties as Array<IEquatable>)[index]);
    });
  }

  get keys(): readonly string[] {
    const keys: string[] = [];
    for (const key in this) {
      keys.push(key);
    }
    return keys;
  }

  get properties(): readonly IEquatable[] {
    return this.keys.map(
      (key) => (this as Record<string, unknown>)[key] as IEquatable
    );
  }
}
