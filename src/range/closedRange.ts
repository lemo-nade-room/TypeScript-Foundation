import { Updatable } from "../update";
import { IComparable } from "../compare";

export class ClosedRange<T extends IComparable> extends Updatable<
  ClosedRange<T>
> {
  constructor(readonly minimum: T, readonly maximum: T) {
    super();
  }

  contains(value: T): boolean {
    return this.minimum <= value && value <= this.maximum;
  }
}
