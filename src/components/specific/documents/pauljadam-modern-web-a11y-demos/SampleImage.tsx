import Image from 'next/image';

export const SampleImage = ({
  filename,
  ...props
}: Pick<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'height' | 'width' | 'alt' | 'srcSet' | 'title'
> & {
  filename: string;
  longdesc?: string;
}) => {
  return (
    // @ts-ignore
    <Image src={`/documents/translations/pauljadam-modern-web-a11y-demos/img/${filename}`} {...props} />
  );
};
