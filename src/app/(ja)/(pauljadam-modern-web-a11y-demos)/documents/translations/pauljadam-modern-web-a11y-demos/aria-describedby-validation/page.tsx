import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-describedby-validation/DocumentScript';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-describedby-validation/page.css';



import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title:
    "WAI-ARIAのaria-describedby属性、aria-required属性、aria-invalid属性、jQueryのfocus()メソッドを使用したシンプルなフォームバリデータ - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
});

export default function Page() {
  return (
    <>
      <h1>
        WAI-ARIAのaria-describedby属性、aria-required属性、aria-invalid属性、
        <a href="http://api.jquery.com/focus/">jQueryのfocus()</a>を使用したシンプルなフォームバリデータ
      </h1>

      <DocumentScript />

      <form name="signup" id="signup" method="post" action="">
        <p>
          <label htmlFor="last">姓 *</label>
          <br />
          <input type="text" name="last" id="last" aria-required="true" />
        </p>
        <p>
          <label htmlFor="first">名 *</label>
          <br />
          <input type="text" name="first" id="first" aria-required="true" />
        </p>
        <p>
          <label htmlFor="password">パスワード *</label>
          <br />
          <input
            type="text"
            name="password"
            id="password"
            aria-describedby="password-format password-error"
            aria-required="true"
          />{' '}
          <small id="password-format">8桁、1つの大文字、1つの数字、1つの記号を含めてください</small>
        </p>
        <p>
          <label htmlFor="email">メールアドレス *</label>
          <br />
          <input type="text" name="email" id="email" aria-required="true" />
        </p>
        <p>
          <input type="submit" name="button" id="button" value="Submit" />
        </p>
      </form>
    </>
  );
}
