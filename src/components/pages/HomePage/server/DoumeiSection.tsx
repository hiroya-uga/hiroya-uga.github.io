import { Doumei } from '@/components/ui/embed/Doumei';

export const DoumeiSection = () => {
  return (
    <div className="w640:grid w640:gap-x-48PX border-t-secondary pt-(--x-section-padding-top) mt-(--x-section-margin-top) border-t border-dashed">
      <h2 className="col-start-1 col-end-2 row-start-1 row-end-2">Doumei banners</h2>
      <p className="w640:mb-7 mb-3.5">古き良き同盟リンク集。</p>

      <Doumei />
    </div>
  );
};
