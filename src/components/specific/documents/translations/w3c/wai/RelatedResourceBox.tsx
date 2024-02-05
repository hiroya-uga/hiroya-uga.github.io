export const RelatedResourceBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="mt-24 border rounded-md border-[#015a9c] overflow-hidden">
      <h2 className="m-0 px-4 py-2 bg-[#015a9c] text-white text-xl sm:text-2xl sm:px-6 sm:py-4">
        <span id="related" className="target">
          関連するWCAGリソース
        </span>
      </h2>
      <div className="pt-6 px-4 pb-8 sm:px-6 sm:pt-8 sm:pb-10">
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
