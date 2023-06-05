export interface IUpdatable<Self> {
  update(content: Partial<Self>): Self;
}
