# @lemonaderoom/foundation

[![NPM version](https://img.shields.io/npm/v/@lemonaderoom/foundation.svg?style=flat)](https://npmjs.org/package/@lemonaderoom/foundation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript Foundation Libraryです。

## 特長

- SwiftのEquatableに似たEquatable型
  - Equatableを継承すると等価比較可能になる
- Clonable型
  - Clonableを継承するとクローン可能になる
- Codable型
  - Codableを継承するとJSONシリアライズ可能になる
- SwiftとScalaとJavaに似たOptional型
  - 型安全なnullとundefinedのラッパー
  - mapやflatMap等が使用可能
  - Scalaのようなfor-yieldが可能
- SwiftのResultとScalaのEitherに似たResult型
  - mapやflatMap等が使用可能

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

- [Equatable](src/equality/equatable.test.ts)
- [Clonable](src/clone/clonable.test.ts)
- [Codable](src/codable/codable.test.ts)
- [Optional](src/optional/optional.test.ts)
  - [Some](src/optional/some.test.ts)
  - [None](src/optional/none.test.ts)
  - [for-yield](src/for/optional-for.test.ts)
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
