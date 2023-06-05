import { Clonable } from "../clone/clonable";
import { IUpdatable } from "./iUpdatable";

export class Updatable<Self>
  extends Clonable<Updatable<Self>>
  implements IUpdatable<Self>
{
  constructor() {
    super();
  }

  update(content: Partial<Self>): Self {
    return Object.assign(this.clone, content) as Self;
  }
}
