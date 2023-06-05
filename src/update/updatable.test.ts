import { describe, test, expect } from "vitest";
import { Updatable } from "./updatable";

describe("Updatable Tests", () => {
  class Human extends Updatable<Human> {
    constructor(readonly name: string, readonly age: number) {
      super();
    }
  }

  test("updateメソッドで浅い更新ができ、元のオブジェクトに影響しない", () => {
    const human = new Human("Taro", 20);
    const updatedHuman = human.update({
      name: "Jiro",
    });
    expect(updatedHuman.name).toBe("Jiro");
    expect(updatedHuman.age).toBe(20);

    expect(human.name).toEqual("Taro");
  });
});
