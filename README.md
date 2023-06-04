# @lemonaderoom/foundation

[![NPM version](https://img.shields.io/npm/v/@lemonaderoom/foundation.svg?style=flat)](https://npmjs.org/package/@lemonaderoom/foundation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript Foundation Libraryです。Nullableな値を安全に扱うための`Optional`型を提供します。

## 特長

- SwiftチックなScala風のOptional型とResult型

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

テストコードをご覧ください

- [Optional](src/optional/optional.test.ts)
  - [Some](src/optional/some.test.ts)
  - [None](src/optional/none.test.ts)
- [Result](src/result/result.test.ts)
  - [Success](src/result/success.test.ts)
  - [Failure](src/result/failure.test.ts)

## テストの実行

テストは[vitest](https://github.com/vitest-dev/vitest)を使用して実行できます。以下のコマンドでテストを実行します。

```bash
npm test
```

## ライセンス

このプロジェクトはMITライセンスの元で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。
