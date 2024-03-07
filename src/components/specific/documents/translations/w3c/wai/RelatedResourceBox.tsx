export const RelatedResourceBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="mt-24 overflow-hidden rounded-md border border-[#015a9c]">
      <h2 className="m-0 bg-[#015a9c] px-4 py-2 text-xl text-white sm:px-6 sm:py-4 sm:text-2xl">
        <span id="related" className="target">
          関連するWCAGリソース
        </span>
      </h2>
      <div className="px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
        <p className="mb-8">
          これらのチュートリアルは、さまざまな状況でアクセシビリティを実装するためのベストプラクティスガイダンスを提供します。
          <span className="inline-block">
            このページでは、次のようなWCAG達成基準とさまざまな適合レベルの達成方法を組み合わせました。
          </span>
        </p>

        {children}
      </div>
    </aside>
  );
};
