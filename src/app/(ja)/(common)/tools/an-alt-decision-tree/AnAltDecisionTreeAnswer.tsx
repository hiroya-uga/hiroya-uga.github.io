import { AnAltDecisionTreeHeading as Heading } from '@/app/(ja)/(common)/tools/an-alt-decision-tree/AnAltDecisionTreeHeading';
import { Details } from '@/components/Box';
import { useId } from 'react';

const Accordion = ({ list }: { list: [string, React.ReactNode][] }) => {
  const id = useId();

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {list.map(([title, content]) => {
        return (
          <Details name="if" key={title} summary={title} id={id}>
            <div className="border-t border-t-gray-100 px-4 py-6 text-sm sm:pb-16 sm:text-base">{content}</div>
          </Details>
        );
      })}
    </div>
  );
};

export const AnAltDecisionTreeAnswer = ({ index }: { index: number }) => {
  const Decorative = () => {
    return (
      <>
        <p className="mb-2">
          <code>alt</code>属性に空の値を指定します。
        </p>
        <p>
          詳しくは
          <a href="https://www.w3.org/WAI/tutorials/images/decorative/" hrefLang="en">
            「装飾目的の画像」（外部サイト）
          </a>
          を参照してください
        </p>
      </>
    );
  };
  const Functional = () => {
    return (
      <>
        <p className="mb-2">
          リンクや実行されたアクションの目的を伝えるために、<code>alt</code>属性を使用します。
        </p>

        <p>
          詳しくは
          <a href="https://www.w3.org/WAI/tutorials/images/functional/" hrefLang="en">
            「機能を持つ画像」（外部サイト）
          </a>
          を参照してください。
        </p>
      </>
    );
  };
  const Textual = () => {
    return (
      <>
        <p className="mb-2">
          <code>alt</code>属性に画像に書かれているテキストを含めます。
        </p>

        <p>
          詳しくは
          <a href="https://www.w3.org/WAI/tutorials/images/textual/#styled-text-decorative-effect" hrefLang="en">
            「文字画像」（外部サイト）
          </a>
          を参照してください。
        </p>
      </>
    );
  };
  const Informative = () => {
    return (
      <>
        <p className="mb-2">
          意味が伝わるように<code>alt</code>属性に値を設定します。
        </p>

        <p>
          詳しくは
          <a href="https://www.w3.org/WAI/tutorials/images/informative" hrefLang="en">
            「意味のある画像」（外部サイト）
          </a>
          を参照してください。
        </p>
      </>
    );
  };
  const Complex = () => {
    return (
      <>
        <p className="mb-2">「画像に含まれている情報」をWebページ内の別の箇所にも含めます。</p>

        <p>
          詳しくは
          <a href="https://www.w3.org/WAI/tutorials/images/complex" hrefLang="en">
            「複雑な画像」（外部サイト）
          </a>
          を参照してください。
        </p>
      </>
    );
  };

  switch (index) {
    case 0:
      return (
        <>
          <Heading>文字が含まれている画像</Heading>
          <Accordion
            list={[
              [
                '側に同じ内容のテキストが書かれている場合',
                <>
                  <Decorative />
                </>,
              ],
              [
                '雰囲気づくりや、見た目のためにだけ置かれている場合',
                <>
                  <Decorative />
                </>,
              ],
              [
                'アイコンなど、特定の機能を説明する役割がある場合',
                <>
                  <Functional />
                </>,
              ],
              [
                '画像内のテキストが画像の中以外に存在しない場合',
                <>
                  <Textual />
                </>,
              ],
            ]}
          />
        </>
      );

    case 1: {
      return (
        <>
          <Heading>クリックできる画像</Heading>

          <Functional />
          {/*
          <p className="mb-6">
            <code>alt</code>属性に画像の役割を記述してください。
          </p>

          <div className="rounded-lg overflow-hidden mb-4">
            <Code
              code={`<a href="___dummy___">
  <img alt="ホーム">
</a>`}
            />
          </div>

          <div className="rounded-lg overflow-hidden">
            <Code
              code={`<button>
  <img alt="メニューを開く">
</button>`}
            />
          </div>

          <p className="mt-6">
            属性を使用して<code>alt</code> 、リンクの宛先または実行されたアクションを伝えます。
          </p>
          <p>
            詳しくは
            <a href="https://www.w3.org/WAI/tutorials/images/functional/" hrefLang="en">
              「機能を持つ画像」（外部サイト）
            </a>
            を参照してください。
          </p> */}
        </>
      );
    }

    case 2: {
      return (
        <>
          <Heading>意味のある画像</Heading>

          <Accordion
            list={[
              [
                '単純なグラフィックまたは写真の場合',
                <>
                  <Informative />
                </>,
              ],
              [
                'グラフまたは複雑な情報の場合',
                <>
                  <Complex />
                </>,
              ],
              [
                '側に同じ内容のテキストが書かれている場合',
                <>
                  <p className="mb-2">
                    <code>alt</code>属性に空の値を指定してください。
                  </p>

                  <p>
                    詳しくは
                    <a
                      href="https://www.w3.org/WAI/tutorials/images/functional/#logo-image-within-link-text"
                      hrefLang="en"
                    >
                      「機能を持つ画像(redundant)」（外部サイト）
                    </a>
                    を参照してください。
                  </p>
                </>,
              ],
            ]}
          />

          {/* <div className="mb-14 sm:mb-40">
            <h3 className="p-2 px-3 text-lg font-bold rounded mb-6 bg-slate-200">単純なグラフィックまたは写真の場合</h3>

            <div className="py-2 px-3">
              <SampleCodeWrapper code={`<img alt="海老のお寿司">`}>
                <SampleInfomativeImage />
              </SampleCodeWrapper>

              <p>
                意味が伝わるように<code>alt</code>属性に値を設定します。
              </p>
              <p>
                詳しくは「
                <a href="https://www.w3.org/WAI/tutorials/images/informative/" hrefLang="en">
                  意味のある画像（外部サイト）
                </a>
                」を 参照してください。
              </p>
            </div>
          </div>

          <div className="mb-14 sm:mb-40">
            <h3 className="p-2 px-3 text-lg font-bold rounded mb-6 bg-slate-200">グラフまたは複雑な情報の場合</h3>

            <div className="py-2 px-3">
              <SampleCodeWrapper
                code={`<img alt="棒グラフ：１週間あたりの海老の消費量（架空のデータ） 日曜日80 月曜日20 火曜日30 水曜日60 木曜日20 金曜日100 土曜日90">`}
              >
                <figure>
                  <figcaption className="mb-4 text-center">
                    <p>来場者数と昨年対比の２軸グラフ</p>
                    <p className="text-xs">棒グラフ左Y軸（単位：人）、折れ線グラフ右側Y軸（単位：%）</p>
                  </figcaption>

                  <Image
                    src="/tools/an-alt-decision-tree/graph.png"
                    width={300}
                    height={300}
                    alt="棒グラフ：１週間あたりの海老の消費量（架空のデータ） 日曜日80 月曜日20 火曜日30 水曜日60 木曜日20 金曜日100 土曜日90"
                    className="mx-auto"
                  />
                </figure>
              </SampleCodeWrapper>

              <p>画像に含まれる情報をページ上の他の場所に含めます。 </p>
              <p>
                詳しくは「
                <a href="https://www.w3.org/WAI/tutorials/images/complex/" hrefLang="en">
                  複雑な画像（外部サイト）
                </a>
                」を 参照してください。
              </p>
            </div>
          </div>

          <div className="mb-14 sm:mb-40">
            <h3 className="p-2 px-3 text-lg font-bold rounded mb-6 bg-slate-200">
              側に同じ内容のテキストが書かれている場合
            </h3>

            <div className="py-2 px-3 mb-6">
              <p>
                空の<code>alt</code>属性を使用します。
              </p>
              <p>ただし、条件によって空にするべきかどうかが変化します。</p>
            </div>

            <SampleDuplicateText />

            <div className="py-2 px-3">
              <p>
                詳しくは「
                <a href="https://www.w3.org/WAI/tutorials/images/functional/#logo-image-within-link-text" hrefLang="en">
                  （冗長な）機能を持つ画像（外部サイト）
                </a>
                」 を参照してください。
              </p>
            </div>
          </div> */}
        </>
      );
    }

    case 3: {
      return (
        <>
          <Heading>装飾目的の画像</Heading>

          <Decorative />
          {/* <SummaryEmptyAltForPresentaion /> */}
        </>
      );
    }
  }
};
