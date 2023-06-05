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

  get properties(): readonly IEquatable[] {
    const properties: IEquatable[] = [];
    for (const key in this) {
      properties.push(this[key] as IEquatable);
    }
    return properties;
  }
}
