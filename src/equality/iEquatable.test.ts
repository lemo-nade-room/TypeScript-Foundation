import { describe, test, expect } from "vitest";
import { equals, IEquatable } from "./iEquatable";
import { IEquatableObject } from "./iEquatableObject";

class TestCase {
  constructor(
    readonly a: IEquatable,
    readonly b: IEquatable,
    readonly expected: boolean
  ) {}

  assert() {
    expect(equals(this.a, this.b), this.message).toBe(this.expected);
  }

  private get message(): string {
    return `a: ${String(this.a)}, b: ${String(this.b)}, expected: ${
      this.expected
    }`;
  }
}

describe("equals Tests", () => {
  test("booleanで比較可能", () => {
    const testCases: readonly TestCase[] = [
      new TestCase(true, true, true),
      new TestCase(true, false, false),
      new TestCase(false, true, false),
      new TestCase(false, false, true),
    ];
    testCases.forEach((testCase) => testCase.assert());
  });

  test("numberで比較可能", () => {
    const testCases: readonly TestCase[] = [
      new TestCase(1, 1, true),
      new TestCase(1, 2, false),
    ];
    testCases.forEach((testCase) => testCase.assert());
  });

  test("undefinedとnullは区別をつけない", () => {
    const testCases: readonly TestCase[] = [
      new TestCase(undefined, undefined, true),
      new TestCase(undefined, null, true),
      new TestCase(null, undefined, true),
    ];
    testCases.forEach((testCase) => testCase.assert());
  });

  test("stringの比較", () => {
    const testCases: readonly TestCase[] = [
      new TestCase("hello", "hello", true),
      new TestCase("hello", "world", false),
    ];
    testCases.forEach((testCase) => testCase.assert());
  });

  test("関数は参照値で比較", () => {
    const f = () => "world";
    const testCases: readonly TestCase[] = [
      new TestCase(
        () => "hello",
        () => "hello",
        false
      ),
      new TestCase(f, f, true),
    ];
    testCases.forEach((testCase) => testCase.assert());
  });

  class True implements IEquatableObject<True> {
    constructor(readonly name: string, readonly age: number) {}

    equals(_: True): boolean {
      return true;
    }
  }
  class False implements IEquatableObject<False> {
    constructor(readonly name: string, readonly age: number) {}

    equals(_: False): boolean {
      return false;
    }
  }

  test("オブジェクトで比較", () => {
    const testCases: readonly TestCase[] = [
      new TestCase(new True("hello", 1), new True("hello", 1), true),
      new TestCase(new False("hello", 1), new False("hello", 1), false),
    ];
  });
});
