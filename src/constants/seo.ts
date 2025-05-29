import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/meta';

export const SEO: Record<string, { title: string; description: string }> = {
  '/': {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  '/documents': {
    title: '資料集',
    description: 'ドキュメント系をまとめた階層です。',
  },
  '/documents/notes': {
    title: 'UI Notes',
    description: 'Web上に登場するUIに関するメモ書き。',
  },
  '/documents/notes/ui-discount-price': {
    title: '【HTML】割引などの金額変更で打ち消し線を表現するためのマークアップ',
    description: '',
  },
  '/documents/translations': {
    title: '日本語訳まとめ',
    description: '仕様書など、外部資料を日本語訳したものをまとめた階層です。',
  },
  '/documents/translations/w3c/wai/tutorials/images': {
    title: '日本語訳：Images Tutorial',
    description: 'WAI(W3C)による代替テキストに関するチュートリアルの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos': {
    title: "日本語訳：PaulJAdam's Modern Web Accessibility Demos",
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/a11y-gone-wrong': {
    title: 'アクセシブル施策の失敗例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/abbr': {
    title: '略語の展開を表すためのtitle属性を持つabbr要素',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/accesskey': {
    title: 'アクセスキーのアクセシビリティDEMO',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/accessiblenameimg': {
    title: 'img要素のアクセシブルネームの計算',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile-accordion-bad': {
    title: 'アコーディオンのアクセシビリティ失敗例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile-accordion-aria': {
    title: 'aria-*属性を利用したアコーディオンの実装例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/accordion-heading': {
    title: '見出しがアコーディオンのフックの例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/accounting-tables': {
    title: '会計テーブル',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/alerttimer': {
    title: 'WAI-ARIAのrole="alert"とsetTimeout',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/altbgimg': {
    title: '背景画像や複雑な画像の代替テキスト',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/annotated-tables': {
    title: '注釈付きテーブル',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/apple-system-css-font': {
    title: '-apple-system-関連のfont-family値',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-alert-assertive-validation': {
    title: 'WAI-ARIAのみを使用した簡易的なフォーム検証（role=alert、aria-live=assertive）',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-alert-validation': {
    title: 'ARIA Live Regionsまたはrole="alert"を使用してエラーを特定する',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-atomic-relevant': {
    title: 'aria-liveリージョン内のaria-atomicとaria-relevant',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-describedby-labelledby-link-purpose': {
    title: '機械的に関連づけるためのaria-Labelledby属性 VS aria-describedby属性',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-describedby-validation': {
    title:
      "WAI-ARIAのaria-describedby属性、aria-required属性、aria-invalid属性、jQueryのfocus()メソッドを使用したシンプルなフォームバリデータ- PaulJAdam's Modern Web Accessibility Demos",
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-expanded': {
    title: 'aria-expanded属性の状態をスクリーンリーダに伝える',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['aria-haspopup', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-hidden': {
    title: 'aria-hidden',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-invalid': {
    title: 'aria-invalid="true"の実装例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-labelledby': {
    title: 'aria-labelledby属性のアクセシビリティデモ',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-live-slider': {
    title: 'alertロールを利用したライブスライダー',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-menubar': {
    title: 'メニューバーの実装例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-pressed': {
    title: 'VoiceOverのバグ：aria-pressed属性で要素が無視される',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['aria-role-alertdialog-setTimeout', false],
  // ['aria-role-alertdialog', false],
  // ['aria-role-tooltip', false],
  // ['aria-roledescription', false],
  // ['aria-table', false],
  // ['aria-tabpanel', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/ariacountdown': {
    title: 'ARIAを使ったカウントダウンタイマー',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['audio-slider', false],
  // ['autofocusvstabindex', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/autoplay-loop-muted-controls': {
    title: 'video要素の autoplay, loop, muted, controls 属性をテスト',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/badav': {
    title: 'オーディオ/ビデオの自動再生とループを使った悪い例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/bootstrap-dropdown': {
    title: 'Bootstrapのドロップダウン',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['button', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/buttons': {
    title: 'スタイリングされたボタンの例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['canvas', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/checkbox': {
    title: 'アクセシブル施策の失敗例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['bootcamp-contact-before', false],
  // ['bootcamp-contact-after-aria', false],
  // ['bootcamp-contact-after-html5', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/css-content-new-window': {
    title:
      '新しいウィンドウへのリンクであることを伝えるための、BootstrapのCSSとFont Awesome Icons、JavaScriptによるtitle属性付与n Web Accessibility Demos',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['css-line-through-del-ins-accessibility', false],
  // ['css3speech', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/css4altgeneratedcontent': {
    title: 'CSSによって出力されたコンテンツのためのCSS4 Alt text',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['csstext', false],
  // ['customcontrols', false],
  // ['dates', false],
  // ['data-tables', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/detail-message-dialog': {
    title: 'WAI-ARIAのrole="alertdialog"属性を使った詳細メッセージダイアログ',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['details-summary', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/dialog': {
    title: 'アクセシブルなモーダルダイアログ',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['dialog-DOM', false],
  // ['draggable', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/empty-headings': {
    title: 'VoiceOverでは読み上げられるがJAWSおよびNVDAでは読み上げられない空のヘディングコンテンツ',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/fake-button': {
    title: 'フェイクボタンのアクセシビリティテスト',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['focus-after-page-load', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/figure-figcaption': {
    title: 'HTML5のfigure要素とfigcaption要素',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['csunmobile-form-bad', false],
  // ['csunmobile-form-aria', false],
  // ['csunmobile-form-html5', false],
  // ['form-errors-top', false],
  // ['fieldsetlegend', false],
  // ['focusvisible', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/goodav': {
    title: '自動再生またはループのないオーディオ/ビデオの良い例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['hamburger-menu', false],
  // ['headings', false],
  // ['highlights', false],
  // ['html5-input-types', false],
  // ['html5-placeholder-contrast', false],
  // ['html5-structural', false],
  // ['html5-video-a11y', false],
  // ['iframe', false],
  // ['iframe-voiceover-scrolling-bug', false],
  // ['imageAndTextLink', false],
  // ['img', false],
  // ['inpagelinks', false],
  // ['inputSubmitTitle', false],
  // ['ios8bugs', false],
  // ['iosvocheatsheet', false],
  // ['jaws-ie-tabindex-bug', false],
  // ['jsalertconfirmprompt', false],
  // ['jqueryui-autocomplete', false],
  // ['landmarks', false],
  // ['layout-table-role-presentation', false],
  // ['linkpurpose', false],
  // ['loading-indicator', false],
  // ['mathml', false],
  // ['missingfieldsetlegend', false],
  // ['mobilechecklist', false],
  // ['mobileforma11y', false],
  // ['multithumb-slider', false],
  // ['numericRanges', false],
  // ['obstacle-course', false],
  // ['parsing', false],
  // ['positionbug', false],
  // ['positivetabindexfail', false],
  // ['progressbar', false],
  // ['quad', false],
  // ['repeating-buttons-accessibilty', false],
  // ['remove-filter-buttons', false],
  // ['rolegroup', false],
  // ['role-alert', false],
  // ['rwd-aria-menu-button', false],
  // ['rwd-aria-menubar', false],
  // ['rwd-tabs-accordion', false],
  // ['rwdstate', false],
  // ['section', false],
  // ['select', false],
  // ['select-android', false],
  // ['select-option', false],
  // ['semanticelements', false],
  // ['semanticmobile', false],
  // ['session-timeout-alertdialog', false],
  // ['spa-focus', false],
  // ['svg', false],
  // ['svg-bar-chart', false],
  // ['svg-line-chart', false],
  // ['tableA11yTest', false],
  // ['talkbackcheatsheet', false],
  // ['timeout', false],
  // ['title-aria-label', false],
  // ['title-keyboard', false],
  // ['tooltip', false],
  // ['underlines', false],
  // ['voiceover-clickable', false],
  // ['voiceover-ios-html-aria-support', false],
  // ['voiosmultifocusbug', false],
  // ['web-speech-api', false],
  // ['youtubeHTML5embed', false],
  '/documents/media': {
    title: '外部メディアリンク一覧',
    description: '執筆・関与したブログ記事や動画コンテンツ、寄稿などへのリンクをまとめています。',
  },
  '/documents/fantasized-specs': {
    title: 'Fantasized specs',
    description: '日々業務の中で思いついた「あんなこといいなできたらいいな」集。',
  },
  '/documents/fantasized-specs/html-carousel': {
    title: 'The carousel element - Fantasized specs',
    description: '',
  },
  '/documents/fantasized-specs/css-observer': {
    title: 'CSS Observer Module level 1 - Fantasized specs',
    description: '',
  },
  '/tools': {
    title: 'ツール集',
    description: '作ったものをまとめている階層です。',
  },
  '/tools/an-alt-decision-tree': {
    title: 'An alt Decision Treeに基づく代替テキスト２択チャート',
    description:
      'An alt Decision Treeを参考に作られた、画像の代替テキストと呼ばれるalt属性値を決める手助けをする２択チャートです。',
  },
  '/tools/character-count': {
    title: '文字数カウント',
    description:
      '文章の文字数をカウントするツールです。\n本文に文字数をチェックしたいテキストを入力してください。原稿用紙換算、段落数も確認できます。',
  },
  '/tools/accessible-name-and-description-computation': {
    title: 'Accessible Name and Description Computation Playground',
    description: 'アクセシブルな名前および説明がどう計算されるかをテストするためのページです。',
  },
  '/tools/css-units': {
    title: 'CSS Units Playground',
    description: 'それぞれのCSSの単位が、実際にはどのようなCSSピクセルになるのかを確認できるページです。',
  },
  '/tools/dom-events-watcher': {
    title: 'DOM Event Playground',
    description: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
  },
  '/tools/slack-reminder-command-generator': {
    title: 'Slack reminder command generator - Slackのリマインダーコマンド作成ツール',
    description:
      'Slackのリマインダーコマンドを生成するためのツールです。\nリマインダーの内容・時間・繰り返しの設定を行うためのコマンドを生成できます。',
  },
  '/tools/touch-event-touches': {
    title: 'TouchEvent.touches Playground',
    description:
      'タッチ操作のテストができます。デバイスのタッチ操作が利用可能か、何本の指でタッチできるのかを確認しましょう。',
  },
};
