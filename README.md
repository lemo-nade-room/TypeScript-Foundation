# @lemonaderoom/foundation

[![NPM version](https://img.shields.io/npm/v/@lemonaderoom/foundation.svg?style=flat)](https://npmjs.org/package/@lemonaderoom/foundation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript Foundation Libraryです。Nullableな値を安全に扱うための`Optional`型を提供します。

## 特長

- TypeScriptの強力な型システムを活用し、Nullableな値を安全に扱うことが可能
- チェイン可能なメソッドを提供、関数型プログラミングスタイルにも対応
- 丁寧に設計されたAPIと詳細なテストにより、信頼性の高いコードベース

## インストール

以下のコマンドを使用して、npm経由でパッケージをプロジェクトにインストールします:

```bash
npm i -D @lemonaderoom/foundation
```

もしくは、yarnを使用する場合は次のコマンドを使用します:

```bash
yarn add @lemonaderoom/foundation
```

## 使い方

### Optional型の作成

`Optional`型を作成するために、`some`と`none`関数を提供しています。

```ts
import { some, none } from "@lemonaderoom/foundation";

const option1 = some("hello"); // 値が存在する場合
const option2 = none(); // 値が存在しない場合
```

Nullableな値をOptional型に変換するには、`optional`関数を使用します。

```ts
import { optional } from "@lemonaderoom/foundation";

const value = null as string | null;
const option = optional(value); // noneを返す
```

### Optional型の操作

Optional型はいくつかのメソッドを提供しています。

- `get` - 値が存在する場合にその値を返し、存在しない場合はエラーをスローします。
- `getOrElse` - 値が存在する場合にその値を返し、存在しない場合はデフォルト値を返します。
- `orElse` - 値が存在する場合にそのOptional型を返し、存在しない場合はデフォルトのOptional型を返します。
- `isDefined` - 値が存在する場合にtrueを返します。
- `isEmpty` - 値が存在しない場合にtrueを返します。
- `map` - 値が存在する場合に関数を適用してその結果を持つ新しいOptional型を返します。
- `flatMap` - 値が存在する場合に関数を適用してその結

果を持つ新しいOptional型を返します。関数はOptional型を返す必要があります。
- `equals` - 他のOptional型と比較します。
- `fold` - 値が存在する場合と存在しない場合で適用する関数を切り替えます。
- `unwrap` - 値が存在する場合にその値を返し、存在しない場合は提供されたエラーをスローします。

## テストの実行

テストは[vitest](https://github.com/vitest-dev/vitest)を使用して実行できます。以下のコマンドでテストを実行します。

```bash
npm test
```

## ライセンス

このプロジェクトはMITライセンスの元で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。
