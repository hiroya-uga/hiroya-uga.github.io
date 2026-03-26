---
title: "dom-accessibility-apiで\n要素のアクセシブルな名前を取得する"
publishedAt: '2026-03-02T13:25:47+09:00'
topics: [JavaScript, npm, アクセシビリティ, Tips]
dependencies: 'dom-accessibility-api'
proficiencyLevel: 'Intermediate'
---

テストとかチェックツールとか書いてると、たまにアクセシブルな名前（accessible name）やアクセシブルな説明（accessible description）を気軽に拾いたくなることがありますよね。

そこで今回は[dom-accessibility-api](https://www.npmjs.com/package/dom-accessibility-api)ご紹介します[^1]。

[^1]: 以前は[accname](https://www.npmjs.com/package/accname)というnpmパッケージが知られていたが、現在はメンテナンスが終了している模様。リポジトリ[@google/accname](https://github.com/google/accname)は2025年8月22日にアーカイブされている。

## dom-accessibility-apiの概要

<https://github.com/eps1lon/dom-accessibility-api>

このライブラリは、アクセシブルな名前や説明を計算してくれます。  
2026年3月時点ではv0.7.1が出ており、[web-platform-tests](https://github.com/web-platform-tests/wpt)のテストケースのうち、Browser(Chrome)で153/159、jsdomでは138/159パスしています[^2]。

[^2]: 擬似要素の`content`まわりや、ShadowDOMの一部でまだ調整中のケースがある

[CodePen: dom-accessibility-api example](https://codepen.io/hiroya_uga/pen/qEaOEpE)

READMEには書かれていないですが、ロールを計算するための`getRole`も提供されていそうですね[^3]。

[^3]: おそらく内部実装の一部であり公式にアナウンスされているものでもないため、サポートが十分でない場合や、挙動が変わったりするリスクがあることに注意。

### options?: ComputeTextAlternativeOptions

`computeAccessibleName()`および`computeAccessibleDescription()`はそれぞれ任意で第2引数を取ります。

```js
import { computeAccessibleName, computeAccessibleDescription } from 'dom-accessibility-api';

computeAccessibleName(element, options);
computeAccessibleDescription(element, options);
```

- `element`: 計算したい対象の`Element`
- `options`（optional）
  - `compute`（optional）: `"name" | "description"` 名前と説明どちらを計算するか
  - `computedStyleSupportsPseudoElements`（optional）: 擬似要素に対応している環境かどうか
  - `getComputedStyle`（optional）: `getComputedStyle`のモック
  - `hidden`（optional）: 本来アクセシビリティツリー上、無視されているノードも計算に含めるかどうか

どのoptionもたいていの場合は常用のものではなさそうです。

```ts
const mockedGetComputedStyle = (_: Element) => {
  return {
    getPropertyValue(key: keyof CSSStyleDeclaration) {
      const isMocked = typeof this[key] === 'string';
      return isMocked ? this[key] : '';
    },
    content: '',
    display: 'block',
    visibility: 'visible',
  } as CSSStyleDeclaration;
};

computeAccessibleName(element, {
  computedStyleSupportsPseudoElements: false,
  getComputedStyle: mockedGetComputedStyle,
  hidden: false,
});
```

非常に直感的でシンプルな設計です。

## 余談

もともとは要素のアクセシビリティオブジェクトを取得するためのWeb APIとして、`getComputedAccessibleNode()`が提供される予定でした。実際にはプライバシー上の懸念があったり、アクセシビリティツリーをJavaScriptに安全に公開するハードルが高かったりなどの理由で仕様から消えていきましたが、テストの文脈ではまだまだ高い需要があります。

筆者自身も、テストの文脈でこのライブラリに助けられた一人です。

なお、アクセシブルな名前や説明の計算方法は[Accessible Name and Description Computation](https://w3c.github.io/accname/#computation-steps)という仕様で定義されていて、dom-accessibility-apiもこれに準拠して開発されています。以前筆者も[このツール](https://uga.dev/tools/accessible-name-and-description-computation/)を作ったときに参照しました。

アクセシブルな名前はざっくり次の優先順位で取得され、上位のものが見つかれば**それ以外は無視**されます。

1. `aria-labelledby`属性
2. `aria-label`属性
3. `alt`属性、`label`要素など
4. 子孫要素から集めた文字列
5. `title`属性

アクセシブルな説明については次のとおりです。

1. `aria-describedby`属性
2. `aria-description`属性
3. `title`属性

これらの仕様は一見複雑そうだけど複雑だぜ。  
とはいえ、だいたいの流れを知っておいても損はありません。読んだことがない方はぜひ一度覗いてみてください。

ちなみにコードベースで必要なければ、ブラウザによる計算結果は[Chromeの開発者ツールで確認できます](https://developer.chrome.com/blog/full-accessibility-tree?hl=ja)。フォーム周りの実装時にはとくに助かる機能です。

見えないところに宿る品質。  
表面を眺めただけではわからないアクセシビリティオブジェクトにまで目を向けてこそ、責任感のあるUI開発者、ひいてはフロントエンドエンジニアなのだと筆者は思っています🍵
