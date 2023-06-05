import { Updatable } from "../update";
import { IComparable } from "../compare";

/** a ..< b */
export class Range<T extends IComparable> extends Updatable<Range<T>> {
  constructor(readonly minimum: T, readonly maximum: T) {
    super();
  }

  contains(value: T): boolean {
    return this.minimum <= value && value < this.maximum;
  }
}
