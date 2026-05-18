import { Abbr } from '@/components/ui/features/Abbr';
import { Lang } from '@/types/lang';

export const unicodePlaygroundLocales = {
  ja: {
    page: {
      tipsMetric: '指標',
      tipsContent: '内容',
      utf16LengthDescription: 'UTF-16コード単位の数。サロゲートペア（U+10000以上）は2として数える。',
      utf8BytesLabel: 'UTF-8バイト数',
      utf8BytesDescription: 'UTF-8エンコード後のバイト数。ASCIIは1バイト、日本語は3バイト、多くの絵文字は4バイト。',
      codepointCountLabel: 'コードポイント数',
      codepointCountDescription: 'Unicodeコードポイントの数。スプレッド構文はサロゲートペアを1と数える。',
      graphemeCountLabel: '書記素数',
      graphemeCountDescription: '人が「1文字」と認識する単位の数。ZWJ結合絵文字や国旗絵文字も1と数える。',
      graphemeBackspaceNoteTitle: '書記素数が1なのに、バックスペース1回では消えない文字がある',
      graphemeBackspaceNoteBody: (
        <>
          <p>
            <code>Intl.Segmenter</code> の書記素クラスタは「人が1文字と認識する単位」ですが、
            <code>input</code>要素や<code>textarea</code>要素などの削除操作が常にその単位で動くとは限りません。
          </p>
          <p>
            ブラウザやOSの実装によっては、ZWJ結合絵文字や結合濁点付きの「が」のように、見た目は1文字でも複数回のバックスペースが必要になることがあります。
          </p>
        </>
      ),
    },
    content: {
      inputLabel: '解析する文字列',
      multilineLabel: '複数行',
      nfcNote:
        '現在の文字列には、見た目では分からない「分解された文字」が含まれています。IME・OS・ブラウザ・APIによっては合成済みの形（NFC）に自動変換されることがあり、入力値と実際に処理される値が異なる場合があります。',
      normalizeButton: 'NFC に正規化',
      stepTitleEmpty: '文字の組み立てステップ',
      stepTitle: (step: number, total: number, hex: string) => `文字の組み立てステップ ${step}/${total}： ${hex}`,
      codeBlockTitle: 'JavaScript で文字列を計測するサンプルコード',
    },
    codepointList: {
      editAria: (hex: string) => `${hex}を書き換える`,
      deleteAria: (hex: string) => `${hex}を削除`,
      editLabel: '書き換える',
      deleteLabel: '削除',
      cancelLabel: 'キャンセル',
      replaceMessage: '書き換える文字を入力してください',
      replaceConfirmLabel: '書き換える',
      replaceDescription: String.raw`\u200D や \u{1F525} 形式でも入力できます`,
      deleteConfirm: (hex: string) => `${hex} を削除しますか？`,
      deleteConfirmLabel: '削除',
    },
    stepViewer: {
      navLabel: 'ステップナビゲーション',
      stepAria: (index: number, hex: string) => `ステップ${index}: ${hex}`,
      readAloud: (step: number, total: number) => `${step}/${total}表示結果：`,
    },
    stringStatus: {
      utf16Length: { label: 'UTF-16 length', sub: '.lengthプロパティ' },
      utf8Bytes: { label: 'UTF-8バイト数', sub: 'TextEncoder' },
      codepointCount: { label: 'コードポイント数', sub: '[...str].length' },
      graphemeCount: { label: '書記素数', sub: 'Intl.Segmenter' },
    },
    note: {
      HT: <>水平タブ（Horizontal Tab）です。列の位置合わせやインデントに使われます。</>,
      LF: (
        <>ラインフィード（Line Feed）です。Unix / macOSの改行文字です。テキストに含まれると複数行として扱われます。</>
      ),
      CR: (
        <>
          キャリッジリターン（Carriage Return）です。Windowsの<Abbr title="Carriage Return Line Feed">CRLF</Abbr>
          改行の前半として使われます。単独では旧macOSの改行として扱われることがあります。
        </>
      ),
      DEL: (
        <>
          削除文字（Delete
          Character）です。元はパンチテープで既存の文字を上書きして無効化するために使われた制御文字で、現代の環境では画面に出力されない不可視文字として扱われます。
        </>
      ),
      NEL: (
        <>
          次行（Next Line）です。EBCDICの改行コードをUnicodeに取り込んだ制御文字で、CR /
          LFに加えて改行扱いされる処理系もあります。ファイルが他システム経由で渡るときに混入することがあります。
        </>
      ),
      FIGSP: (
        <>
          数字幅スペース（Figure
          Space）です。数字1文字分の幅をもつ非改行スペースで、表組や金額の桁揃えに使われます。ぱっと見では空白として認識されてしまい、コピー＆ペーストで気付かず混入することがあります。
        </>
      ),
      THSP: (
        <>
          細いスペース（Thin
          Space）です。通常より幅の狭いスペースで、数式や数値の桁区切りなど組版用途で使われます。本文に紛れ込んでもほぼ見分けがつきません。
        </>
      ),
      HSP: (
        <>
          ヘアスペース（Hair
          Space）です。Unicodeの空白の中でもとくに細い部類で、句読点まわりの微調整や組版で使われます。ほぼ見えないため、コピー＆ペーストで混入しても気付きにくい文字です。
        </>
      ),
      ZWJ: (
        <>
          ゼロ幅結合子（Zero Width
          Joiner）です。絵文字シーケンス内で隣接する文字を合成して1グリフとして表示するよう要求する書式制御文字で、合成が実際に行われるかはフォントやプラットフォームに依存します。
        </>
      ),
      BOM: (
        <>
          バイト順マーク（Byte Order
          Mark）です。UTF-8では先頭に付くことがある不可視文字で、内容によっては意図しない文字として残ることがあります。
        </>
      ),
      NBSP: (
        <>
          非改行スペース（Non-Breaking
          Space）です。見た目は通常のスペースと同じですが、ここで行が折り返されることはありません。コピー＆ペースト時に混入しがちです。
        </>
      ),
      ZWSP: (
        <>
          幅ゼロのスペース（Zero Width
          Space）です。表示されませんが、改行可能なポイントとしてレンダリングエンジンに認識されます。Webコンテンツに埋め込まれていることがあります。
        </>
      ),
      SHY: (
        <>
          ソフトハイフン（Soft
          Hyphen）です。通常は不可視ですが、行の折り返し時にここでハイフンを挿入してもよいことをレンダラーに伝えます。Wordからのコピー＆ペーストで混入することがあります。
        </>
      ),
      ZWNJ: (
        <>
          幅ゼロの非結合子（Zero Width
          Non-Joiner）です。アラビア文字やデーヴァナーガリー文字など、隣接する文字を結合するスクリプトで、その結合を抑制するために使われます。
        </>
      ),
      CGJ: (
        <>
          結合書記素接合子（Combining Grapheme
          Joiner）です。名前に反して書記素クラスタの境界は変更せず、表示上の影響もほぼありません。並べ替えや照合の挙動を変える用途があるほか、文字列比較やフィルタリングをすり抜けるために悪用されることがあります。
        </>
      ),
      IDSP: (
        <>
          全角スペース（Ideographic
          Space）です。日本語テキストで使われますが、ソースコードや英文に混入しても見分けがつきにくく、構文エラーや表示崩れの原因になります。
        </>
      ),
      REPL: (
        <>
          置換文字（Replacement
          Character）です。文字コード変換に失敗した不正なバイト列の代わりに挿入され、とくに孤立サロゲートをUTF-8化するときの差し替えとして頻出します。データ破損やエンコード不整合のサインとして現れることがあります。
        </>
      ),
      LSEP: (
        <>
          行区切り（Line
          Separator）です。Unicodeの改行扱いの文字で、JavaScriptはES2019以降この文字を文字列リテラル内にそのまま含められますが、それ以前のランタイムでは構文エラーになっていました。
        </>
      ),
      PSEP: (
        <>
          段落区切り（Paragraph
          Separator）です。段落の区切りを表し、U+2028と同様にES2019より前のJavaScriptでは構文エラーになっていました。
        </>
      ),
      ALM: (
        <>
          アラビア文字マーク（Arabic Letter
          Mark）です。RLMと似た不可視の双方向制御文字ですが、こちらはアラビア文字専用の方向性（AL方向）を挿入します。アラビア語テキスト中の数字や中性文字を正しく解釈させたいときに使われます。
        </>
      ),
      LRE: (
        <>
          左から右への埋め込み（Left-to-Right
          Embedding）です。ここから先を左から右の埋め込み文脈として扱う従来の双方向制御文字で、終了には通常U+202C（PDF）が使われます。新しいテキストではLRIへの置き換えが推奨されています。
        </>
      ),
      RLE: (
        <>
          右から左への埋め込み（Right-to-Left
          Embedding）です。ここから先を右から左の埋め込み文脈として扱う従来の双方向制御文字で、終了には通常U+202C（PDF）が使われます。新しいテキストではRLIへの置き換えが推奨されています。
        </>
      ),
      PDF: (
        <>
          方向書式の終了（Pop Directional Formatting）です。直前のLRE / RLE / LRO /
          RLOで始まった埋め込みや上書きを終了する不可視の双方向制御文字です。
        </>
      ),
      LRO: (
        <>
          左から右へ上書き（Left-to-Right
          Override）です。以降の文字の表示方向を左から右に強制する不可視の双方向制御文字で、RLO
          と同様に見た目と実際の並びをずらせます。
        </>
      ),
      RLO: (
        <>
          右から左へ上書き（Right-to-Left
          Override）です。以降の文字の表示方向を反転させる不可視の双方向制御文字で、ソースコードの見た目を欺くTrojan
          Source攻撃に悪用されることがあります。
        </>
      ),
      NNBSP: (
        <>
          狭い非改行スペース（Narrow No-Break
          Space）です。NBSPより幅が狭く、フランス語の句読点前や一部のロケールの数値組版で使われます。通常のスペースと見分けにくく、コピー＆ペーストで混入することがあります。
        </>
      ),
      MMSP: (
        <>
          中程度の数式スペース（Medium Mathematical
          Space）です。数式組版で使われるスペースで、通常の本文に混入すると見分けがつきにくい一方、文字数やバイト数にはしっかり含まれます。
        </>
      ),
      VS16: (
        <>
          絵文字バリエーションセレクタ（Variation
          Selector-16）です。直前の文字を絵文字として表示するよう要求する不可視文字で、❤️や#️⃣のようなシーケンスで使われます。
        </>
      ),
      VS15: (
        <>
          テキストバリエーションセレクタ（Variation
          Selector-15）です。直前の文字を絵文字ではなくテキスト形式で表示するよう要求する不可視文字です。
        </>
      ),
      LRM: (
        <>
          左から右へのマーク（Left-to-Right
          Mark）です。双方向アルゴリズムにおいて、その位置の文字方向を左から右に強制する不可視の制御文字で、右から左に流れる言語が混在するテキストで表示順を制御するために使われます。
        </>
      ),
      RLM: (
        <>
          右から左へのマーク（Right-to-Left
          Mark）です。LRMと対になる不可視の制御文字で、その位置の文字方向を右から左に強制します。右から左に流れる言語（アラビア語やヘブライ語など）を含むテキストで使われます。
        </>
      ),
      WJ: (
        <>
          ワードジョイナー（Word
          Joiner）です。隣接する文字の間で改行を抑制する不可視文字で、ZWJのような字形の合成は行いません。
        </>
      ),
      LRI: (
        <>
          左から右への分離（Left-to-Right
          Isolate）です。内部の文字列を外側の文脈から完全に切り離した独立した双方向文脈（左から右）として扱う不可視文字で、内部の方向が外側に影響しないことを保証します。
        </>
      ),
      RLI: (
        <>
          右から左への分離（Right-to-Left
          Isolate）です。内部の文字列を外側の文脈から完全に切り離した独立した双方向文脈（右から左）として扱う不可視文字で、アラビア語やヘブライ語を含む混在テキストで使われます。
        </>
      ),
      FSI: (
        <>
          最初の強い方向による分離（First Strong
          Isolate）です。続く文字列の最初の強い文字方向に基づいて左から右か右から左を自動判定する不可視の双方向制御文字です。
        </>
      ),
      PDI: (
        <>
          方向分離の終了（Pop Directional Isolate）です。直前のLRI / RLI /
          FSIで始まった独立した双方向文脈を閉じる不可視文字です。
        </>
      ),
      OBJ: (
        <>
          オブジェクト置換文字（Object Replacement
          Character）です。リッチテキスト内で埋め込みオブジェクト（画像など）のプレースホルダとして使われ、WordやPDFからのコピー＆ペーストで混入することがあります。
        </>
      ),
    },
    categoryNote: {
      'regional-indicator':
        '地域指示記号（Regional Indicator）です。2つ組み合わせて有効な国・地域コードになる場合、国旗絵文字として表示されます。ブラウザが対応していない組み合わせではそのまま文字として表示されることがあります。',
      'variation-selector': '異体字セレクタ（Variation Selector）です。直前の文字の字形バリアントを指定します。',
      'bidi-control':
        '双方向制御文字（Bidi Control）です。表示順やテキストの方向を変える不可視文字で、コードの見た目を紛らわしくする用途で悪用されることもあります。',
      control:
        '制御文字（Control Character）です。多くの場合は画面に現れませんが、テキスト処理やプロトコルに影響します。',
      'combining-mark': '結合文字（Combining Mark）です。直前の基底文字と合成して1文字として描画されます。',
      'white-space':
        '空白文字です。スペースやタブ、改行を表し、環境によっては見えにくいものの文字列の長さやバイト数には含まれます。',
      'default-ignorable':
        '既定で無視される不可視文字（Default Ignorable Code Point）です。字形選択や改行制御、フィラー用途で使われますが、多くの環境では見えません。',
      'lone-surrogate':
        '孤立サロゲート（Lone Surrogate）です。UTF-16ではU+D800-U+DBFF（上位サロゲート）とU+DC00-U+DFFF（下位サロゲート）が対になってU+10000以上の文字を表しますが、対になっていない単独のサロゲートは不正なUnicodeで、UTF-8化するとU+FFFD（置換文字）に差し替えられます。',
      astral: (
        <>
          このコードポイントは<Abbr title="Basic Multilingual Plane">BMP</Abbr>
          の外（U+10000以上）です。UTF-16では2つのコード単位（サロゲートペア）に分割され、<code>.length</code>
          は2になります。
          <br />
          サロゲートペア：
        </>
      ),
      other: (
        <>
          このコードポイントは<Abbr title="Basic Multilingual Plane">BMP</Abbr>
          内（U+0000〜U+FFFF）です。UTF-16では1つのコード単位で表現されます。
        </>
      ),
    },
  },
  en: {
    page: {
      tipsMetric: 'Metric',
      tipsContent: 'Description',
      utf16LengthDescription: 'Number of UTF-16 code units. Surrogate pairs (U+10000 and above) count as 2.',
      utf8BytesLabel: 'UTF-8 bytes',
      utf8BytesDescription:
        'Byte length after UTF-8 encoding. ASCII is 1 byte, Japanese characters are 3 bytes, and most emojis are 4 bytes.',
      codepointCountLabel: 'Code points',
      codepointCountDescription: 'Number of Unicode code points. Spread syntax counts surrogate pairs as 1.',
      graphemeCountLabel: 'Graphemes',
      graphemeCountDescription: 'Number of user-perceived characters. ZWJ sequences and flag emojis count as 1.',
      graphemeBackspaceNoteTitle: 'Some characters look like one grapheme but take more than one Backspace to delete',
      graphemeBackspaceNoteBody: (
        <>
          <p>
            Grapheme clusters reported by <code>Intl.Segmenter</code> represent what users perceive as a single
            character, but the delete operation in <code>input</code> or <code>textarea</code> elements does not always
            operate on that unit.
          </p>
          <p>
            Depending on the browser or OS implementation, ZWJ-joined emojis or decomposed characters like é (e +
            combining acute) may look like a single character yet require multiple Backspace presses to disappear.
          </p>
        </>
      ),
    },
    content: {
      inputLabel: 'String to analyze',
      multilineLabel: 'Multiline',
      nfcNote:
        'This string contains decomposed characters that look identical to their composed form. Some environments — such as browser address bars — may automatically convert it to NFC, so the value actually processed can differ from what was entered. Behavior varies by IME, OS, browser, and API.',
      normalizeButton: 'Normalize to NFC',
      stepTitleEmpty: 'Code point',
      stepTitle: (step: number, total: number, hex: string) => `Code point ${step}/${total}: ${hex}`,
      codeBlockTitle: 'Sample code for measuring strings in JavaScript',
    },
    codepointList: {
      editAria: (hex: string) => `Edit ${hex}`,
      deleteAria: (hex: string) => `Delete ${hex}`,
      editLabel: 'Edit',
      deleteLabel: 'Delete',
      cancelLabel: 'Cancel',
      replaceMessage: 'Enter a replacement character',
      replaceConfirmLabel: 'Replace',
      replaceDescription: String.raw`You can also use escape notation like \u200D or \u{1F525}`,
      deleteConfirm: (hex: string) => `Delete ${hex}?`,
      deleteConfirmLabel: 'Delete',
    },
    stepViewer: {
      navLabel: 'Step navigation',
      stepAria: (index: number, hex: string) => `Step ${index}: ${hex}`,
      readAloud: (step: number, total: number) => `Result ${step} of ${total}: `,
    },
    stringStatus: {
      utf16Length: { label: 'UTF-16 length', sub: '.length' },
      utf8Bytes: { label: 'UTF-8 bytes', sub: 'TextEncoder' },
      codepointCount: { label: 'Code points', sub: '[...str].length' },
      graphemeCount: { label: 'Graphemes', sub: 'Intl.Segmenter' },
    },
    note: {
      HT: <>Horizontal Tab. Used for column alignment and indentation.</>,
      LF: (
        <>Line Feed. The Unix/macOS newline character. When present in a string, the string is treated as multiline.</>
      ),
      CR: (
        <>
          Carriage Return. Used as the first half of the Windows <Abbr title="Carriage Return Line Feed">CRLF</Abbr>{' '}
          line ending. When used alone, some older systems may treat it as a newline.
        </>
      ),
      DEL: (
        <>
          Delete Character. Originally a control code used to overwrite and invalidate a character on punched tape. In
          modern environments it is a non-printing control character.
        </>
      ),
      NEL: (
        <>
          Next Line. A control character carried over from EBCDIC. Some text processors treat it as a line break in
          addition to CR and LF, so it can sneak in when files cross between systems.
        </>
      ),
      FIGSP: (
        <>
          Figure Space. A non-breaking space whose width equals a digit, used to align numbers in tables or currency.
          Looks like ordinary whitespace, so it can be introduced unnoticed via copy and paste.
        </>
      ),
      THSP: (
        <>
          Thin Space. A narrower-than-normal space used in typography — for example in mathematical expressions or as a
          numeric separator. Almost indistinguishable when mixed into body text.
        </>
      ),
      HSP: (
        <>
          Hair Space. One of the narrowest spaces in Unicode, used for fine-grained kerning around punctuation or in
          typography. Nearly invisible, so it can sneak in unnoticed via copy and paste.
        </>
      ),
      ZWJ: (
        <>
          Zero Width Joiner. A format character used in emoji sequences to request that adjacent characters be rendered
          as a single glyph. Whether the combination is rendered depends on the font and platform.
        </>
      ),
      BOM: (
        <>
          Byte Order Mark. An invisible character that sometimes appears at the beginning of UTF-8 files. Depending on
          the context, it can remain in the text as an unintended character.
        </>
      ),
      NBSP: (
        <>
          Non-Breaking Space. Looks identical to a regular space, but prevents line breaks at that position. Often
          introduced accidentally when copying and pasting.
        </>
      ),
      ZWSP: (
        <>
          Zero Width Space. An invisible character that marks a valid line-break opportunity without introducing visible
          space. Sometimes embedded in web content.
        </>
      ),
      SHY: (
        <>
          Soft Hyphen. Normally invisible, it marks a position where the renderer may insert a hyphen if the line needs
          to wrap. Can be introduced when copying and pasting from word processor documents.
        </>
      ),
      ZWNJ: (
        <>
          Zero Width Non-Joiner. Used in scripts such as Arabic and Devanagari to prevent adjacent characters from
          forming ligatures or joining forms.
        </>
      ),
      CGJ: (
        <>
          Combining Grapheme Joiner. Despite its name, it does not change grapheme cluster boundaries and has almost no
          visual effect. Used to influence collation and sorting behavior, and sometimes abused to bypass string
          comparison or filtering.
        </>
      ),
      IDSP: (
        <>
          Ideographic Space. A full-width space common in Japanese text. When introduced into source code or English
          text, it is hard to distinguish from a regular space and can cause syntax errors or layout glitches.
        </>
      ),
      REPL: (
        <>
          Replacement Character. Inserted in place of malformed byte sequences that failed to decode — most commonly
          when an unpaired UTF-16 surrogate is encoded to UTF-8. Often a sign of data corruption or an encoding
          mismatch.
        </>
      ),
      LSEP: (
        <>
          Line Separator. A Unicode line break. JavaScript allows it inside string literals since ES2019; earlier
          versions rejected it as a syntax error.
        </>
      ),
      PSEP: (
        <>
          Paragraph Separator. A Unicode paragraph break. Like U+2028, JavaScript runtimes before ES2019 rejected it as
          a syntax error.
        </>
      ),
      ALM: (
        <>
          Arabic Letter Mark. An invisible bidirectional control character similar to RLM, but it inserts Arabic-Letter
          (AL) directionality. Used to correctly resolve numbers and neutral characters within Arabic text.
        </>
      ),
      LRE: (
        <>
          Left-to-Right Embedding. An older bidirectional control character that starts a left-to-right embedding,
          typically closed by U+202C (PDF). Superseded by LRI for new content.
        </>
      ),
      RLE: (
        <>
          Right-to-Left Embedding. An older bidirectional control character that starts a right-to-left embedding,
          typically closed by U+202C (PDF). Superseded by RLI for new content.
        </>
      ),
      PDF: (
        <>Pop Directional Formatting. Closes the most recent embedding or override started by LRE, RLE, LRO, or RLO.</>
      ),
      LRO: (
        <>
          Left-to-Right Override. An invisible bidirectional control character that forces following text to display
          left-to-right. Like RLO, it can make stored order and displayed order diverge.
        </>
      ),
      RLO: (
        <>
          Right-to-Left Override. An invisible bidirectional control character that flips the display direction of the
          following text. Notably used in Trojan Source attacks to disguise the appearance of source code.
        </>
      ),
      NNBSP: (
        <>
          Narrow No-Break Space. Similar to NBSP but narrower. Used in French punctuation and some locale-specific
          number formatting. Easy to miss when copying and pasting.
        </>
      ),
      MMSP: (
        <>
          Medium Mathematical Space. A space used in mathematical typesetting. Hard to distinguish from a regular space
          when mixed into body text, but it still counts toward string length and byte count.
        </>
      ),
      VS16: (
        <>
          Variation Selector-16. An invisible character that requests the preceding character be rendered as an emoji
          rather than as plain text. Used in sequences like ❤️ and #️⃣.
        </>
      ),
      VS15: (
        <>
          Variation Selector-15. An invisible character that requests the preceding character be rendered as plain text
          rather than as an emoji.
        </>
      ),
      LRM: (
        <>
          Left-to-Right Mark. An invisible control character that forces left-to-right direction at its position in the
          bidirectional algorithm. Used to control display order in text containing right-to-left scripts.
        </>
      ),
      RLM: (
        <>
          Right-to-Left Mark. The counterpart of LRM. An invisible control character that forces right-to-left direction
          at its position. Used in text containing right-to-left scripts such as Arabic or Hebrew.
        </>
      ),
      WJ: (
        <>
          Word Joiner. An invisible character that prevents line breaks between adjacent characters. Unlike ZWJ, it does
          not request glyph composition.
        </>
      ),
      LRI: (
        <>
          Left-to-Right Isolate. Starts an isolated left-to-right bidirectional context, so the enclosed text does not
          influence the directionality of the surrounding text.
        </>
      ),
      RLI: (
        <>
          Right-to-Left Isolate. Starts an isolated right-to-left bidirectional context, so the enclosed text does not
          influence the surrounding directionality. Common in mixed-script text containing Arabic or Hebrew.
        </>
      ),
      FSI: (
        <>
          First Strong Isolate. Starts an isolated bidirectional context whose direction is chosen from the first
          strongly directional character that follows.
        </>
      ),
      PDI: <>Pop Directional Isolate. Closes the most recent isolate started by LRI, RLI, or FSI.</>,
      OBJ: (
        <>
          Object Replacement Character. A placeholder for embedded objects (such as images) inside rich text. May be
          introduced when copying and pasting from word processor documents or PDFs.
        </>
      ),
    },
    categoryNote: {
      'regional-indicator':
        'Regional Indicator. When two of these form a valid region code, they may be rendered as a flag emoji. Unsupported or invalid combinations may display as plain characters.',
      'variation-selector': 'Variation Selector. Specifies a glyph variant of the preceding character.',
      'bidi-control':
        'Bidirectional Control character. An invisible character that changes text direction or display order. It can be exploited to make source code appear misleading.',
      control: 'Control Character. Usually invisible on screen, but may affect text processing or protocols.',
      'combining-mark': 'Combining Mark. Renders together with the preceding base character as a single glyph.',
      'white-space':
        'White Space character. Represents a space, tab, or line break. It may be invisible, but still counts toward string length and byte count.',
      'default-ignorable':
        'Default Ignorable Code Point. An invisible character used for glyph selection, line-break control, or as a filler. Not visible in most environments.',
      'lone-surrogate':
        'Lone Surrogate. In UTF-16, a high surrogate (U+D800-U+DBFF) must be followed by a low surrogate (U+DC00-U+DFFF) to encode code points U+10000 and above. An unpaired surrogate is invalid Unicode and is replaced with U+FFFD (Replacement Character) when encoded to UTF-8.',
      astral: (
        <>
          This code point is outside the <Abbr title="Basic Multilingual Plane">BMP</Abbr> (U+10000 and above). In
          UTF-16, it is split into two code units (a surrogate pair), giving a <code>.length</code> of 2.
          <br />
          Surrogate pair:{' '}
        </>
      ),
      other: (
        <>
          This code point is within the <Abbr title="Basic Multilingual Plane">BMP</Abbr> (U+0000-U+FFFF). In UTF-16, it
          is represented as a single code unit.
        </>
      ),
    },
  },
} satisfies Record<Lang, unknown>;
