import { Details } from '@/components/Box';
import { CodeBlock } from '@/components/CodeBlock';

import { HTMLAttributes, useEffect, useId, useRef } from 'react';
import React from 'react';

import Image from 'next/image';

// const Code = ({ code }: { code: string }) => {
//   return (
//     <pre className="hljs overflow-auto p-2 sm:p-4">
//       <CodeBlock code={code} />
//     </pre>
//   );
// };

const Heading = ({ children, index }: Pick<HTMLAttributes<HTMLHeadingElement>, 'children'> & { index?: number }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (index !== 0) {
      ref.current?.focus();
    }
  }, [index]);

  const HeadingInner = () => {
    if (typeof index === 'number') {
      return (
        <h2
          className="mx-auto mb-5 mt-0 flex w-fit items-center justify-center bg-[url(/tools/an-alt-decision-tree/e0880_1.svg)] bg-cover bg-no-repeat pb-16 pl-8 pr-6 pt-9 text-lg sm:w-full sm:max-w-[80%] sm:text-center sm:text-2xl"
          ref={ref}
          tabIndex={-1}
        >
          <span className="mr-3 grid aspect-square h-10 place-items-center rounded-md bg-gray-200 p-1 leading-none sm:mr-4 sm:h-12">
            Q{index + 1}
          </span>
          <strong className="font-normal">{children}</strong>
        </h2>
      );
    }

    return (
      <h2 className="mb-9 mt-0 text-center text-xl sm:text-2xl" ref={ref} tabIndex={-1}>
        {children}
      </h2>
    );
  };

  return (
    <div aria-live="assertive">
      <HeadingInner />
    </div>
  );
};

// const SampleCodeWrapper = ({
//   title = 'サンプルコード',
//   code,
//   children,
// }: {
//   title?: string;
//   code: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <div className="mb-6 rounded-lg overflow-hidden">
//       <figure className="border border-[#0d1117] border-b-0 mx-auto">
//         <figcaption className="text-sm bg-[#0d1117] text-white p-2">{title}</figcaption>

//         <div className="px-4 py-6 sm:px-8 sm:py-16">{children}</div>
//       </figure>

//       <Code code={code} />
//     </div>
//   );
// };

// const SamplePresentation = ({ isVisible }: { isVisible?: boolean }) => {
//   return (
//     <div className="flex text-left flex-wrap sm:flex-nowrap gap-4">
//       <div className="sm:max-w-[150px]">
//         <div className={clsx([isVisible === false ? 'border-gray-300' : 'border-transparent', 'border inline-block'])}>
//           <Image
//             src="/tools/an-alt-decision-tree/sushi.jpg"
//             width={120}
//             height={93}
//             alt=""
//             className={clsx([isVisible === false ? 'invisible' : '', 'w-full'])}
//           />
//         </div>
//       </div>
//       <p className="grow-1">
//         <span className="inline-block">新鮮な海の幸と職人の技、</span>
//         <span className="inline-block">心を込めた極上の寿司。</span>
//         <span className="inline-block">和モダンな空間で至福のひとときをお楽しみください。</span>
//       </p>
//     </div>
//   );
// };

// const SampleInfomativeImage = ({ isVisible }: { isVisible?: boolean }) => {
//   return (
//     <div className="flex items-center justify-center mb-8">
//       <p className={clsx([isVisible === false ? 'border-gray-300' : 'border-transparent', 'border inline-block'])}>
//         <Image
//           src="/tools/an-alt-decision-tree/shrimp.png"
//           width={100}
//           height={80}
//           alt="海老のお寿司"
//           className={isVisible === false ? 'invisible' : ''}
//         />
//       </p>
//       <div className="ml-4 text-left">
//         <p>私の好きなお寿司です！</p>
//         <p>みなさんはこの寿司ネタお好きですか？</p>
//         {typeof isVisible === 'boolean' && <p className={isVisible ? 'invisible' : 'font-bold'}>（どの寿司ネタ？）</p>}
//       </div>
//     </div>
//   );
// };

// const SampleDuplicateText = () => {
//   return (
//     <>
//       <SampleCodeWrapper
//         title="機能を持つ画像：alt属性を空にできるパターン"
//         code={`<p>
//   <a href="___dummy___">
//     <img alt="">
//     <span>すてきなフードデリバリー</span>
//   </a>
// </p>`}
//       >
//         <p>
//           <a
//             href=""
//             className="block w-fit mx-auto border border-slate-400 no-underline rounded overflow-hidden text-inherit"
//             onClick={(e) => {
//               e.preventDefault();
//               alert('サンプルのため画面遷移はしません');
//             }}
//           >
//             <Image
//               className="w-full"
//               {...{
//                 src: '/tools/an-alt-decision-tree/fooddelivery-banner.png',
//                 width: 168,
//                 height: 130,
//                 alt: '',
//               }}
//             />
//             <span className="p-2 block bg-slate-00">すてきなフードデリバリー</span>
//           </a>
//         </p>
//       </SampleCodeWrapper>

//       <SampleCodeWrapper
//         title="機能を持つ画像：alt属性を空にできないパターン"
//         code={`<p>
//   <a href="___dummy___">
//     <img alt="すてきなフードデリバリー">
//   </a>
//   <span>すてきなフードデリバリー</span>
// </p>`}
//       >
//         <p className="block w-fit mx-auto border border-slate-400 no-underline rounded overflow-hidden text-inherit">
//           <a
//             href=""
//             onClick={(e) => {
//               e.preventDefault();
//               alert('サンプルのため画面遷移はしません');
//             }}
//           >
//             <Image
//               className="w-full"
//               {...{
//                 src: '/tools/an-alt-decision-tree/fooddelivery-banner.png',
//                 width: 168,
//                 height: 130,
//                 alt: '',
//               }}
//             />
//           </a>
//           <span className="p-2 block bg-slate-00">すてきなフードデリバリー</span>
//         </p>
//       </SampleCodeWrapper>
//     </>
//   );
// };

// const SummaryEmptyAltForPresentaion = () => {
//   return (
//     <>
//       <p className="mb-6">
//         <code>alt</code>属性には空文字を指定してください。
//       </p>

//       <SampleCodeWrapper code={`<img alt="">`}>
//         <SamplePresentation />
//       </SampleCodeWrapper>

//       <p>
//         詳しくは
//         <a href="https://www.w3.org/WAI/tutorials/images/decorative/" hrefLang="en">
//           「装飾目的の画像」（外部サイト）
//         </a>
//         を参照してください。
//       </p>
//     </>
//   );
// };

// const ImageWrapper = ({ caption = '画像のイメージ', children }: { caption?: string; children: React.ReactNode }) => {
//   return (
//     <figure className="text-center mb-8 border border-slate-400 max-w-lg mx-auto p-4 pt-6 rounded-2xl">
//       {children}

//       <figcaption className="text-sm">※ {caption}</figcaption>
//     </figure>
//   );
// };

const Shrimp = () => {
  return (
    <div className="my-8 sm:my-10">
      <Image
        src="/tools/an-alt-decision-tree/shrimp.png"
        width={200}
        height={217}
        alt=""
        className="mx-auto max-w-[50%]"
      />
    </div>
  );
};

export const AnAltDecisionTreeQuestion = ({ index }: { index: number }) => {
  // const [isVisible, setIsVisible] = useState(true);
  // const ToggleButton = () => {
  //   return (
  //     <p className="text-right mb-6">
  //       <button
  //         aria-live="polite"
  //         className="bg-slate-100 p-2 rounded border border-solid border-black"
  //         onClick={() => {
  //           setIsVisible(!isVisible);
  //         }}
  //       >
  //         {isVisible ? '画像を消す' : '画像を表示する'}
  //       </button>
  //     </p>
  //   );
  // };

  switch (index) {
    case 0:
      return (
        <>
          <Heading index={index}>
            文字は
            <span className="inline-block">含まれていますか？</span>
          </Heading>
          {/* <ImageWrapper caption="文字が入っている画像の例">
            <Image
              src="/tools/an-alt-decision-tree/fooddelivery-banner.png"
              width={336}
              height={260}
              alt="すてきなフードデリバリー"
              className="mx-auto mb-4"
            />
          </ImageWrapper> */}
          <Shrimp />

          <p className="mx-auto max-w-xl px-4 sm:px-0 sm:text-center">
            画像の中に文字が書かれているかを確認してください。
          </p>
        </>
      );

    case 1:
      return (
        <>
          <Heading index={index}>その画像はクリックできますか？</Heading>

          {/* <ImageWrapper caption="クリックできる画像の例">
            <ToggleButton />

            <p className="mb-6">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  alert('サンプルのため画面遷移はしません');
                }}
                className={clsx([
                  isVisible === false ? 'border-gray-300' : 'border-transparent',
                  'border inline-block',
                ])}
              >
                <Image
                  src="/tools/an-alt-decision-tree/icon-home.png"
                  width={90}
                  height={90}
                  alt="ホーム"
                  className={clsx([isVisible === false ? 'invisible' : '', 'mx-auto'])}
                />
              </a>
            </p>
          </ImageWrapper> */}
          <Shrimp />

          <div className="mx-auto max-w-xl px-4 sm:px-0 sm:text-center">
            <p className="mb-2 sm:mb-0">
              リンクまたはボタンなど、
              <span className="inline-block sm:inline">機能のために使用されているかを確認してください。</span>
            </p>
            <p>
              画像が存在しない場合、
              <span className="inline-block sm:inline">リンクまたはボタンの機能を理解できなくなりますか？</span>
            </p>
          </div>
        </>
      );

    case 2:
      return (
        <>
          <Heading index={index}>画像には意味がありますか？</Heading>

          {/* <ImageWrapper caption="意味のある画像の例">
            <div className="mb-4">
              <ToggleButton />

              <SampleInfomativeImage isVisible={isVisible} />

              <p className="mb-12">毎月どれくらい食べられているか集計してみました！</p>

              <p className="mb-6">
                <span
                  className={clsx([
                    isVisible === false ? 'border-gray-300' : 'border-transparent',
                    'border inline-block',
                  ])}
                >
                  <Image
                    src="/tools/an-alt-decision-tree/graph.png"
                    width={300}
                    height={300}
                    alt="棒グラフ：１週間あたりの海老の消費量（架空のデータ） 日曜日80 月曜日20 火曜日30 水曜日60 木曜日20 金曜日100 土曜日90"
                    className={clsx([isVisible ? '' : 'invisible', 'mx-auto'])}
                  />
                </span>
              </p>

              <p>私のまわりだけでこんなに食べられてるんですね！</p>
              <p className={isVisible ? 'invisible' : 'font-bold'}>（どれだけ？）</p>

              <p className="mb-10 flex items-center justify-center">
                <span
                  className={clsx([
                    isVisible === false ? 'border-gray-300' : 'border-transparent',
                    'border inline-block',
                  ])}
                >
                  <Image
                    src="/tools/an-alt-decision-tree/icon-phone.png"
                    width={30}
                    height={30}
                    alt="電話番号"
                    className={isVisible ? '' : 'invisible'}
                  />
                </span>
                <span className="ml-3 pt-7">
                  0000-000-0000
                  <span className={clsx([isVisible && 'invisible', 'font-bold block text-left'])}>（何の数字？）</span>
                </span>
              </p>
            </div>
          </ImageWrapper> */}

          <Shrimp />

          <p className="mx-auto max-w-xl px-4 sm:px-0 sm:text-center">
            その画像がないとコンテンツの意味が変わったり、
            <span className="sm:inline-block">伝わらなくなるかを確認してください。</span>
          </p>
        </>
      );

    case 3:
      return (
        <>
          <Heading index={index}>装飾目的の画像ですか？</Heading>

          {/* <ImageWrapper caption="装飾目的の画像の例">
            <ToggleButton />

            <div className="mb-10">
              <p className="mb-10">
                <a
                  href="/"
                  className="flex justify-center items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('サンプルのため画面遷移はしません');
                  }}
                >
                  <span
                    className={clsx([
                      isVisible === false ? 'border-gray-300' : 'border-transparent',
                      'border inline-block',
                    ])}
                  >
                    <Image
                      src="/tools/an-alt-decision-tree/icon-home.png"
                      width={30}
                      height={30}
                      alt=""
                      className={isVisible === false ? 'invisible' : ''}
                    />
                  </span>
                  <span className="ml-2">ホームに戻る</span>
                </a>
              </p>

              <p className="mb-4 font-bold text-left">おいしいお寿司屋さんの説明</p>

              <SamplePresentation isVisible={isVisible} />
            </div>
          </ImageWrapper> */}

          <Shrimp />

          <p className="mx-auto max-w-xl px-4 sm:px-0 sm:text-center">
            純粋に装飾のため、
            <span className="inline-block">またはユーザーに直接関係しないものですか？</span>
          </p>
        </>
      );
  }
};

export const AnAltDecisionTreeException = () => {
  return (
    <>
      <Heading>例外パターンのようです</Heading>

      <div className="mb-8 mt-12">
        <Image src="/tools/an-alt-decision-tree/exception.png" width={246} height={292} alt="" className="mx-auto" />
      </div>

      <div className="px-4 sm:px-0 sm:text-center">
        <p className="mb-4">この決定木はすべてのケースをカバーしているわけではありません。</p>

        <p>
          どのような代替テキストを設定すればいいか不明な場合は、
          <span className="inline-block">
            詳しくは
            <a href="/documents/translations/w3c/wai/tutorials/images/">Image Tutorial の日本語訳</a>
            を参照してください。
          </span>
        </p>
      </div>
    </>
  );
};

// const AnswerContainsText = () => {
//   return (
//     <>
//       <div className="mb-14 sm:mb-40">
//         <h3 className="p-2 px-3 text-lg font-bold rounded mb-6 bg-slate-200">
//           側に同じ内容のテキストが書かれている場合
//         </h3>
//         <div className="py-2 px-3">
//           <p className="mb-8">
//             <code>alt</code>属性には空文字を指定してください。
//           </p>

//           <SampleCodeWrapper
//             title="alt属性を空にできるパターン"
//             code={`<p>
//   <img alt="">
//   <span>すてきなフードデリバリー</span>
// </p>`}
//           >
//             <p className="block w-fit mx-auto border border-slate-400 no-underline rounded overflow-hidden text-inherit">
//               <Image
//                 className="w-full"
//                 {...{
//                   src: '/tools/an-alt-decision-tree/fooddelivery-banner.png',
//                   width: 168,
//                   height: 130,
//                   alt: '',
//                 }}
//               />
//               <span className="p-2 block bg-slate-00">すてきなフードデリバリー</span>
//             </p>
//           </SampleCodeWrapper>

//           <p className="mb-6">
//             ただしリンクなどの機能を持つものの場合は、その機能の中で近くの文字が含まれているときに限り、
//             <code>alt</code>属性には空文字を指定してください。
//           </p>

//           <SampleDuplicateText />

//           <p>
//             詳しくは
//             <a href="https://www.w3.org/WAI/tutorials/images/decorative/" hrefLang="en">
//               「装飾目的の画像」（外部サイト）
//             </a>
//             を参照してください。
//           </p>
//         </div>
//       </div>

//       <div className="mb-14 sm:mb-40">
//         <h3 className="p-2 px-3 text-lg font-bold rounded mb-6 bg-slate-200">
//           雰囲気づくりや、見た目のためにだけ置かれている場合
//         </h3>
//         <div className="py-2 px-3">
//           <SummaryEmptyAltForPresentaion />
//         </div>
//       </div>

//       <div className="mb-14 sm:mb-40">
//         <h3 className="p-2 px-3 text-lg font-bold rounded mb-6 bg-slate-200">
//           アイコンなど、特定の機能を説明する役割がある場合
//         </h3>
//         <div className="py-2 px-3">
//           <p className="mb-6">
//             <code>alt</code>属性に画像の役割を記述してください。
//           </p>

//           <div className="rounded-lg overflow-hidden mb-4">
//             <Code code={`<img alt="NEW">`} />
//           </div>

//           <div className="rounded-lg overflow-hidden mb-6">
//             <Code code={`<img alt="おすすめ">`} />
//           </div>

//           <p>
//             詳しくは
//             <a href="https://www.w3.org/WAI/tutorials/images/functional/" hrefLang="en">
//               「機能を持つ画像」（外部サイト）
//             </a>
//             を参照してください。
//           </p>
//         </div>
//       </div>

//       <div className="mb-14 sm:mb-40">
//         <h3 className="p-2 px-3 text-lg font-bold rounded mb-6 bg-slate-200">ロゴや文字画像などの場合</h3>
//         <div className="py-2 px-3">
//           <p className="mb-6">
//             <code>alt</code>属性に画像に書かれているテキストを含めてください。
//           </p>

//           <div className="rounded-lg overflow-hidden mb-6">
//             <Code code={`<img alt="テキストテキスト">`} />
//           </div>

//           <p>
//             詳しくは「
//             <a href="https://www.w3.org/WAI/tutorials/images/textual/#styled-text-decorative-effect" hrefLang="en">
//               テキストの画像（外部サイト）
//             </a>
//             」 参照
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

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
