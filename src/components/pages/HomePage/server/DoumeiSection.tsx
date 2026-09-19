import { Doumei } from '@/components/ui/embed/Doumei';

export const DoumeiSection = () => {
  return (
    <div className="border-t-secondary pt-(--x-section-padding-top) mt-(--x-section-margin-top) border-t border-dashed">
      <h2>Doumei banners</h2>
      <p className="w640:mb-7 mb-3.5">古き良き同盟リンク集。</p>

      <Doumei />
    </div>
  );
};
