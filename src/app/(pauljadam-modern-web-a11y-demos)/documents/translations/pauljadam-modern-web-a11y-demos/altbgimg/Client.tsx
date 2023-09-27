'use client';

export const DivWithOnClickEvent = () => {
  return (
    <div className="bg-img" tabIndex={0} onClick={() => alert('クリックイベントが発火しました')}>
      Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。
    </div>
  );
};
