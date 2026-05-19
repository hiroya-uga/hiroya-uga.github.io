export const RelatedResourceBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="mt-24 overflow-hidden rounded-md border border-[#015a9c]">
      <h2 className="w640:px-6 w640:py-4 w640:text-2xl m-0 bg-[#015a9c] px-4 py-2 text-xl text-white">
        <span id="related" className="target">
          関連するWCAGリソース
        </span>
      </h2>
      <div className="w640:px-6 w640:pb-10 w640:pt-8 px-4 pb-8 pt-6">
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
