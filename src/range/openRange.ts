import { IComparable } from "../compare";
import { Updatable } from "../update";
import { Range } from "./range";
import { ClosedRange } from "./closedRange";

/** a ... */
export class OpenRange<T extends IComparable> extends Updatable<OpenRange<T>> {
  constructor(readonly minimum: T) {
    super();
  }

  /** 引数の値を含むか */
  contains(value: T): boolean {
    return this.minimum <= value;
  }

  until(maximum: T): Range<T> {
    return new Range(this.minimum, maximum);
  }

  to(maximum: T): ClosedRange<T> {
    return new ClosedRange<T>(this.minimum, maximum);
  }
}

export function from<T extends IComparable>(minimum: T): OpenRange<T> {
  return new OpenRange(minimum);
}
