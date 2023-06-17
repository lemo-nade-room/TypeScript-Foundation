import { IEquatableObject, equals } from "../equality";
import { IClonable } from "../clone";

export class Api implements IEquatableObject<Api>, IClonable<Api> {
  constructor(
    readonly baseURL: string,
    readonly init: RequestInit,
    readonly before: () => void,
    readonly after: () => void
  ) {}

  /**
   * fetchを実行する
   * @param path baseURLに続くパス
   * @param init fetchのinit
   */
  async fetch(path: string, init?: RequestInit): Promise<Response> {
    this.before();
    const response = await fetch(
      `${this.baseURL}${path}`,
      this.mergeInit(init)
    );
    this.after();
    return response;
  }

  async get(path: string, init?: RequestInit): Promise<Response> {
    return await this.methodFetch("GET", path, init);
  }

  async post(path: string, init?: RequestInit): Promise<Response> {
    return await this.methodFetch("POST", path, init);
  }

  async patch(path: string, init?: RequestInit): Promise<Response> {
    return await this.methodFetch("PATCH", path, init);
  }

  async put(path: string, init?: RequestInit): Promise<Response> {
    return await this.methodFetch("PUT", path, init);
  }

  async delete(path: string, init?: RequestInit): Promise<Response> {
    return await this.methodFetch("DELETE", path, init);
  }

  create(
    path: string,
    init?: RequestInit,
    before?: () => void,
    after?: () => void
  ): Api {
    return new Api(
      `${this.baseURL}${path}`,
      this.mergeInit(init),
      this.mergeBefore(before),
      this.mergeAfter(after)
    );
  }

  equals(other: Api): boolean {
    return (
      this.baseURL === other.baseURL &&
      equals(this.init, other.init) &&
      this.before === other.before &&
      this.after === other.after
    );
  }

  get clone(): Api {
    return new Api(
      this.baseURL,
      Object.create(this.init),
      this.before,
      this.after
    );
  }

  private methodFetch(
    method: string,
    path: string,
    init?: RequestInit
  ): Promise<Response> {
    return this.fetch(`${this.baseURL}${path}`, {
      ...init,
      method,
    });
  }

  private mergeInit(init?: RequestInit): RequestInit {
    if (init == null) return this.init;
    return {
      ...this.init,
      headers: this.mergeHeaders(init.headers),
    };
  }

  private mergeHeaders(headersInit?: HeadersInit): Headers {
    if (headersInit == null) return new Headers(this.init.headers);
    const headers = new Headers(this.init.headers);
    for (const [key, value] of new Headers(headersInit)) {
      headers.set(key, value);
    }
    return headers;
  }

  private mergeBefore(before?: () => void): () => void {
    if (before == null) return this.before;
    return () => {
      this.before();
      before();
    };
  }

  private mergeAfter(after?: () => void): () => void {
    if (after == null) return this.after;
    return () => {
      after();
      this.after();
    };
  }
}

export function api(args: {
  baseURL?: string;
  init?: RequestInit;
  before?: () => void;
  after?: () => void;
}): Api {
  return new Api(
    args.baseURL ?? "",
    args.init ?? {},
    args.before ?? (() => {}),
    args.after ?? (() => {})
  );
}
