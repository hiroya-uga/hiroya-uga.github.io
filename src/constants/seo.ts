import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/meta';
import { Metadata } from 'next';

export const SEO: Record<
  string,
  {
    title: string;
    description: string;
    beforeSubTitle?: string;
    afterSubTitle?: string;
    languages?: Record<string, string>;
    locale?: 'ja_JP' | 'en_US';
  } & Pick<Metadata, 'robots'>
> = {
  '/': {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  '/about': {
    title: `${SITE_NAME}とは？`,
    description: '当サイトについて説明しているページです。',
  },
  '/articles': {
    title: '記事一覧',
    description: '技術メモや日記などをまとめています。',
  },
  '/disclaimer': {
    title: '免責事項',
    description: `このページでは${SITE_NAME}（以下「当サイト」）における免責事項についてご説明します。\n本免責事項は、必要に応じて改訂される場合があります。`,
  },
  '/contact': {
    title: 'お問い合わせ',
    description: `${SITE_NAME}に関するお問い合わせはこちらから。`,
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
    beforeSubTitle: '日本語訳：',
    title: 'Images Tutorial',
    description: 'WAI(W3C)による代替テキストに関するチュートリアルの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos': {
    beforeSubTitle: '日本語訳：',
    title: "PaulJAdam's Modern Web Accessibility Demos",
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
  '/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile': {
    beforeSubTitle: '日本語訳：',
    title: 'モバイルアクセシビリティテスト＆開発ワークショップ',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile/accordion-bad': {
    beforeSubTitle: '日本語訳：',
    title: 'アコーディオンのアクセシビリティ失敗例',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  '/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile/accordion-aria': {
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
    title: 'WAI-ARIAを利用したものと純粋なチェックボックスの比較',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
  // ['bootcamp-contact-before', false],
  // ['bootcamp-contact-after-aria', false],
  // ['bootcamp-contact-after-html5', false],
  '/documents/translations/pauljadam-modern-web-a11y-demos/css-content-new-window': {
    title:
      '新しいウィンドウを開くリンクのための、BootstrapのCSS ContentとFont Awesome Icons、JavaScriptによるtitle属性の付与',
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
  '/games': {
    title: 'ゲーム置き場',
    description: `ちょっとしたゲームが置かれています。暇つぶしにどうぞ🥁`,
  },
  '/games/simple-block-breaker': {
    title: 'ただのブロック崩し。',
    afterSubTitle: 'Simple Block Breaker',
    description: `本当になんの変哲もない、ただのブロック崩しです。\n設定で難易度を自由に変更できます。`,
  },
  '/games/sudoku': {
    title: '無限数独（ナンプレ）',
    afterSubTitle: 'Infinity Sudoku',
    description: `ランダムに生成された数独がひたすら解けます。\n数独とは、9行9列、9つの3×3のブロックいずれも、1から9までの数字が1つずつ入るように数字を入れていくパズルです。`,
  },
  '/privacy-policy': {
    title: 'プライバシーポリシー',
    description: `このページでは${SITE_NAME}（以下「当サイト」）における個人情報の取り扱いについてご説明します。\n本プライバシーポリシーは、必要に応じて改訂される場合があります。`,
  },
  '/tools': {
    title: 'ツール集',
    description: '作ったものをまとめている階層です。',
  },
  '/tools/accessible-name-and-description-computation': {
    title: 'Accessible Name and Description Computation Playground',
    description: 'アクセシブルな名前および説明がどう計算されるかをテストするためのページです。',
  },
  '/tools/an-alt-decision-tree': {
    beforeSubTitle: 'An alt Decision Treeに基づく',
    title: '代替テキスト２択チャート',
    description:
      'An alt Decision Treeを参考に作られた、画像の代替テキストと呼ばれるalt属性値を決める手助けをする２択チャートです。',
  },
  '/tools/character-count': {
    title: '文字数カウント',
    description: '文章の文字数をカウントするツールです。原稿用紙換算、段落数も確認できます。',
  },
  '/tools/css-units': {
    title: 'CSS Units Playground',
    description: 'それぞれのCSSの単位が、実際にはどのようなCSSピクセルになるのかを確認できるページです。',
  },
  '/tools/dom-events-watcher': {
    title: 'DOM Event Playground',
    description: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
  },
  '/tools/get-url-from-dom': {
    title: 'WebページからURLを抽出できるツール',
    description:
      'リンク先一覧の調査や、画像のURL一覧を作ったりするタスクがある人のためのツールです。\nURLを抽出したいページの内容（DOM）をコピー＆ペーストしてください。\nSlackやエクセルなどのアプリケーションの内容からも抽出できます。',
  },
  '/tools/kaprekar-number': {
    title: 'Kaprekar Number Playground',
    afterSubTitle: 'カプレカ数（カプレカルーチン）に至るまでの計算テスト',
    description:
      'カプレカ数のテストができます。\nある整数を大きい順と小さい順に並べ替えてから、大きい数から小さい数を引いたとき、その結果が元の整数と同じになる値をカプレカ数といいます。入力した数字が特定の値を繰り返すようになる様子を確認してみましょう。',
  },
  '/tools/keyboard-event': {
    title: 'KeyboardEvent Playground',
    description: 'キーボード操作のテストができます。キーボードのキー名やキーコード、修飾キーの状態を確認しましょう。',
  },
  '/tools/render-text-in-react': {
    title: 'Render Text in React Playground',
    description:
      'Reactでテキストを出力する際の書き方の違いが、どのような読み上げの違いが生じさせるか確認してみましょう。',
  },
  '/tools/slack-reminder-command-generator': {
    title: 'Slack reminder command generator',
    afterSubTitle: 'Slackのリマインダーコマンド作成ツール',
    description:
      'Slackのリマインダーコマンドを生成するためのツールです。\nリマインダーの内容・時間・繰り返しの設定を行うためのコマンドを生成できます。',
  },
  '/tools/nu-bookmarklet-generator': {
    title: 'Nu Html Checker Bookmarklet Generator',
    afterSubTitle: 'HTMLの品質をチェックするブックマークレット作成ツール',
    description:
      'Nu Html CheckerへHTMLを送信するブックマークレットが作れるジェネレーターです。\nローカル環境やイントラでホスティングされているNu Html Checkerにも対応しています。',
    languages: { ja: '/tools/nu-bookmarklet-generator', en: '/tools/nu-bookmarklet-generator/en' },
  },
  '/tools/nu-bookmarklet-generator/en': {
    title: 'Nu Html Checker Bookmarklet Generator',
    afterSubTitle: 'Create bookmarklets to check HTML quality',
    description:
      'A generator for creating bookmarklets that send HTML to Nu Html Checker.\nWorks with locally hosted and intranet-hosted Nu Html Checker instances.',
    languages: { ja: '/tools/nu-bookmarklet-generator', en: '/tools/nu-bookmarklet-generator/en' },
    locale: 'en_US',
  },
  '/tools/nu-installer': {
    title: 'Nu Html Checker Installer',
    description: 'Nu Html Checkerをローカルで簡単に使うためのmacOS向けインストーラスクリプトです。',
    languages: { ja: '/tools/nu-installer', en: '/tools/nu-installer/en' },
  },
  '/tools/nu-installer/en': {
    title: 'Nu Html Checker Installer',
    description: 'A macOS installer script for running Nu Html Checker locally with ease.',
    languages: { ja: '/tools/nu-installer', en: '/tools/nu-installer/en' },
    locale: 'en_US',
  },
  '/tools/markup-dev-supporter': {
    title: 'HTMLでtable実装するときとかに役立つツール',
    description:
      'オフィスツールなどで作成された表をHTMLとして実装する人のための支援ツールです。\n業務上公開前の情報を外部に送信できないケースにおいて、指示書にある表を整形されたHTMLにフォーマットして実装しやすくすることを主な用途に想定しています。',
  },
  '/tools/screen-wake-lock': {
    title: 'スリープモードを防止するツール',
    description:
      '開いておくだけで画面のスリープ（自動消灯）を防止できるツールです。\n大容量ファイルのアップロードやダウンロード中など、しばらく画面をスリープさせたくない場合に活用できます。',
  },
  '/tools/sort-visualizer': {
    title: 'Sort Playground',
    afterSubTitle: 'ソートアルゴリズムの動作を可視化するためのツール（Sort Visualizer）',
    description: 'さまざまなソート手法を試して、どのようにデータが並べ替えられるかを観察しましょう。',
  },
  '/tools/touch-event-touches': {
    title: 'TouchEvent.touches Playground',
    description: 'デバイスのタッチ操作が利用可能か、何本の指でタッチできるのかをテストできます。',
  },
};
