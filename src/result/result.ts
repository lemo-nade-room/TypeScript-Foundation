import { Optional } from "../optional";
import { success } from "./success";
import { failure } from "./failure";
import { IEquatableObject } from "../equality";
import { IClonable } from "../clone";

export interface Result<T, E>
  extends IEquatableObject<Result<T, E>>,
    IClonable<Result<T, E>> {
  /** successの場合、値を取得する。failureの場合、Errorを投げる。 */
  readonly get: T;

  /** successの場合、Errorを投げる。failureの場合、値を取得する。 */
  readonly getError: E;

  readonly isSuccess: boolean;

  readonly isFailure: boolean;

  /** successの場合、値をsomeに変換する。failureの場合、noneを返す。 */
  readonly toOptional: Optional<T>;

  /** successの場合、値を変換する。failureの場合、何もしない。 */
  map<U>(f: (value: T) => U): Result<U, E>;

  /** successの場合、値を変換して平らにする。failureの場合、何もしない。 */
  flatMap<U>(f: (value: T) => Result<U, E>): Result<U, E>;

  /** successの場合、何もしない。failureの場合、Errorを変換する。 */
  mapError<U>(f: (error: E) => U): Result<T, U>;

  /** successの場合、何もしない。failureの場合、Errorを変換して平らにする。 */
  flatMapError<U>(f: (error: E) => Result<T, U>): Result<T, U>;

  /** 2つのResultを比較する。 */
  equals(
    compared: Result<T, E>,
    comparisonFunc?: (a: T, b: T) => boolean,
    comparisonErrorFunc?: (a: E, b: E) => boolean
  ): boolean;
}

export function resultBuilder<T, E = Error>(cb: () => T): Result<T, E> {
  try {
    return success(cb());
  } catch (e) {
    return failure(e as E);
  }
}

export async function asyncResultBuilder<T, E = Error>(
  cb: () => Promise<T>
): Promise<Result<T, E>> {
  try {
    return success(await cb());
  } catch (e) {
    return failure(e as E);
  }
}
