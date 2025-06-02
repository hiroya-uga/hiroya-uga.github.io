'use client';

import { useEffect, useState } from 'react';

import { SITE_NAME } from '@/constants/meta';

export const Comment = () => {
  const [wrote, setWrote] = useState(false);

  useEffect(() => {
    setWrote(true);
  }, [wrote]);

  if (wrote) {
    return null;
  }

  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<!--

やあ （´・ω・｀)

ようこそ、${SITE_NAME}へ。

このテキーラはサービスだから、まず飲んで落ち着いて欲しい。

うん、「また」なんだ。済まない。

仏の顔もって言うしね、謝って許してもらおうとも思っていない。

でも、この隠しコメントを見たとき、君は、きっと言葉では言い表せない「ときめき」みたいなものを感じてくれたと思う。

殺伐とした世の中で、そういう気持ちを忘れないで欲しい

そう思って、このサイトにはこういう遊び心を散りばめてるんだ。

こういう遊びをアクセシブルにするのは難しい。

だけど、ソースコードを覗くくらいHTMLをよく知る君が、このコメントに気づいてくれたことに感謝するよ。

じゃあ、注文を聞こうか。

-->`,
      }}
    />
  );
};
