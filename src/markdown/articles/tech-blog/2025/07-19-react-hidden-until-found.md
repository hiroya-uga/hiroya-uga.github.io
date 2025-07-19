---
title: "`hidden=\"until-found\"`を\nReactでも使いたい！"
publishedAt: '2025-07-19'
tags: [React, Web標準]
---

HTMLのグローバル属性`hidden`は`until-found`を指定することで、その中のコンテンツが見つかるまでの間だけ非表示にできます。

> すべての [HTML要素](https://momdo.github.io/html/infrastructure.html#html-elements) は `hidden` コンテンツ属性設定を持ってもよい。[`hidden`](https://momdo.github.io/html/interaction.html#attr-hidden) 属性は、次のキーワードと状態を持つ [列挙属性](https://momdo.github.io/html/common-microsyntaxes.html#enumerated-attribute) である：
>
> | キーワード    | 状態               | 概要                                                                                                                                                                                                                                              |
> | ------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `hidden`      | 非表示             | レンダリングされない。                                                                                                                                                                                                                            |
> | （空文字列）  | 非表示             | レンダリングされない。                                                                                                                                                                                                                            |
> | `until-found` | Hidden Until Found | レンダリングされないが、[ページ内検索](https://momdo.github.io/html/interaction.html#find-in-page-2) および [フラグメントナビゲーション](https://momdo.github.io/html/browsing-the-web.html#navigate-fragid) で内部のコンテンツにアクセスできる。 |
>
> 引用：HTML Standard 日本語訳 https://momdo.github.io/html/interaction.html#the-hidden-attribute

Safari以外の主要ブラウザでは利用可能な仕様[^1]ですが、まだReact@19現在ではサポートが追いついておらず型エラーが発生し、Reactでは値のない論理属性として扱われてしまいます。

[^1]: Can I Use - https://caniuse.com/?search=until-found

```html:jsx
<div hidden="until-found" />
```

## 暫定的にhooksで解決する

```jsx:use-hidden-until-found.ts
import { useEffect } from 'react';

export const useHiddenUntilFound = () => {
  useEffect(() => {
    document.querySelectorAll('[data-hidden-until-found]').forEach((node) => {
      node.setAttribute('hidden', 'until-found');
      node.removeAttribute('data-hidden-until-found');
    });
  }, []);

  return {
    'data-hidden-until-found': '',
    hidden: true,
  };
};
```

`ref`で解決する方法が思い浮かびますが、Reactがサポートした時にあちこち直さないといけなくなるのも大変です。

そこでhookを作って対応して、必要無くなったら一括置換で削除することにします。

```jsx
import { useHiddenUntilFound } from '@/hooks/use-hidden-until-found';

export const Component = () => {
  const untilFound = useHiddenUntilFound();
  return <div {...untilFound}>見つかるまで隠されているコンテンツ</div>;
};
```

本件についての議論はGitHub上にIssueやPull Requestが立っています[^2][^3]が、Safariがサポートするまでは進まなさそうです。

`until-found`は、ユーザー体験とアクセシビリティの両面で優れた特性を持つ属性です。ReactやSafariでも正式にサポートされることで、より自然に活用できる日が来ることを期待しています。

[^2]: [Bug: hidden attribute does not accept string values #24740](https://github.com/facebook/react/issues/24740)

[^3]: [React DOM: Add support for hidden="until-found" #24741](https://github.com/facebook/react/pull/24741)
