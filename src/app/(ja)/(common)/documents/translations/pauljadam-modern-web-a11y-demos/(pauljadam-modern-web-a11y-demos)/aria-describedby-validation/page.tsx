import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-describedby-validation/DocumentScript';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-describedby-validation/page.module.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata(
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-describedby-validation',
);

export default function Page() {
  return (
    <div className={styles.page}>
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
    </div>
  );
}
