import { Optional } from "../optional";
import { success } from "./success";
import { failure } from "./failure";
import { IEquatableObject } from "../equality";
import { IClonable } from "../clone";

export interface Either<Failure, Success>
  extends IEquatableObject<Either<Failure, Success>>,
    IClonable<Either<Failure, Success>> {
  /** successの場合、値を取得する。failureの場合、Errorを投げる。 */
  readonly get: Success;

  /** successの場合、Errorを投げる。failureの場合、値を取得する。 */
  readonly getError: Failure;

  readonly isSuccess: boolean;

  readonly isFailure: boolean;

  /** successの場合、値をsomeに変換する。failureの場合、noneを返す。 */
  readonly toOptional: Optional<Success>;

  /** successの場合、値を変換する。failureの場合、何もしない。 */
  map<U>(f: (value: Success) => U): Either<Failure, U>;

  /** successの場合、値を変換して平らにする。failureの場合、何もしない。 */
  flatMap<U>(f: (value: Success) => Either<Failure, U>): Either<Failure, U>;

  /** successの場合、何もしない。failureの場合、Errorを変換する。 */
  mapError<U>(f: (error: Failure) => U): Either<U, Success>;

  /** successの場合、何もしない。failureの場合、Errorを変換して平らにする。 */
  flatMapError<U>(
    f: (error: Failure) => Either<U, Success>
  ): Either<U, Success>;

  /** 2つのResultを比較する。 */
  equals(
    compared: Either<Failure, Success>,
    comparisonFunc?: (a: Success, b: Success) => boolean,
    comparisonErrorFunc?: (a: Failure, b: Failure) => boolean
  ): boolean;
}

export function toEither<Success, Failure = Error>(
  cb: () => Success
): Either<Failure, Success> {
  try {
    return success(cb());
  } catch (e) {
    return failure(e as Failure);
  }
}

export async function toEitherAsync<Success, Failure = Error>(
  cb: () => Promise<Success>
): Promise<Either<Failure, Success>> {
  try {
    return success(await cb());
  } catch (e) {
    return failure(e as Failure);
  }
}
